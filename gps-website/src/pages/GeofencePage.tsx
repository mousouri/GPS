import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Plus, Pencil, Search,
  Shield, AlertTriangle, CircleDot, Square, Hexagon,
  ChevronRight, Bell, Eye, ExternalLink,
} from 'lucide-react';
import { buildEmbeddedMapUrl, buildOpenMapLink, createGeofence, getGeofences, type Geofence } from '../lib/api';

export default function GeofencePage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [createState, setCreateState] = useState({
    name: '',
    type: 'circle' as 'circle' | 'polygon' | 'rectangle',
    radiusMeters: 500,
    color: '#06b6d4',
    latitude: 40.7128,
    longitude: -74.006,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadGeofences() {
      try {
        const data = await getGeofences();
        if (!isMounted) {
          return;
        }
        setGeofences(data);
        setSelectedZoneId(data[0]?.id ?? null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load geofences.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGeofences();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredZones = useMemo(() => (
    geofences.filter((zone) => zone.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [geofences, searchQuery]);

  const selected = filteredZones.find((zone) => zone.id === selectedZoneId)
    ?? geofences.find((zone) => zone.id === selectedZoneId)
    ?? filteredZones[0]
    ?? geofences[0]
    ?? null;

  const submitCreate = async () => {
    setError('');

    try {
      const next = await createGeofence(createState);
      const latest = next[next.length - 1];
      setGeofences(next);
      setSelectedZoneId(latest?.id ?? null);
      setShowCreate(false);
      setCreateState({
        name: '',
        type: 'circle',
        radiusMeters: 500,
        color: '#06b6d4',
        latitude: selected?.lat ?? 40.7128,
        longitude: selected?.lng ?? -74.006,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create zone.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Geofence Manager</span>
          </div>
        </div>
        <button
          onClick={() => setShowCreate((current) => !current)}
          className="px-4 py-2 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Zone
        </button>
      </header>

      <div className="flex-1 flex relative">
        <div className="w-80 glass-strong border-r border-white/5 flex flex-col z-20">
          <div className="p-4 border-b border-white/5">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/5"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filteredZones.length} zones</span>
              <span>{geofences.filter((zone) => zone.status === 'active').length} active</span>
            </div>
            {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredZones.map((zone) => (
              <motion.button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`w-full p-4 text-left border-b border-white/5 transition-all ${
                  selected?.id === zone.id ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                  <span className="text-sm font-medium text-white flex-1">{zone.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    zone.status === 'active' ? 'bg-accent-500/10 text-accent-400' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {zone.status}
                  </span>
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

        <div className="flex-1 relative overflow-hidden bg-dark-950">
          {selected ? (
            <>
              <iframe
                title={`${selected.name} geofence map`}
                src={buildEmbeddedMapUrl(selected.lat, selected.lng)}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-dark-950/15" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              No geofences available.
            </div>
          )}

          {selected && (
            <div
              className="absolute z-10 rounded-full border-2"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(Math.max(selected.radius / 4, 120), 320)}px`,
                height: `${Math.min(Math.max(selected.radius / 4, 120), 320)}px`,
                borderColor: selected.color,
                backgroundColor: `${selected.color}20`,
              }}
            />
          )}

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-4 right-4 w-72 glass-strong rounded-2xl p-5 z-20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selected.color }} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-sm">{selected.name}</h3>
                    <p className="text-xs text-gray-500">{selected.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedZoneId(null)}
                    className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Type</span>
                    <span className="text-white capitalize">{selected.type}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Status</span>
                    <span className={selected.status === 'active' ? 'text-accent-400' : 'text-gray-500'}>{selected.status}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Radius</span>
                    <span className="text-white">{selected.radius}m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Vehicles Inside</span>
                    <span className="text-white">{selected.vehicles}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Alerts (7d)</span>
                    <span className={selected.alerts > 5 ? 'text-yellow-400' : 'text-white'}>{selected.alerts}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-white/5 rounded-xl text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-white/5 rounded-xl text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Bell className="w-3 h-3" /> Alerts
                  </button>
                  <a
                    href={buildOpenMapLink(selected.lat, selected.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-white/5 rounded-xl text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3 h-3" />
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showCreate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-dark-950/60 z-30 flex items-center justify-center"
                onClick={() => setShowCreate(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(event) => event.stopPropagation()}
                  className="glass-strong rounded-2xl p-6 w-96"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Create Geofence Zone</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Zone Name</label>
                      <input
                        type="text"
                        value={createState.name}
                        onChange={(event) => setCreateState((current) => ({ ...current, name: event.target.value }))}
                        placeholder="e.g. Warehouse Zone B"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Shape</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['circle', 'polygon', 'rectangle'] as const).map((shape) => (
                          <button
                            key={shape}
                            type="button"
                            onClick={() => setCreateState((current) => ({ ...current, type: shape }))}
                            className={`px-3 py-2 rounded-xl text-xs capitalize transition-colors ${
                              createState.type === shape ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {shape}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Radius (m)</label>
                        <input
                          type="number"
                          value={createState.radiusMeters}
                          onChange={(event) => setCreateState((current) => ({ ...current, radiusMeters: Number(event.target.value) }))}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Color</label>
                        <input
                          type="color"
                          value={createState.color}
                          onChange={(event) => setCreateState((current) => ({ ...current, color: event.target.value }))}
                          className="w-full h-[42px] px-2 py-2 bg-white/5 border border-white/10 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Latitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={createState.latitude}
                          onChange={(event) => setCreateState((current) => ({ ...current, latitude: Number(event.target.value) }))}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1.5 block">Longitude</label>
                        <input
                          type="number"
                          step="0.0001"
                          value={createState.longitude}
                          onChange={(event) => setCreateState((current) => ({ ...current, longitude: Number(event.target.value) }))}
                          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCreate(false)}
                        className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={submitCreate}
                        className="flex-1 px-4 py-2.5 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                      >
                        Save Zone
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-950/60 text-sm text-gray-400 z-20">
              Loading geofences...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
