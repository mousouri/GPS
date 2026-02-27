import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Building2, Calendar, CreditCard,
  Smartphone, MapPin, Shield, Clock, BarChart3, Ban,
  CheckCircle2, AlertTriangle, Edit3, Trash2, Send,
} from 'lucide-react';

const userData = {
  id: 'USR-2847',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@acmecorp.com',
  phone: '+1 (555) 234-5678',
  company: 'Acme Corporation',
  plan: 'Professional',
  role: 'Fleet Manager',
  status: 'active',
  joinDate: 'March 15, 2023',
  lastLogin: '2 hours ago',
  avatar: '/images/person-woman-4.jpg',
  devices: 24,
  monthlySpend: '$1,896',
  totalSpent: '$22,752',
};

const devices = [
  { id: 'DEV-001', name: 'GPS Tracker Pro', vehicle: 'Truck #101', status: 'online', lastPing: '30s ago', battery: 92 },
  { id: 'DEV-002', name: 'GPS Tracker Pro', vehicle: 'Van #205', status: 'online', lastPing: '45s ago', battery: 87 },
  { id: 'DEV-003', name: 'GPS Mini', vehicle: 'Sedan #312', status: 'offline', lastPing: '2h ago', battery: 15 },
  { id: 'DEV-004', name: 'GPS Tracker Pro', vehicle: 'Truck #108', status: 'online', lastPing: '15s ago', battery: 95 },
  { id: 'DEV-005', name: 'OBD Connector', vehicle: 'SUV #410', status: 'online', lastPing: '1m ago', battery: 78 },
];

const activity = [
  { action: 'Logged in', time: '2 hours ago', type: 'auth' },
  { action: 'Updated geofence "Warehouse Zone"', time: '3 hours ago', type: 'edit' },
  { action: 'Exported fleet report', time: '5 hours ago', type: 'export' },
  { action: 'Added device DEV-005', time: '1 day ago', type: 'create' },
  { action: 'Changed password', time: '3 days ago', type: 'security' },
  { action: 'Updated billing info', time: '1 week ago', type: 'billing' },
];

const invoices = [
  { id: 'INV-1247', date: 'Dec 1, 2024', amount: '$1,896.00', status: 'paid' },
  { id: 'INV-1198', date: 'Nov 1, 2024', amount: '$1,896.00', status: 'paid' },
  { id: 'INV-1152', date: 'Oct 1, 2024', amount: '$1,580.00', status: 'paid' },
];

export default function AdminUserDetailPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'billing' | 'activity'>('overview');

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <span className="font-semibold text-white">User Detail</span>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{userData.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2">
            <Send className="w-3.5 h-3.5" /> Email User
          </button>
          <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2">
            <Ban className="w-3.5 h-3.5" /> Suspend
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-white/5 p-6 mb-6"
        >
          <div className="flex items-start gap-6">
            <img src={userData.avatar} alt={userData.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-white">{userData.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400">
                  {userData.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{userData.role} at {userData.company}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{userData.email}</span>
                <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" />{userData.phone}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {userData.joinDate}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Last login {userData.lastLogin}</span>
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
              <Edit3 className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            {[
              { label: 'Plan', value: userData.plan, icon: CreditCard },
              { label: 'Devices', value: userData.devices, icon: MapPin },
              { label: 'Monthly', value: userData.monthlySpend, icon: BarChart3 },
              { label: 'Total Spent', value: userData.totalSpent, icon: Shield },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-white/5">
                <s.icon className="w-4 h-4 text-primary-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit mb-6">
          {(['overview', 'devices', 'billing', 'activity'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-primary-500 text-dark-950' : 'text-gray-400 hover:text-white'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: userData.name },
                  { label: 'Email', value: userData.email },
                  { label: 'Phone', value: userData.phone },
                  { label: 'Company', value: userData.company },
                  { label: 'Role', value: userData.role },
                  { label: 'Join Date', value: userData.joinDate },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{f.label}</span>
                    <span className="text-white">{f.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activity.slice(0, 5).map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{a.action}</p>
                      <p className="text-xs text-gray-500">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Tab: Devices */}
        {activeTab === 'devices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Registered Devices ({devices.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-white/5">
                    <th className="text-left py-3 px-3">Device ID</th>
                    <th className="text-left py-3 px-3">Type</th>
                    <th className="text-left py-3 px-3">Vehicle</th>
                    <th className="text-left py-3 px-3">Status</th>
                    <th className="text-left py-3 px-3">Last Ping</th>
                    <th className="text-left py-3 px-3">Battery</th>
                    <th className="text-left py-3 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-sm text-primary-400 font-mono">{d.id}</td>
                      <td className="py-3 px-3 text-sm text-white">{d.name}</td>
                      <td className="py-3 px-3 text-sm text-gray-300">{d.vehicle}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          d.status === 'online' ? 'bg-accent-500/10 text-accent-400' : 'bg-red-500/10 text-red-400'
                        }`}>{d.status}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-400">{d.lastPing}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${d.battery > 50 ? 'bg-accent-400' : d.battery > 20 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{ width: `${d.battery}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{d.battery}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded hover:bg-white/10"><Edit3 className="w-3 h-3 text-gray-400" /></button>
                          <button className="p-1.5 rounded hover:bg-white/10"><Trash2 className="w-3 h-3 text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tab: Billing */}
        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white mb-4">Billing History</h3>
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{inv.id}</p>
                      <p className="text-xs text-gray-500">{inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-white">{inv.amount}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab: Activity */}
        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white mb-4">Full Activity Log</h3>
            <div className="space-y-2">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    a.type === 'auth' ? 'bg-primary-500/10' : a.type === 'security' ? 'bg-red-500/10' : 'bg-primary-500/10'
                  }`}>
                    {a.type === 'auth' ? <User className="w-4 h-4 text-primary-400" /> :
                     a.type === 'security' ? <Shield className="w-4 h-4 text-red-400" /> :
                     a.type === 'edit' ? <Edit3 className="w-4 h-4 text-primary-400" /> :
                     <BarChart3 className="w-4 h-4 text-primary-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{a.action}</p>
                    <p className="text-xs text-gray-500">{a.time}</p>
                  </div>
                  <span className="text-xs text-gray-600 capitalize px-2 py-0.5 bg-white/5 rounded">{a.type}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
