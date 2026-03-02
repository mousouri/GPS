import { useEffect, useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Search,
  Navigation, ExternalLink,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buildOpenMapLink, getVehicles, type Vehicle } from '../lib/api';

/* ---------- custom coloured markers ---------- */
function vehicleIcon(status: string) {
  const colour = status === 'active' ? '#22c55e' : status === 'idle' ? '#eab308' : '#ef4444';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="${colour}"/>
    <circle cx="16" cy="15" r="7" fill="white"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

/* ---------- helper component to fly to a vehicle ---------- */
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 14, { duration: 1 }); }, [lat, lng, map]);
  return null;
}

export default function LiveMapPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'idle' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadVehicles() {
      try {
        const data = await getVehicles();
        if (!isMounted) return;
        setVehicles(data);
        setSelectedVehicleId(data[0]?.id ?? null);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : 'Unable to load vehicles.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadVehicles();
    return () => { isMounted = false; };
  }, []);

  const filteredVehicles = useMemo(() => (
    vehicles.filter((vehicle) => {
      if (filter !== 'all' && vehicle.status !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return vehicle.name.toLowerCase().includes(q) || vehicle.driver.toLowerCase().includes(q);
      }
      return true;
    })
  ), [filter, searchQuery, vehicles]);

  const selected = filteredVehicles.find((v) => v.id === selectedVehicleId)
    ?? vehicles.find((v) => v.id === selectedVehicleId)
    ?? filteredVehicles[0]
    ?? vehicles[0]
    ?? null;

  const handleSelect = (id: string) => {
    setSelectedVehicleId(id);
    markerRefs.current[id]?.openPopup();
  };

  /* default centre: Dar es Salaam */
  const defaultCenter: [number, number] = [-6.8, 39.28];

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between z-[1000]">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Live Map</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          Live • {vehicles.filter((v) => v.status === 'active').length} vehicles active
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar vehicle list */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 glass-strong border-r border-white/5 flex flex-col z-[1000]"
        >
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/5"
              />
            </div>
            <div className="flex gap-1.5 mt-3">
              {(['all', 'active', 'idle', 'maintenance'] as const).map((entry) => (
                <button
                  key={entry}
                  onClick={() => setFilter(entry)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === entry ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {entry.charAt(0).toUpperCase() + entry.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((vehicle) => (
              <motion.button
                key={vehicle.id}
                onClick={() => handleSelect(vehicle.id)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`w-full p-4 text-left border-b border-white/5 transition-all ${
                  selected?.id === vehicle.id ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{vehicle.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    vehicle.status === 'active' ? 'bg-accent-400' : vehicle.status === 'idle' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                </div>
                <p className="text-xs text-gray-500">{vehicle.driver}</p>
                <p className="text-xs text-gray-600 mt-1">{vehicle.location}</p>
                {vehicle.speed > 0 && <p className="text-xs text-accent-400 mt-1">{vehicle.speed} mph</p>}
              </motion.button>
            ))}
            {!isLoading && filteredVehicles.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No vehicles match the current filters.</div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 text-xs text-gray-500">
            {filteredVehicles.length} vehicles shown
          </div>
        </motion.div>

        {/* Leaflet Map */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-950 text-sm text-gray-400 z-10">
              Loading vehicles...
            </div>
          ) : error && vehicles.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              {error}
            </div>
          ) : (
            <MapContainer
              center={selected ? [selected.lat, selected.lng] : defaultCenter}
              zoom={selected ? 13 : 7}
              className="h-full w-full"
              style={{ background: '#0a0a0f' }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}

              {filteredVehicles.map((v) => (
                <Marker
                  key={v.id}
                  position={[v.lat, v.lng]}
                  icon={vehicleIcon(v.status)}
                  ref={(ref) => { markerRefs.current[v.id] = ref as unknown as L.Marker | null; }}
                  eventHandlers={{ click: () => setSelectedVehicleId(v.id) }}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <p className="font-semibold text-sm">{v.name}</p>
                      <p className="text-xs text-gray-500">{v.driver}</p>
                      <div className="mt-1 text-xs space-y-0.5">
                        <p>Speed: {v.speed} mph</p>
                        <p>Fuel: {v.fuel}%</p>
                        <p>Battery: {v.battery}%</p>
                        <p>{v.location}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Bottom info panel for selected vehicle */}
          {selected && !isLoading && (
            <motion.div
              key={selected.id}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 left-6 right-6 max-w-xl glass-strong rounded-2xl p-5 z-[800]"
            >
              <div className="flex items-center justify-between mb-3 gap-4">
                <div>
                  <h3 className="font-semibold text-white">{selected.name}</h3>
                  <p className="text-xs text-gray-400">{selected.id} • {selected.driver}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selected.status === 'active' ? 'bg-accent-500/10 text-accent-400' :
                    selected.status === 'idle' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </span>
                  <a
                    href={buildOpenMapLink(selected.lat, selected.lng)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
                  >
                    Open Map
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <p className="text-lg font-bold text-white">{selected.speed}</p>
                  <p className="text-xs text-gray-500">mph</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <p className="text-lg font-bold text-white">{selected.fuel}%</p>
                  <p className="text-xs text-gray-500">fuel</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <p className="text-lg font-bold text-white">{selected.battery}%</p>
                  <p className="text-xs text-gray-500">battery</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <p className="text-sm text-white truncate">{selected.location}</p>
                  <p className="text-xs text-gray-500">location</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
