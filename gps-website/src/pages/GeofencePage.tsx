import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Plus, Pencil, Trash2, Search,
  Shield, AlertTriangle, CircleDot, Square, Hexagon,
  ChevronRight, Bell, Eye,
} from 'lucide-react';

interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon' | 'rectangle';
  status: 'active' | 'inactive';
  alerts: number;
  radius?: string;
  color: string;
  vehicles: number;
  x: number;
  y: number;
  size: number;
}

const geofences: Geofence[] = [
  { id: 'GF-001', name: 'Main Depot Zone', type: 'circle', status: 'active', alerts: 3, radius: '500m', color: '#3396ff', vehicles: 12, x: 45, y: 40, size: 12 },
  { id: 'GF-002', name: 'Downtown Restricted', type: 'polygon', status: 'active', alerts: 8, color: '#ef4444', vehicles: 5, x: 60, y: 30, size: 15 },
  { id: 'GF-003', name: 'Warehouse District', type: 'rectangle', status: 'active', alerts: 1, color: '#17b364', vehicles: 8, x: 30, y: 55, size: 10 },
  { id: 'GF-004', name: 'School Zone Alpha', type: 'circle', status: 'active', alerts: 12, radius: '200m', color: '#f59e0b', vehicles: 3, x: 70, y: 60, size: 8 },
  { id: 'GF-005', name: 'Highway Corridor', type: 'polygon', status: 'inactive', alerts: 0, color: '#8b5cf6', vehicles: 0, x: 20, y: 35, size: 18 },
  { id: 'GF-006', name: 'Client Site - Acme', type: 'circle', status: 'active', alerts: 2, radius: '300m', color: '#06b6d4', vehicles: 4, x: 55, y: 70, size: 9 },
];

export default function GeofencePage() {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const filteredZones = geofences.filter((z) =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selected = geofences.find((z) => z.id === selectedZone);

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
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
        <button onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Zone
        </button>
      </header>

      <div className="flex-1 flex relative">
        {/* Sidebar */}
        <div className="w-80 glass-strong border-r border-white/5 flex flex-col z-20">
          <div className="p-4 border-b border-white/5">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/5"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{filteredZones.length} zones</span>
              <span>{geofences.filter((z) => z.status === 'active').length} active</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredZones.map((z) => (
              <motion.button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                className={`w-full p-4 text-left border-b border-white/5 transition-all ${
                  selectedZone === z.id ? 'bg-primary-500/5 border-l-2 border-l-primary-500' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                  <span className="text-sm font-medium text-white flex-1">{z.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    z.status === 'active' ? 'bg-accent-500/10 text-accent-400' : 'bg-gray-500/10 text-gray-500'
                  }`}>
                    {z.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    {z.type === 'circle' ? <CircleDot className="w-3 h-3" /> :
                     z.type === 'polygon' ? <Hexagon className="w-3 h-3" /> :
                     <Square className="w-3 h-3" />}
                    {z.type}
                  </span>
                  {z.alerts > 0 && (
                    <span className="text-xs text-yellow-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {z.alerts}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1600&q=80"
            alt="Map"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-dark-950/40" />

          {/* Geofence Zones */}
          {filteredZones.map((z) => (
            <motion.div
              key={z.id}
              className="absolute cursor-pointer z-10"
              style={{ left: `${z.x}%`, top: `${z.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => setSelectedZone(z.id)}
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative group">
                {/* Zone Visualization */}
                <div
                  className={`rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedZone === z.id ? 'ring-4 ring-white/20' : ''
                  } ${z.status === 'inactive' ? 'opacity-40' : ''}`}
                  style={{
                    width: `${z.size * 5}px`,
                    height: `${z.size * 5}px`,
                    borderColor: z.color,
                    backgroundColor: `${z.color}20`,
                  }}
                >
                  <MapPin className="w-4 h-4" style={{ color: z.color }} />
                </div>

                {/* Pulse */}
                {z.status === 'active' && (
                  <motion.div
                    animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                    style={{ borderColor: z.color, border: '1px solid' }}
                  />
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-dark-900/95 px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 z-20">
                  <p className="font-medium text-white">{z.name}</p>
                  <p className="text-gray-400">{z.vehicles} vehicles • {z.alerts} alerts</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Selected Zone Detail */}
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
                  <button onClick={() => setSelectedZone(null)}
                    className="p-1 rounded hover:bg-white/10 transition-colors text-gray-500">✕</button>
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
                  {selected.radius && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Radius</span>
                      <span className="text-white">{selected.radius}</span>
                    </div>
                  )}
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
                  <button className="px-3 py-2 bg-white/5 rounded-xl text-xs text-gray-300 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Zone Modal */}
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
                  onClick={(e) => e.stopPropagation()}
                  className="glass-strong rounded-2xl p-6 w-96"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Create Geofence Zone</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Zone Name</label>
                      <input type="text" placeholder="e.g. Warehouse Zone B"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Shape</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['circle', 'polygon', 'rectangle'].map((s) => (
                          <button key={s}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary-500/30 transition-colors flex flex-col items-center gap-1.5">
                            {s === 'circle' ? <CircleDot className="w-5 h-5 text-gray-400" /> :
                             s === 'polygon' ? <Hexagon className="w-5 h-5 text-gray-400" /> :
                             <Square className="w-5 h-5 text-gray-400" />}
                            <span className="text-xs text-gray-400 capitalize">{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1.5 block">Alert Triggers</label>
                      <div className="space-y-2">
                        {['Vehicle enters zone', 'Vehicle exits zone', 'Speed limit exceeded'].map((t) => (
                          <label key={t} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                            <input type="checkbox" className="accent-primary-500 rounded" />
                            <span className="text-sm text-gray-300">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowCreate(false)}
                      className="flex-1 px-4 py-2.5 bg-white/5 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => setShowCreate(false)}
                      className="flex-1 px-4 py-2.5 bg-primary-500 rounded-xl text-sm text-white font-medium hover:bg-primary-600 transition-colors">
                      Draw on Map
                    </button>
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
