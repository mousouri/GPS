import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, LogOut, Bell, Search, ChevronDown, ShieldCheck,
  LayoutDashboard, Users, CreditCard, BarChart3, Settings, Globe,
  TrendingUp, TrendingDown, DollarSign, UserPlus, Activity,
  Server, Database, Cpu, HardDrive, Eye, MoreHorizontal,
  CheckCircle, XCircle, Clock, ArrowUpRight,
} from 'lucide-react';

// Sample admin data
const platformStats = [
  { label: 'Total Users', value: '12,847', icon: Users, color: 'primary', change: '+12.5%', trend: 'up' },
  { label: 'Revenue (MTD)', value: '$284,930', icon: DollarSign, color: 'accent', change: '+8.3%', trend: 'up' },
  { label: 'Active Devices', value: '38,291', icon: Globe, color: 'blue', change: '+15.2%', trend: 'up' },
  { label: 'New Signups', value: '342', icon: UserPlus, color: 'purple', change: '-2.1%', trend: 'down' },
];

const recentUsers = [
  { id: 1, name: 'Anderson Logistics', email: 'contact@anderson.com', plan: 'Enterprise', devices: 156, status: 'active', revenue: '$4,200/mo', joinDate: 'Feb 15, 2026', avatar: '/images/person-businessman.jpg' },
  { id: 2, name: 'Swift Transport', email: 'info@swift.com', plan: 'Professional', devices: 48, status: 'active', revenue: '$1,800/mo', joinDate: 'Feb 12, 2026', avatar: '/images/person-man-1.jpg' },
  { id: 3, name: 'Metro Delivery Co.', email: 'ops@metro.com', plan: 'Starter', devices: 12, status: 'trial', revenue: '$0 (trial)', joinDate: 'Feb 20, 2026', avatar: '/images/person-businessman-2.jpg' },
  { id: 4, name: 'Pacific Fleet Inc.', email: 'fleet@pacific.com', plan: 'Enterprise', devices: 230, status: 'active', revenue: '$6,500/mo', joinDate: 'Jan 08, 2026', avatar: '/images/person-man-2.jpg' },
  { id: 5, name: 'City Cab Services', email: 'admin@citycab.com', plan: 'Professional', devices: 75, status: 'past_due', revenue: '$2,100/mo', joinDate: 'Dec 03, 2025', avatar: '/images/person-man-3.jpg' },
  { id: 6, name: 'Global Marine Ltd.', email: 'ops@globalmarine.com', plan: 'Enterprise', devices: 89, status: 'active', revenue: '$3,800/mo', joinDate: 'Feb 22, 2026', avatar: '/images/person-woman-6.jpg' },
];

const systemHealth = [
  { label: 'API Server', status: 'operational', uptime: '99.99%', icon: Server },
  { label: 'Database Cluster', status: 'operational', uptime: '99.97%', icon: Database },
  { label: 'GPS Processing', status: 'degraded', uptime: '98.50%', icon: Cpu },
  { label: 'Storage', status: 'operational', uptime: '99.99%', icon: HardDrive },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', active: true, path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users/USR-2847' },
  { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
  { icon: BarChart3, label: 'Audit Log', path: '/admin/audit-log' },
  { icon: Globe, label: 'Devices', path: '/admin/dashboard' },
  { icon: Server, label: 'System', path: '/admin/dashboard' },
  { icon: Settings, label: 'Settings', path: '/admin/dashboard' },
];

