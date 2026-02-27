import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Shield, Search, Filter, ChevronDown, Clock,
  User, Settings, Trash2, Edit3, LogIn, LogOut, AlertTriangle,
  Key, Database, Download, Eye,
} from 'lucide-react';

const auditEntries = [
  { id: 1, admin: 'John Admin', action: 'User Suspended', target: 'user@example.com', category: 'user', severity: 'high', timestamp: '2024-12-21 14:32:05', ip: '192.168.1.45', details: 'Suspended user account for policy violation' },
  { id: 2, admin: 'System', action: 'Auto-Backup Completed', target: 'Database', category: 'system', severity: 'info', timestamp: '2024-12-21 14:00:00', ip: 'Internal', details: 'Scheduled daily backup completed successfully' },
  { id: 3, admin: 'Jane Admin', action: 'Plan Changed', target: 'acme@corp.com', category: 'billing', severity: 'medium', timestamp: '2024-12-21 13:15:22', ip: '10.0.0.12', details: 'Changed plan from Professional to Enterprise' },
  { id: 4, admin: 'John Admin', action: 'Admin Login', target: 'admin@trackpro.com', category: 'auth', severity: 'info', timestamp: '2024-12-21 12:45:00', ip: '192.168.1.45', details: 'Successful admin login' },
  { id: 5, admin: 'Jane Admin', action: 'API Key Generated', target: 'GlobalShip LLC', category: 'security', severity: 'high', timestamp: '2024-12-21 11:30:44', ip: '10.0.0.12', details: 'New API key generated for client integration' },
  { id: 6, admin: 'System', action: 'Failed Login Attempt', target: 'unknown@test.com', category: 'auth', severity: 'critical', timestamp: '2024-12-21 10:22:18', ip: '203.0.113.42', details: '5 consecutive failed login attempts detected' },
  { id: 7, admin: 'John Admin', action: 'Device Deleted', target: 'DEV-892', category: 'device', severity: 'medium', timestamp: '2024-12-21 09:55:10', ip: '192.168.1.45', details: 'Removed device from fleet management' },
  { id: 8, admin: 'System', action: 'SSL Certificate Renewed', target: 'trackpro.com', category: 'system', severity: 'info', timestamp: '2024-12-21 08:00:00', ip: 'Internal', details: 'Auto-renewal of SSL certificate completed' },
  { id: 9, admin: 'Jane Admin', action: 'User Created', target: 'newuser@fleet.com', category: 'user', severity: 'low', timestamp: '2024-12-20 17:40:33', ip: '10.0.0.12', details: 'Created new user account with Starter plan' },
  { id: 10, admin: 'John Admin', action: 'Geofence Modified', target: 'Zone GF-003', category: 'config', severity: 'medium', timestamp: '2024-12-20 16:15:09', ip: '192.168.1.45', details: 'Updated geofence radius from 300m to 500m' },
  { id: 11, admin: 'System', action: 'High CPU Alert', target: 'Server Node 2', category: 'system', severity: 'critical', timestamp: '2024-12-20 14:30:00', ip: 'Internal', details: 'CPU utilization exceeded 95% threshold' },
  { id: 12, admin: 'Jane Admin', action: 'Admin Logout', target: 'jane@trackpro.com', category: 'auth', severity: 'info', timestamp: '2024-12-20 13:00:00', ip: '10.0.0.12', details: 'Admin session ended' },
];

const categoryIcons: Record<string, typeof User> = {
  user: User,
  system: Database,
  billing: Settings,
  auth: LogIn,
  security: Key,
  device: Settings,
  config: Edit3,
};

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  info: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AdminAuditLogPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filtered = auditEntries.filter((e) => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && e.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return e.admin.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.target.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Audit Log</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Events', value: '2,847', period: 'Last 30 days', icon: Clock },
            { label: 'Critical Events', value: '12', period: 'Needs attention', icon: AlertTriangle },
            { label: 'Admin Actions', value: '156', period: 'This week', icon: User },
            { label: 'System Events', value: '1,423', period: 'Automated', icon: Database },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/5 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/5 p-6"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search events..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
            </div>
            <div className="relative">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                <option value="all">All Categories</option>
                <option value="user">User</option>
                <option value="auth">Auth</option>
                <option value="billing">Billing</option>
                <option value="security">Security</option>
                <option value="system">System</option>
                <option value="device">Device</option>
                <option value="config">Config</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
                className="pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="info">Info</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Log Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-white/5">
                  <th className="text-left py-3 px-3">Timestamp</th>
                  <th className="text-left py-3 px-3">Severity</th>
                  <th className="text-left py-3 px-3">Actor</th>
                  <th className="text-left py-3 px-3">Action</th>
                  <th className="text-left py-3 px-3">Target</th>
                  <th className="text-left py-3 px-3">Category</th>
                  <th className="text-left py-3 px-3">IP</th>
                  <th className="text-left py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const Icon = categoryIcons[e.category] || Settings;
                  return (
                    <>
                      <tr key={e.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                          expandedRow === e.id ? 'bg-white/5' : ''
                        }`}
                        onClick={() => setExpandedRow(expandedRow === e.id ? null : e.id)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-400 font-mono">{e.timestamp}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${severityColors[e.severity]}`}>
                            {e.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-white">{e.admin}</td>
                        <td className="py-3 px-3 text-sm text-gray-300">{e.action}</td>
                        <td className="py-3 px-3 text-sm text-primary-400 font-mono">{e.target}</td>
                        <td className="py-3 px-3">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
                            <Icon className="w-3 h-3" /> {e.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-600 font-mono">{e.ip}</td>
                        <td className="py-3 px-3">
                          <Eye className="w-3 h-3 text-gray-600" />
                        </td>
                      </tr>
                      {expandedRow === e.id && (
                        <tr key={`${e.id}-detail`}>
                          <td colSpan={8} className="px-6 py-3 bg-white/[0.02] border-b border-white/5">
                            <p className="text-sm text-gray-400">{e.details}</p>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-gray-500">{filtered.length} events shown</span>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:bg-white/10 transition-colors">Previous</button>
              <button className="px-3 py-1.5 bg-primary-500/10 text-primary-400 rounded-lg text-xs font-medium">1</button>
              <button className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:bg-white/10 transition-colors">2</button>
              <button className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-gray-400 hover:bg-white/10 transition-colors">Next</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
