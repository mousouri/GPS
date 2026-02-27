import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin, ArrowLeft, Search, Layers, ZoomIn, ZoomOut,
  Navigation, Truck, Filter,
} from 'lucide-react';

const vehicles = [
  { id: 'V-001', name: 'Truck Alpha', status: 'active', speed: 62, driver: 'Mike Ross', location: 'Highway I-95, NJ', x: 72, y: 35 },
  { id: 'V-002', name: 'Van Beta', status: 'active', speed: 45, driver: 'Lisa Chen', location: 'Route 66, AZ', x: 28, y: 48 },
  { id: 'V-003', name: 'Truck Gamma', status: 'idle', speed: 0, driver: 'Sam Patel', location: 'Depot A, Houston TX', x: 45, y: 68 },
  { id: 'V-004', name: 'Sedan Delta', status: 'active', speed: 38, driver: 'Amy Woods', location: 'I-10 Freeway, LA', x: 15, y: 52 },
  { id: 'V-005', name: 'Van Epsilon', status: 'maintenance', speed: 0, driver: 'Dan Kim', location: 'Service Center, Dallas', x: 40, y: 58 },
  { id: 'V-006', name: 'Truck Zeta', status: 'active', speed: 71, driver: 'Rob Taylor', location: 'I-80 East, PA', x: 68, y: 28 },
  { id: 'V-007', name: 'SUV Eta', status: 'active', speed: 55, driver: 'Jen Parker', location: 'I-75 North, FL', x: 65, y: 72 },
  { id: 'V-008', name: 'Truck Theta', status: 'idle', speed: 0, driver: 'Carl Weber', location: 'Depot B, Chicago IL', x: 52, y: 30 },
];

export default function LiveMapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.driver.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selected = vehicles.find((v) => v.id === selectedVehicle);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
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
          Live • {vehicles.filter((v) => v.status === 'active').length} vehicles active
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 glass-strong border-r border-white/5 flex flex-col z-20"
        >
          {/* Search */}
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
            {/* Filters */}
            <div className="flex gap-1.5 mt-3">
              {['all', 'active', 'idle', 'maintenance'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === f ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((v) => (
              <motion.button
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`w-full p-4 text-left border-b border-white/5 transition-all ${
                  selectedVehicle === v.id ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{v.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    v.status === 'active' ? 'bg-accent-400' : v.status === 'idle' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                </div>
                <p className="text-xs text-gray-500">{v.driver}</p>
                <p className="text-xs text-gray-600 mt-1">{v.location}</p>
                {v.speed > 0 && <p className="text-xs text-accent-400 mt-1">{v.speed} mph</p>}
              </motion.button>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 text-xs text-gray-500">
            {filteredVehicles.length} vehicles shown
          </div>
        </motion.div>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
            alt="Map"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-dark-950/30" />

          {/* Vehicle Markers */}
          {filteredVehicles.map((v) => (
            <motion.div
              key={v.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute cursor-pointer z-10"
              style={{ left: `${v.x}%`, top: `${v.y}%` }}
              onClick={() => setSelectedVehicle(v.id)}
            >
              <div className="relative group">
                <motion.div
                  animate={v.status === 'active' ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute inset-0 rounded-full ${
                    v.status === 'active' ? 'bg-accent-500' : v.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
                <div className={`relative w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                  v.status === 'active' ? 'bg-accent-500 shadow-accent-500/50' : v.status === 'idle' ? 'bg-yellow-500 shadow-yellow-500/50' : 'bg-red-500 shadow-red-500/50'
                } ${selectedVehicle === v.id ? 'ring-2 ring-white/50 w-6 h-6' : ''}`}>
                  <Truck className="w-2.5 h-2.5 text-white" />
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-dark-900/95 backdrop-blur px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl">
                  <p className="font-medium text-white">{v.name}</p>
                  <p className="text-gray-400">{v.driver} • {v.speed} mph</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Map Controls */}
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

          {/* Selected Vehicle Info */}
          {selected && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 left-6 right-6 max-w-lg glass-strong rounded-2xl p-5 z-20"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{selected.name}</h3>
                  <p className="text-xs text-gray-400">{selected.id} • {selected.driver}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selected.status === 'active' ? 'bg-accent-500/10 text-accent-400' :
                  selected.status === 'idle' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 rounded-xl bg-white/5">
                  <p className="text-lg font-bold text-white">{selected.speed}</p>
                  <p className="text-xs text-gray-500">mph</p>
                </div>
                <div className="text-center p-2 rounded-xl bg-white/5 col-span-2">
                  <p className="text-sm text-white truncate">{selected.location}</p>
                  <p className="text-xs text-gray-500">Current Location</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
