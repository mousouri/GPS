import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, LogOut, Bell, Search, ChevronDown,
  LayoutDashboard, Truck, Map, BarChart3, Settings, 
  AlertTriangle, Battery, Fuel, Clock, TrendingUp,
  Navigation, Shield, Users, Activity,
} from 'lucide-react';

// Sample fleet data
const vehicles = [
  { id: 'V-001', name: 'Truck Alpha', status: 'active', speed: 62, fuel: 78, battery: 95, driver: 'Mike Ross', location: 'Highway I-95, NJ', lat: 40.7128, lng: -74.006 },
  { id: 'V-002', name: 'Van Beta', status: 'active', speed: 45, fuel: 54, battery: 88, driver: 'Lisa Chen', location: 'Route 66, AZ', lat: 35.2, lng: -111.6 },
  { id: 'V-003', name: 'Truck Gamma', status: 'idle', speed: 0, fuel: 92, battery: 100, driver: 'Sam Patel', location: 'Depot A, Houston TX', lat: 29.76, lng: -95.37 },
  { id: 'V-004', name: 'Sedan Delta', status: 'active', speed: 38, fuel: 31, battery: 72, driver: 'Amy Woods', location: 'I-10 Freeway, LA', lat: 34.05, lng: -118.24 },
  { id: 'V-005', name: 'Van Epsilon', status: 'maintenance', speed: 0, fuel: 65, battery: 45, driver: 'Dan Kim', location: 'Service Center, Dallas', lat: 32.78, lng: -96.8 },
  { id: 'V-006', name: 'Truck Zeta', status: 'active', speed: 71, fuel: 43, battery: 90, driver: 'Rob Taylor', location: 'I-80 East, PA', lat: 41.2, lng: -77.0 },
];

const alerts = [
  { id: 1, type: 'warning', message: 'Vehicle V-004 fuel level below 35%', time: '5 min ago' },
  { id: 2, type: 'info', message: 'Vehicle V-003 has been idle for 2 hours', time: '12 min ago' },
  { id: 3, type: 'danger', message: 'Vehicle V-005 requires scheduled maintenance', time: '1 hr ago' },
  { id: 4, type: 'info', message: 'New geofence alert: V-001 entering Zone B', time: '2 hr ago' },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Truck, label: 'Fleet' },
  { icon: Map, label: 'Live Map' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: AlertTriangle, label: 'Alerts' },
  { icon: Settings, label: 'Settings' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeVehicles = vehicles.filter((v) => v.status === 'active').length;
  const idleVehicles = vehicles.filter((v) => v.status === 'idle').length;
  const maintenanceVehicles = vehicles.filter((v) => v.status === 'maintenance').length;

  return (
    <div className="min-h-screen bg-dark-950 flex pt-0">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 top-0 bottom-0 w-64 glass-strong border-r border-white/5 z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              Track<span className="gradient-text">Pro</span>
            </span>
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                item.active
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.plan} Plan</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search vehicles, drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/5 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-950" />
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 glass-strong rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="p-4 border-b border-white/5">
                        <h3 className="font-semibold text-white">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {alerts.map((alert) => (
                          <div key={alert.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                                alert.type === 'danger' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <div>
                                <p className="text-sm text-gray-300">{alert.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-300 hidden sm:inline">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 mt-1">Here's your fleet overview for today</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Vehicles', value: vehicles.length.toString(), icon: Truck, color: 'primary', change: '+2 this month' },
              { label: 'Active Now', value: activeVehicles.toString(), icon: Activity, color: 'accent', change: 'Tracking live' },
              { label: 'Idle', value: idleVehicles.toString(), icon: Clock, color: 'yellow', change: 'At depots' },
              { label: 'Maintenance', value: maintenanceVehicles.toString(), icon: AlertTriangle, color: 'red', change: '1 scheduled' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-primary-500/10 text-primary-400' :
                    stat.color === 'accent' ? 'bg-accent-500/10 text-accent-400' :
                    stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          {/* Map + Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary-400" />
                  Live Fleet Map
                </h3>
                <span className="text-xs text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full">{activeVehicles} vehicles active</span>
              </div>
              <div className="relative h-80">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
                  alt="Fleet Map"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                {/* Map pins */}
                {vehicles.filter(v => v.status === 'active').map((v, i) => (
                  <motion.div
                    key={v.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="absolute"
                    style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 15}%` }}
                  >
                    <div className="relative group/pin cursor-pointer">
                      <div className="w-4 h-4 bg-accent-500 rounded-full border-2 border-white shadow-lg shadow-accent-500/50 animate-pulse" />
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-dark-900/95 backdrop-blur px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity border border-white/10">
                        <p className="font-medium text-white">{v.name}</p>
                        <p className="text-gray-400">{v.speed} mph</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-300">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent-500" /> Active</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Idle</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Maintenance</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-yellow-400" />
                  Recent Alerts
                </h3>
                <span className="text-xs text-gray-500">{alerts.length} new</span>
              </div>
              <div className="divide-y divide-white/5">
                {alerts.map((alert, i) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                        alert.type === 'danger' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm text-gray-300">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Vehicle Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary-400" />
                Fleet Vehicles
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{vehicles.length} vehicles</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vehicles.map((v, i) => (
                    <motion.tr
                      key={v.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{v.name}</p>
                          <p className="text-xs text-gray-500">{v.id}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{v.driver}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          v.status === 'active' ? 'bg-accent-500/10 text-accent-400' :
                          v.status === 'idle' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            v.status === 'active' ? 'bg-accent-400' :
                            v.status === 'idle' ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`} />
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-sm text-gray-300">{v.speed} mph</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-3.5 h-3.5 text-gray-500" />
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${v.fuel > 50 ? 'bg-accent-500' : v.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${v.fuel}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{v.fuel}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Battery className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-sm text-gray-300">{v.battery}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400 max-w-[200px] truncate">{v.location}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
