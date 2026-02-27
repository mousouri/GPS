import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin, ArrowLeft, Search, Layers, ZoomIn, ZoomOut,
  Navigation, Truck, Filter, ExternalLink,
} from 'lucide-react';
import { buildEmbeddedMapUrl, buildOpenMapLink, getVehicles, type Vehicle } from '../lib/api';

export default function LiveMapPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'idle' | 'maintenance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadVehicles() {
      try {
        const data = await getVehicles();
        if (!isMounted) {
          return;
        }
        setVehicles(data);
        setSelectedVehicleId(data[0]?.id ?? null);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load vehicles.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVehicles = useMemo(() => (
    vehicles.filter((vehicle) => {
      if (filter !== 'all' && vehicle.status !== filter) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return vehicle.name.toLowerCase().includes(query) || vehicle.driver.toLowerCase().includes(query);
      }
      return true;
    })
  ), [filter, searchQuery, vehicles]);

  const selected = filteredVehicles.find((vehicle) => vehicle.id === selectedVehicleId)
    ?? vehicles.find((vehicle) => vehicle.id === selectedVehicleId)
    ?? filteredVehicles[0]
    ?? vehicles[0]
    ?? null;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between z-30">
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
          Live • {vehicles.filter((vehicle) => vehicle.status === 'active').length} vehicles active
        </div>
      </header>

      <div className="flex-1 flex relative">
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 glass-strong border-r border-white/5 flex flex-col z-20"
        >
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
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
                onClick={() => setSelectedVehicleId(vehicle.id)}
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

        <div className="flex-1 relative overflow-hidden bg-dark-950">
          {selected ? (
            <>
              <iframe
                title={`${selected.name} live location`}
                src={buildEmbeddedMapUrl(selected.lat, selected.lng)}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-dark-950/10" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              {error || 'No vehicles available.'}
            </div>
          )}

          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
              <ZoomIn className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
              <Layers className="w-4 h-4 text-white" />
            </button>
            <button className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors">
              <Filter className="w-4 h-4 text-white" />
            </button>
          </div>

          {selected && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 left-6 right-6 max-w-xl glass-strong rounded-2xl p-5 z-20"
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

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-950/50 text-sm text-gray-400 z-10">
              Loading vehicles...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
