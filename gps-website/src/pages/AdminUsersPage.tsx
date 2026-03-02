import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAdminUsers, type AdminUserListItem, type PaginationInfo } from '../lib/api';
import BrandMark from '../components/BrandMark';
import {
  LogOut, Bell, Search, ShieldCheck,
  LayoutDashboard, Users, CreditCard, BarChart3, Settings, Globe, Server,
  ChevronLeft, ChevronRight, UserPlus, Filter, Eye,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, perPage: 10, totalPages: 1, totalUsers: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', active: true, path: '/admin/users' },
    { icon: CreditCard, label: 'Billing', path: '/admin/billing' },
    { icon: BarChart3, label: 'Audit Log', path: '/admin/audit-log' },
    { icon: Globe, label: 'Devices', path: '/admin/devices' },
    { icon: Server, label: 'System', path: '/admin/dashboard' },
    { icon: Settings, label: 'Settings', path: '/admin/dashboard' },
  ];

  const loadUsers = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAdminUsers({ page, perPage: 10, search, status: statusFilter, plan: planFilter });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, planFilter]);

  useEffect(() => {
    loadUsers(1);
  }, [loadUsers]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">User Management</h1>
            <span className="text-xs text-gray-500 bg-dark-800 px-2.5 py-1 rounded-lg">
              {pagination.totalUsers} total users
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={handleLogout} className="p-2 glass rounded-xl hover:bg-white/10 transition-colors text-gray-400 hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or company..."
                className="w-full pl-10 pr-4 py-2.5 glass rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass rounded-xl px-3 py-2.5 text-sm text-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="glass rounded-xl px-3 py-2.5 text-sm text-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              >
                <option value="">All Plans</option>
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
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
              {/* Table */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">User</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Plan</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Status</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Devices</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Revenue</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Joined</th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-4">Last Login</th>
                        <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover" />
                              <div>
                                <p className="text-sm font-medium text-white">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                              u.plan === 'Enterprise' ? 'bg-amber-500/10 text-amber-400' :
                              u.plan === 'Professional' ? 'bg-cyan-500/10 text-cyan-400' :
                              'bg-green-500/10 text-green-400'
                            }`}>
                              {u.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                              u.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">{u.devices}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{u.revenue}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{u.joinDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{u.lastLogin}</td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/admin/users/${u.id}`}
                              className="inline-flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Link>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">No users found matching your filters.</div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalUsers} users)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadUsers(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 glass rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => loadUsers(pageNum)}
                        className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${
                          pagination.page === pageNum ? 'bg-primary-500/20 text-primary-400' : 'glass text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => loadUsers(pagination.page + 1)}
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
