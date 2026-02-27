import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboardData, type AdminRecentUser } from '../lib/api';
import {
  MapPin, LogOut, Bell, Search, ChevronDown, ShieldCheck,
  LayoutDashboard, Users, CreditCard, BarChart3, Settings, Globe,
  DollarSign, UserPlus, Server, Database, Cpu, HardDrive,
  ArrowUpRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    revenueMTD: '$0',
    activeDevices: 0,
    newSignups: 0,
  });
  const [recentUsers, setRecentUsers] = useState<AdminRecentUser[]>([]);
  const [systemHealth, setSystemHealth] = useState<Array<{ label: string; status: string; uptime: string }>>([]);
  const [revenueData, setRevenueData] = useState<Array<{ month: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true, path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: recentUsers[0] ? `/admin/users/${recentUsers[0].id}` : '/admin/dashboard' },
    { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    { icon: BarChart3, label: 'Audit Log', path: '/admin/audit-log' },
    { icon: Globe, label: 'Devices', path: '/admin/dashboard' },
    { icon: Server, label: 'System', path: '/admin/dashboard' },
    { icon: Settings, label: 'Settings', path: '/admin/dashboard' },
  ];

  useEffect(() => {
    let isMounted = true;

    async function loadAdminDashboard() {
      try {
        const response = await getAdminDashboardData();
        if (!isMounted) {
          return;
        }
        setStats(response.stats);
        setRecentUsers(response.recentUsers);
        setSystemHealth(response.systemHealth);
        setRevenueData(response.revenueData);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load admin dashboard.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const maxRevenue = Math.max(...revenueData.map((point) => point.value), 1);

  const notifications = [
    'System metrics are synced from the backend API.',
    'Billing and audit pages now run on live data.',
    'User detail pages can suspend and reactivate accounts.',
  ];

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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              Track<span className="gradient-text">Pro</span>
            </span>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400 font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link key={item.label} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  item.active
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
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
              src={user?.avatar || '/images/person-woman-4.jpg'}
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-red-400 truncate">Administrator</p>
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
                  placeholder="Search users, companies, devices..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 border border-white/5 transition-all"
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
                        <h3 className="font-semibold text-white">System Alerts</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {notifications.map((notification) => (
                          <div key={notification} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500" />
                            <p className="text-sm text-gray-300">{notification}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-red-500/30"
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
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray-400 mt-1">Platform overview & management</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Live data feed enabled</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                Generate Report
              </motion.button>
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users },
              { label: 'Revenue (MTD)', value: stats.revenueMTD, icon: DollarSign },
              { label: 'Active Devices', value: stats.activeDevices.toLocaleString(), icon: Globe },
              { label: 'New Signups', value: stats.newSignups.toLocaleString(), icon: UserPlus },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-400">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-accent-400">
                    <ArrowUpRight className="w-3 h-3" />
                    live
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white">{isLoading ? '...' : stat.value}</h3>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2 glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Revenue Trend</h3>
                <span className="text-xs text-gray-500">Last 6 billing periods</span>
              </div>
              <div className="flex items-end gap-4 h-40">
                {revenueData.map((point, index) => (
                  <div key={point.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500">${point.value.toLocaleString()}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(point.value / maxRevenue) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-red-600 to-red-400 min-h-[6px]"
                    />
                    <span className="text-xs text-gray-600">{point.month}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="font-semibold text-white mb-4">System Health</h3>
              <div className="space-y-3">
                {systemHealth.map((entry) => {
                  const Icon = entry.label.includes('API')
                    ? Server
                    : entry.label.includes('Database')
                      ? Database
                      : entry.label.includes('GPS')
                        ? Cpu
                        : HardDrive;
                  return (
                    <div key={entry.label} className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white">{entry.label}</p>
                            <p className="text-xs text-gray-500">{entry.uptime} uptime</p>
                          </div>
                        </div>
                        <span className="text-xs text-accent-400">{entry.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Recent Customers</h3>
              <Link
                to={recentUsers[0] ? `/admin/users/${recentUsers[0].id}` : '/admin/dashboard'}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                View user detail
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map((entry) => (
                <Link key={entry.id} to={`/admin/users/${entry.id}`} className="block">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                    <div className="flex items-center gap-4">
                      <img src={entry.avatar} alt={entry.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-medium text-white">{entry.name}</p>
                        <p className="text-xs text-gray-500">{entry.email}</p>
                      </div>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-sm text-white">{entry.devices} devices</p>
                      <p className="text-xs text-gray-500">{entry.joinDate}</p>
                    </div>
                    <div className="hidden md:block">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-red-500/10 text-red-300">{entry.plan}</span>
                    </div>
                    <p className="text-sm text-accent-400">{entry.revenue}</p>
                  </div>
                </Link>
              ))}
              {!isLoading && recentUsers.length === 0 && (
                <div className="text-sm text-gray-500">No customer records available.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
