import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BarChart3, Download, Calendar, ChevronDown,
  TrendingUp, TrendingDown, Fuel, Gauge, MapPin, Clock,
  FileText, Filter,
} from 'lucide-react';

const tripData = [
  { date: 'Dec 15', trips: 24, distance: 890, fuel: 120, avgSpeed: 52 },
  { date: 'Dec 16', trips: 31, distance: 1120, fuel: 148, avgSpeed: 48 },
  { date: 'Dec 17', trips: 28, distance: 980, fuel: 132, avgSpeed: 55 },
  { date: 'Dec 18', trips: 35, distance: 1340, fuel: 175, avgSpeed: 51 },
  { date: 'Dec 19', trips: 22, distance: 760, fuel: 98, avgSpeed: 49 },
  { date: 'Dec 20', trips: 29, distance: 1050, fuel: 140, avgSpeed: 53 },
  { date: 'Dec 21', trips: 33, distance: 1200, fuel: 158, avgSpeed: 50 },
];

const reports = [
  { id: 1, name: 'Fleet Performance Report', type: 'Performance', date: 'Dec 21, 2024', size: '2.4 MB', status: 'ready' },
  { id: 2, name: 'Monthly Fuel Consumption', type: 'Fuel', date: 'Dec 20, 2024', size: '1.8 MB', status: 'ready' },
  { id: 3, name: 'Driver Behavior Analysis', type: 'Safety', date: 'Dec 19, 2024', size: '3.1 MB', status: 'ready' },
  { id: 4, name: 'Route Optimization Summary', type: 'Routes', date: 'Dec 18, 2024', size: '1.2 MB', status: 'generating' },
  { id: 5, name: 'Geofence Violation Log', type: 'Compliance', date: 'Dec 17, 2024', size: '890 KB', status: 'ready' },
];

const statCards = [
  { label: 'Total Distance', value: '7,340', unit: 'miles', change: '+12%', up: true, icon: MapPin, color: 'primary' },
  { label: 'Fuel Used', value: '971', unit: 'gallons', change: '-5%', up: false, icon: Fuel, color: 'accent' },
  { label: 'Avg Speed', value: '51', unit: 'mph', change: '+3%', up: true, icon: Gauge, color: 'blue' },
  { label: 'Active Hours', value: '1,248', unit: 'hrs', change: '+8%', up: true, icon: Clock, color: 'purple' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'fuel' | 'downloads'>('overview');
  const [dateRange, setDateRange] = useState('7d');
  const maxTrips = Math.max(...tripData.map((d) => d.trips));

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Reports & Analytics</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit mb-6">
          {(['overview', 'trips', 'fuel', 'downloads'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-accent-400' : 'text-red-400'}`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{stat.label} • {stat.unit}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/5 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Fleet Activity</h3>
              <p className="text-sm text-gray-500">Daily trips and distance overview</p>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-48 mb-4">
            {tripData.map((d, i) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{d.trips}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.trips / maxTrips) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px] relative group cursor-pointer hover:from-primary-500 hover:to-primary-300"
                >
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-dark-900/95 backdrop-blur px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 z-10">
                    <p className="text-white font-medium">{d.trips} trips</p>
                    <p className="text-gray-400">{d.distance} mi • {d.fuel} gal</p>
                  </div>
                </motion.div>
                <span className="text-xs text-gray-600">{d.date.split(' ')[1]}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary-500" />
              <span className="text-xs text-gray-500">Daily Trips</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-accent-500" />
              <span className="text-xs text-gray-500">Distance (mi)</span>
            </div>
          </div>
        </motion.div>

        {/* Distance secondary chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl border border-white/5 p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Distance by Day</h3>
          <div className="space-y-3">
            {tripData.map((d) => (
              <div key={d.date} className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-16">{d.date}</span>
                <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.distance / 1400) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400"
                  />
                </div>
                <span className="text-sm text-white font-medium w-20 text-right">{d.distance} mi</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Downloaded Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
            <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors">View all</button>
          </div>
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.type} • {r.date} • {r.size}</p>
                  </div>
                </div>
                {r.status === 'ready' ? (
                  <button className="p-2 rounded-xl hover:bg-white/10 transition-colors group">
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-400" />
                  </button>
                ) : (
                  <span className="text-xs text-yellow-400 animate-pulse">Generating...</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
