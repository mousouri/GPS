import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Pencil, Search, Trash2,
  Shield, AlertTriangle, CircleDot, Square, Hexagon,
  ChevronRight, Bell, Eye, ExternalLink,
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildOpenMapLink, createGeofence, getGeofences, updateGeofence, deleteGeofence, type Geofence } from '../lib/api';

/* helper: fly map to a point */
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 14, { duration: 1 }); }, [lat, lng, map]);
  return null;
}

/* geofence centre icon */
const centreIcon = (color: string) => L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><circle cx="9" cy="9" r="8" fill="${color}" stroke="white" stroke-width="2"/></svg>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/* blank form factory */
const blankForm = (lat?: number, lng?: number) => ({
  name: '',
  type: 'circle' as 'circle' | 'polygon' | 'rectangle',
  radiusMeters: 500,
  color: '#06b6d4',
  latitude: lat ?? -6.8,
  longitude: lng ?? 39.28,
});

export default function GeofencePage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createState, setCreateState] = useState(blankForm());
  const [editState, setEditState] = useState<{
    id: string; name: string; type: 'circle' | 'polygon' | 'rectangle';
    radiusMeters: number; color: string; latitude: number; longitude: number; status: string;
  } | null>(null);

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const data = await getGeofences();
        if (!m) return;
        setGeofences(data);
        setSelectedZoneId(data[0]?.id ?? null);
      } catch (e) {
        if (!m) return;
        setError(e instanceof Error ? e.message : 'Unable to load geofences.');
      } finally { if (m) setIsLoading(false); }
    })();
    return () => { m = false; };
  }, []);

  const filteredZones = useMemo(() =>
    geofences.filter((z) => z.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [geofences, searchQuery],
  );

  const selected = filteredZones.find((z) => z.id === selectedZoneId)
    ?? geofences.find((z) => z.id === selectedZoneId)
    ?? filteredZones[0] ?? geofences[0] ?? null;

  const submitCreate = async () => {
    setError('');
    try {
      const next = await createGeofence(createState);
      const latest = next[next.length - 1];
      setGeofences(next);
      setSelectedZoneId(latest?.id ?? null);
      setShowCreate(false);
      setCreateState(blankForm(selected?.lat, selected?.lng));
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create zone.'); }
  };

  const openEdit = (zone: Geofence) => {
    setEditState({
      id: zone.id, name: zone.name, type: zone.type as 'circle' | 'polygon' | 'rectangle',
      radiusMeters: zone.radius, color: zone.color, latitude: zone.lat, longitude: zone.lng, status: zone.status,
    });
    setShowEdit(true);
  };

  const submitEdit = async () => {
    if (!editState) return;
    setError('');
    try {
      const updatedList = await updateGeofence(editState.id, {
        name: editState.name,
        type: editState.type,
        radiusMeters: editState.radiusMeters,
        color: editState.color,
        latitude: editState.latitude,
        longitude: editState.longitude,
        status: editState.status,
      });
      setGeofences(updatedList);
      setShowEdit(false);
      setEditState(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update zone.'); }
  };

  const confirmDelete = async (id: string) => {
    setError('');
    try {
      const updatedList = await deleteGeofence(id);
      setGeofences(updatedList);
      if (selectedZoneId === id) setSelectedZoneId(null);
      setShowDeleteConfirm(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to delete zone.'); }
  };

  const defaultCenter: [number, number] = [-6.8, 39.28];

  /* --- Form fields for create/edit modals --- */
  const ZoneFormFields = ({
    state, setState,
  }: {
    state: { name: string; type: string; radiusMeters: number; color: string; latitude: number; longitude: number; status?: string };
    setState: (fn: (prev: any) => any) => void;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Zone Name</label>
        <input type="text" value={state.name} onChange={(e) => setState((p: any) => ({ ...p, name: e.target.value }))}
          placeholder="e.g. Warehouse Zone B"
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1.5 block">Shape</label>
        <div className="grid grid-cols-3 gap-2">
          {(['circle', 'polygon', 'rectangle'] as const).map((shape) => (
            <button key={shape} type="button" onClick={() => setState((p: any) => ({ ...p, type: shape }))}
              className={`px-3 py-2 rounded-xl text-xs capitalize transition-colors ${
                state.type === shape ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>{shape}</button>
          ))}
        </div>
      </div>
      {state.status !== undefined && (
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {(['active', 'inactive'] as const).map((s) => (
              <button key={s} type="button" onClick={() => setState((p: any) => ({ ...p, status: s }))}
                className={`px-3 py-2 rounded-xl text-xs capitalize transition-colors ${
                  state.status === s ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Radius (m)</label>
          <input type="number" value={state.radiusMeters} onChange={(e) => setState((p: any) => ({ ...p, radiusMeters: Number(e.target.value) }))}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Color</label>
          <input type="color" value={state.color} onChange={(e) => setState((p: any) => ({ ...p, color: e.target.value }))}
            className="w-full h-[42px] px-2 py-2 bg-white/5 border border-white/10 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Latitude</label>
          <input type="number" step="0.0001" value={state.latitude} onChange={(e) => setState((p: any) => ({ ...p, latitude: Number(e.target.value) }))}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Longitude</label>
          <input type="number" step="0.0001" value={state.longitude} onChange={(e) => setState((p: any) => ({ ...p, longitude: Number(e.target.value) }))}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between z-[1000]">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Geofence Manager</span>
          </div>
        </div>
        <button onClick={() => setShowCreate((c) => !c)}
          className="px-4 py-2 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Zone
        </button>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar list */}
        <div className="w-80 glass-strong border-r border-white/5 flex flex-col z-[1000]">
          <div className="p-4 border-b border-white/5">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search zones..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/5" />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filteredZones.length} zones</span>
              <span>{geofences.filter((z) => z.status === 'active').length} active</span>
            </div>
            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredZones.map((zone) => (
              <motion.button key={zone.id} onClick={() => setSelectedZoneId(zone.id)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`w-full p-4 text-left border-b border-white/5 transition-all ${
                  selected?.id === zone.id ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''
                }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                  <span className="text-sm font-medium text-white flex-1">{zone.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    zone.status === 'active' ? 'bg-accent-500/10 text-accent-400' : 'bg-gray-500/10 text-gray-500'
                  }`}>{zone.status}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    {zone.type === 'circle' ? <CircleDot className="w-3 h-3" /> :
                     zone.type === 'polygon' ? <Hexagon className="w-3 h-3" /> :
                     <Square className="w-3 h-3" />}
                    {zone.type}
                  </span>
                  {zone.alerts > 0 && (
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {zone.alerts}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
            {!isLoading && filteredZones.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No zones match your search.</div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-950 text-sm text-gray-400 z-10">Loading geofences...</div>
          ) : (
            <MapContainer
              center={selected ? [selected.lat, selected.lng] : defaultCenter}
              zoom={selected ? 14 : 7}
              className="h-full w-full"
              style={{ background: '#0a0a0f' }}
              zoomControl={true}
            >
              <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}

              {filteredZones.map((z) => (
                <Circle key={z.id} center={[z.lat, z.lng]} radius={z.radius}
                  pathOptions={{ color: z.color, fillColor: z.color, fillOpacity: 0.15, weight: 2 }} />
              ))}
              {filteredZones.map((z) => (
                <Marker key={`m-${z.id}`} position={[z.lat, z.lng]} icon={centreIcon(z.color)}
                  eventHandlers={{ click: () => setSelectedZoneId(z.id) }}>
                  <Popup><div className="text-sm font-semibold">{z.name}<br /><span className="text-xs font-normal text-gray-500">{z.radius}m radius</span></div></Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Selected zone detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
                className="absolute top-4 right-4 w-72 glass-strong rounded-2xl p-5 z-[800]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selected.color }} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{selected.name}</h3>
                    <p className="text-xs text-gray-500">{selected.id}</p>
                  </div>
                  <button onClick={() => setSelectedZoneId(null)} className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500">✕</button>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Type</span><span className="text-white capitalize">{selected.type}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Status</span><span className={selected.status === 'active' ? 'text-accent-400' : 'text-gray-500'}>{selected.status}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Radius</span><span className="text-white">{selected.radius}m</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Vehicles Inside</span><span className="text-white">{selected.vehicles}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Alerts (7d)</span><span className={selected.alerts > 5 ? 'text-yellow-400' : 'text-white'}>{selected.alerts}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(selected)}
                    className="flex-1 px-3 py-2 bg-white/5 rounded-xl text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setShowDeleteConfirm(selected.id)}
                    className="flex-1 px-3 py-2 bg-red-500/10 rounded-xl text-xs text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1.5">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                  <a href={buildOpenMapLink(selected.lat, selected.lng)} target="_blank" rel="noreferrer"
                    className="px-3 py-2 bg-white/5 rounded-xl text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Eye className="w-3 h-3" /><ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete confirmation */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-dark-950/60 z-[900] flex items-center justify-center"
                onClick={() => setShowDeleteConfirm(null)}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-6 w-80 text-center">
                  <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Delete Zone?</h3>
                  <p className="text-sm text-gray-400 mb-5">This action cannot be undone. All alert rules for this zone will also be removed.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={() => confirmDelete(showDeleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create modal */}
          <AnimatePresence>
            {showCreate && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-dark-950/60 z-[900] flex items-center justify-center"
                onClick={() => setShowCreate(false)}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-6 w-96">
                  <h3 className="text-lg font-semibold text-white mb-4">Create Geofence Zone</h3>
                  <ZoneFormFields state={createState} setState={setCreateState} />
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowCreate(false)} className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={submitCreate} className="flex-1 px-4 py-2.5 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">Save Zone</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit modal */}
          <AnimatePresence>
            {showEdit && editState && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-dark-950/60 z-[900] flex items-center justify-center"
                onClick={() => { setShowEdit(false); setEditState(null); }}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()} className="glass-strong rounded-2xl p-6 w-96">
                  <h3 className="text-lg font-semibold text-white mb-4">Edit Zone</h3>
                  <ZoneFormFields state={editState} setState={setEditState} />
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => { setShowEdit(false); setEditState(null); }} className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors">Cancel</button>
                    <button onClick={submitEdit} className="flex-1 px-4 py-2.5 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">Update</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
