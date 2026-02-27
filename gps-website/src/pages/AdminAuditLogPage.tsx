import { Fragment, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Shield, Search, ChevronDown, Clock,
  User, Settings, Edit3, LogIn, AlertTriangle,
  Key, Database, Download, Eye,
} from 'lucide-react';
import { getAdminAuditLogData, type AdminAuditEntry } from '../lib/api';

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
  low: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  info: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

export default function AdminAuditLogPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [summary, setSummary] = useState({
    totalEvents: 0,
    criticalEvents: 0,
    adminActions: 0,
    systemEvents: 0,
  });
  const [entries, setEntries] = useState<AdminAuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAuditLog() {
      try {
        const response = await getAdminAuditLogData();
        if (!isMounted) {
          return;
        }
        setSummary(response.summary);
        setEntries(response.entries);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load audit log.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAuditLog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => (
    entries.filter((entry) => {
      if (filterCategory !== 'all' && entry.category !== filterCategory) {
        return false;
      }
      if (filterSeverity !== 'all' && entry.severity !== filterSeverity) {
        return false;
      }
      if (!searchQuery.trim()) {
        return true;
      }
      const query = searchQuery.toLowerCase();
      return (
        entry.admin.toLowerCase().includes(query) ||
        entry.action.toLowerCase().includes(query) ||
        entry.target.toLowerCase().includes(query)
      );
    })
  ), [entries, filterCategory, filterSeverity, searchQuery]);

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
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Events', value: summary.totalEvents, period: 'Live dataset', icon: Clock },
            { label: 'Critical Events', value: summary.criticalEvents, period: 'Needs attention', icon: AlertTriangle },
            { label: 'Admin Actions', value: summary.adminActions, period: 'Operator initiated', icon: User },
            { label: 'System Events', value: summary.systemEvents, period: 'Automated', icon: Database },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/5 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{isLoading ? '...' : card.value}</p>
                  <p className="text-xs text-gray-500">{card.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/5 p-6"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                className="pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
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
              <select
                value={filterSeverity}
                onChange={(event) => setFilterSeverity(event.target.value)}
                className="pl-4 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              >
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
                {filtered.map((entry) => {
                  const Icon = categoryIcons[entry.category] || Settings;
                  return (
                    <Fragment key={entry.id}>
                      <tr
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                          expandedRow === entry.id ? 'bg-white/5' : ''
                        }`}
                        onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-400 font-mono">{entry.timestamp}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${severityColors[entry.severity]}`}>
                            {entry.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-white">{entry.admin}</td>
                        <td className="py-3 px-3 text-sm text-gray-300">{entry.action}</td>
                        <td className="py-3 px-3 text-sm text-primary-400 font-mono">{entry.target}</td>
                        <td className="py-3 px-3">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
                            <Icon className="w-3 h-3" /> {entry.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-600 font-mono">{entry.ip}</td>
                        <td className="py-3 px-3">
                          <Eye className="w-3 h-3 text-gray-600" />
                        </td>
                      </tr>
                      {expandedRow === entry.id && (
                        <tr>
                          <td colSpan={8} className="px-6 py-3 bg-white/[0.02] border-b border-white/5">
                            <p className="text-sm text-gray-400">{entry.details}</p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
