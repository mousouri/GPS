import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildEmbeddedMapUrl, getDashboardData, type AlertItem, type Vehicle } from '../lib/api';
import BrandMark from '../components/BrandMark';
import {
  LogOut, Bell, Search, ChevronDown,
  LayoutDashboard, Truck, Map, BarChart3, Settings,
  AlertTriangle, Clock, Navigation, Shield, Activity, ExternalLink,
} from 'lucide-react';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true, path: '/dashboard' },
  { icon: Truck, label: 'Fleet', path: '/dashboard' },
  { icon: Map, label: 'Live Map', path: '/dashboard/map' },
  { icon: BarChart3, label: 'Reports', path: '/dashboard/reports' },
  { icon: Shield, label: 'Geofences', path: '/dashboard/geofence' },
  { icon: Settings, label: 'Settings', path: '/dashboard/profile' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    idleVehicles: 0,
    maintenanceVehicles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const response = await getDashboardData();
        if (!isMounted) {
          return;
        }
        setStats(response.stats);
        setVehicles(response.vehicles);
        setAlerts(response.alerts);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!searchQuery.trim()) {
      return true;
    }

    const query = searchQuery.toLowerCase();
    return (
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.driver.toLowerCase().includes(query) ||
      vehicle.location.toLowerCase().includes(query)
    );
  });

  const highlightedVehicle = filteredVehicles[0] ?? vehicles[0] ?? null;

  return (
    <div className="min-h-screen bg-dark-950 flex pt-0">
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed left-0 top-0 bottom-0 w-64 glass-strong border-r border-white/5 z-50 flex flex-col"
      >
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark className="h-9 w-auto rounded-xl" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.label} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  item.active
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user?.avatar || '/images/person-man-2.jpg'}
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

      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-40 glass-strong border-b border-white/5">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search vehicles, drivers..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/5 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications((current) => !current)}
                  className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-400" />
                  {alerts.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-950" />
                  )}
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
                        {alerts.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">No active alerts.</div>
                        ) : (
                          alerts.map((alert, index) => (
                            <div key={`${alert.message}-${index}`} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                                  alert.type === 'danger' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-yellow-500' : 'bg-primary-500'
                                }`} />
                                <div>
                                  <p className="text-sm text-gray-300">{alert.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-300 hidden sm:inline">{user?.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

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

        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-400 mt-1">Here&apos;s your live fleet overview</p>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Vehicles', value: stats.totalVehicles, icon: Truck, color: 'primary', change: 'Synced from backend' },
              { label: 'Active Now', value: stats.activeVehicles, icon: Activity, color: 'accent', change: 'Tracking live' },
              { label: 'Idle', value: stats.idleVehicles, icon: Clock, color: 'yellow', change: 'Awaiting movement' },
              { label: 'Maintenance', value: stats.maintenanceVehicles, icon: AlertTriangle, color: 'red', change: 'Needs attention' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                <p className="text-2xl font-bold text-white">{isLoading ? '...' : stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 glass rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary-400" />
                  Live Vehicle Map
                </h3>
                <span className="text-xs text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full">
                  {stats.activeVehicles} vehicles active
                </span>
              </div>

              {highlightedVehicle ? (
                <div className="relative h-80">
                  <iframe
                    title={`${highlightedVehicle.name} map`}
                    src={buildEmbeddedMapUrl(highlightedVehicle.lat, highlightedVehicle.lng)}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute left-5 bottom-5 right-5 glass-strong rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{highlightedVehicle.name}</p>
                        <p className="text-xs text-gray-400">{highlightedVehicle.driver} • {highlightedVehicle.location}</p>
                      </div>
                      <Link
                        to="/dashboard/map"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs"
                      >
                        Open Live Map
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-sm text-gray-500">
                  No vehicles available.
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Fleet Snapshot</h3>
                <Link to="/dashboard/map" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View all</Link>
              </div>
              <div className="space-y-3">
                {filteredVehicles.slice(0, 5).map((vehicle) => (
                  <div key={vehicle.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{vehicle.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        vehicle.status === 'active'
                          ? 'bg-accent-500/10 text-accent-400'
                          : vehicle.status === 'idle'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{vehicle.driver}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>{vehicle.speed} mph</span>
                      <span>Fuel {vehicle.fuel}%</span>
                      <span>Battery {vehicle.battery}%</span>
                    </div>
                  </div>
                ))}
                {!isLoading && filteredVehicles.length === 0 && (
                  <div className="text-sm text-gray-500">No vehicles match your search.</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