const revenueData = [
  { month: 'Sep', value: 220000 },
  { month: 'Oct', value: 235000 },
  { month: 'Nov', value: 248000 },
  { month: 'Dec', value: 261000 },
  { month: 'Jan', value: 272000 },
  { month: 'Feb', value: 284930 },
];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const maxRevenue = Math.max(...revenueData.map((d) => d.value));

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
          <div className="mt-3 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs text-red-400 font-medium uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        {/* Nav Items */}
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

        {/* Admin User */}
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
                  placeholder="Search users, companies, devices..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 border border-white/5 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                        <h3 className="font-semibold text-white">System Alerts</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/5">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500" />
                          <div>
                            <p className="text-sm text-gray-300">GPS Processing latency increased</p>
                            <p className="text-xs text-gray-500 mt-1">15 min ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500" />
                          <div>
                            <p className="text-sm text-gray-300">Payment failed: City Cab Services</p>
                            <p className="text-xs text-gray-500 mt-1">1 hr ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-primary-500/5">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-500" />
                          <div>
                            <p className="text-sm text-gray-300">New enterprise signup: Global Marine</p>
                            <p className="text-xs text-gray-500 mt-1">3 hr ago</p>
                          </div>
                        </div>
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

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Header */}
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
              <span className="text-xs text-gray-500">Last updated: Just now</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                Generate Report
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {platformStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === 'primary' ? 'bg-primary-500/10 text-primary-400' :
                    stat.color === 'accent' ? 'bg-accent-500/10 text-accent-400' :
                    stat.color === 'blue' ? 'bg-primary-500/10 text-primary-400' :
                    'bg-purple-500/10 text-purple-400'
                  }`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-accent-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue Chart + System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 glass rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-400" />
                  Revenue Trend
                </h3>
                <span className="text-xs text-gray-500">Last 6 months</span>
              </div>
              <div className="flex items-end gap-4 h-48">
                {revenueData.map((d, i) => (
                  <motion.div
                    key={d.month}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.value / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="flex-1 relative group cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-600 to-primary-400 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${(d.value / 1000).toFixed(0)}k
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                      {d.month}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-accent-400" />
                  <span className="text-gray-400">Monthly growth: <span className="text-accent-400 font-medium">+4.7%</span></span>
                </div>
                <span className="text-gray-500">Projected: $310k</span>
              </div>
            </motion.div>

            {/* System Health */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl"
            >
              <div className="p-5 border-b border-white/5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent-400" />
                  System Health
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {systemHealth.map((sys, i) => (
                  <motion.div
                    key={sys.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <sys.icon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-white">{sys.label}</p>
                        <p className="text-xs text-gray-500">Uptime: {sys.uptime}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      sys.status === 'operational'
                        ? 'bg-accent-500/10 text-accent-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {sys.status === 'operational' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {sys.status === 'operational' ? 'OK' : 'Degraded'}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Overall: 99.61% uptime</span>
                  <span className="text-accent-400">All systems nominal</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-400" />
                Recent Users & Companies
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                View All →
              </motion.button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devices</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-sm font-medium text-white">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-400' :
                          u.plan === 'Professional' ? 'bg-primary-500/10 text-primary-400' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{u.devices}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          u.status === 'active' ? 'bg-accent-500/10 text-accent-400' :
                          u.status === 'trial' ? 'bg-primary-500/10 text-primary-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {u.status === 'active' ? <CheckCircle className="w-3 h-3" /> :
                           u.status === 'trial' ? <Clock className="w-3 h-3" /> :
                           <XCircle className="w-3 h-3" />}
                          {u.status === 'active' ? 'Active' : u.status === 'trial' ? 'Trial' : 'Past Due'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{u.revenue}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{u.joinDate}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-500">Showing 6 of 12,847 users</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs text-gray-400 rounded-lg hover:bg-white/5 transition-colors">Previous</button>
                <button className="px-3 py-1.5 text-xs text-white bg-white/10 rounded-lg">1</button>
                <button className="px-3 py-1.5 text-xs text-gray-400 rounded-lg hover:bg-white/5 transition-colors">2</button>
                <button className="px-3 py-1.5 text-xs text-gray-400 rounded-lg hover:bg-white/5 transition-colors">3</button>
                <button className="px-3 py-1.5 text-xs text-gray-400 rounded-lg hover:bg-white/5 transition-colors">Next</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
