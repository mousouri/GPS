import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminDevices, type AdminDevice, type PaginationInfo } from '../lib/api';
import BrandMark from '../components/BrandMark';
import {
  LogOut, Bell, Search, ShieldCheck,
  LayoutDashboard, Users, CreditCard, BarChart3, Settings, Globe, Server,
  ChevronLeft, ChevronRight, MapPin, Battery, Fuel, Gauge, Activity,
  Truck, CircleDot,
} from 'lucide-react';

export default function AdminDevicesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState<AdminDevice[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, idle: 0, maintenance: 0 });
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, perPage: 10, totalPages: 1, totalDevices: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    { icon: BarChart3, label: 'Audit Log', path: '/admin/audit-log' },
    { icon: Globe, label: 'Devices', active: true, path: '/admin/devices' },
    { icon: Server, label: 'System', path: '/admin/dashboard' },
    { icon: Settings, label: 'Settings', path: '/admin/dashboard' },
  ];

  const loadDevices = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAdminDevices({ page, perPage: 10, search, status: statusFilter });
      setDevices(data.devices);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadDevices(1);
  }, [loadDevices]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const statusColor = (s: string) =>
    s === 'active' ? 'text-green-400 bg-green-500/10' :
    s === 'idle' ? 'text-yellow-400 bg-yellow-500/10' :
    'text-red-400 bg-red-500/10';

  return (
    <div className="flex min-h-screen bg-dark-950">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-white/5 bg-dark-900/50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <BrandMark className="h-10 w-auto rounded-xl" />
          </Link>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                item.active ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-white">Device Management</h1>
          <div className="flex items-center gap-3">
            <button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={handleLogout} className="p-2 glass rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Devices', value: stats.total, icon: Truck, color: 'text-primary-400' },
              { label: 'Active', value: stats.active, icon: Activity, color: 'text-green-400' },
              { label: 'Idle', value: stats.idle, icon: CircleDot, color: 'text-yellow-400' },
              { label: 'Maintenance', value: stats.maintenance, icon: Settings, color: 'text-red-400' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search devices, drivers, or owners..."
                className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass rounded-xl px-3 py-2.5 text-sm text-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Device</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Driver</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Owner</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Location</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Speed</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Fuel</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Battery</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Last Ping</th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device) => (
                        <motion.tr
                          key={device.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-white">{device.name}</p>
                              <p className="text-xs text-gray-500">{device.id} · {device.type}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColor(device.status)}`}>
                              {device.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{device.driver || '—'}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm text-gray-300">{device.owner}</p>
                              <p className="text-xs text-gray-500">{device.ownerEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-500" />
                              <span className="text-xs text-gray-400 max-w-[150px] truncate">{device.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <Gauge className="w-3.5 h-3.5 text-gray-500" />
                              <span className="text-sm text-gray-300">{device.speed} mph</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${device.fuel > 50 ? 'bg-green-500' : device.fuel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${device.fuel}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{device.fuel}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Battery className={`w-4 h-4 ${device.battery > 50 ? 'text-green-400' : device.battery > 25 ? 'text-yellow-400' : 'text-red-400'}`} />
                              <span className="text-xs text-gray-400">{device.battery}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(device.lastPingAt).toLocaleString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {devices.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">No devices found.</div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalDevices} devices)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadDevices(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 glass rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => loadDevices(pageNum)}
                      className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${
                        pagination.page === pageNum ? 'bg-primary-500/20 text-primary-400' : 'glass text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => loadDevices(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 glass rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
