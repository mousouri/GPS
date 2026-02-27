import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Mail, Calendar, CreditCard,
  Smartphone, MapPin, Shield, Clock, BarChart3, Ban,
  CheckCircle2, Edit3, Send,
} from 'lucide-react';
import { getAdminUserData, updateAdminUserStatus, type AdminUserDetail } from '../lib/api';

const emptyState: AdminUserDetail = {
  user: {
    id: 'USR-0',
    name: '',
    email: '',
    phone: '',
    company: '',
    plan: '',
    role: '',
    status: '',
    joinDate: '',
    lastLogin: '',
    avatar: '/images/person-woman-4.jpg',
    devices: 0,
    monthlySpend: '$0',
    totalSpent: '$0',
  },
  devices: [],
  activity: [],
  invoices: [],
};

export default function AdminUserDetailPage() {
  const { id = '' } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'billing' | 'activity'>('overview');
  const [data, setData] = useState<AdminUserDetail>(emptyState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const response = await getAdminUserData(id);
        if (!isMounted) {
          return;
        }
        setData(response);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load user.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleStatus = async () => {
    setIsMutating(true);
    setError('');

    try {
      const action = data.user.status === 'suspended' ? 'reactivate' : 'suspend';
      const response = await updateAdminUserStatus(id, action);
      setData(response);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update user status.');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <span className="font-semibold text-white">User Detail</span>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">{data.user.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2">
            <Send className="w-3.5 h-3.5" /> Email User
          </button>
          <button
            onClick={toggleStatus}
            disabled={isMutating}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            <Ban className="w-3.5 h-3.5" /> {data.user.status === 'suspended' ? 'Reactivate' : 'Suspend'}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl border border-white/5 p-6 mb-6"
        >
          <div className="flex items-start gap-6">
            <img src={data.user.avatar} alt={data.user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-white">{isLoading ? 'Loading...' : data.user.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.user.status === 'active'
                    ? 'bg-accent-500/10 text-accent-400'
                    : data.user.status === 'suspended'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {data.user.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{data.user.role} at {data.user.company}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{data.user.email}</span>
                <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" />{data.user.phone}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Joined {data.user.joinDate}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Last login {data.user.lastLogin}</span>
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/10 transition-colors">
              <Edit3 className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
            {[
              { label: 'Plan', value: data.user.plan, icon: CreditCard },
              { label: 'Devices', value: data.user.devices, icon: MapPin },
              { label: 'Monthly', value: data.user.monthlySpend, icon: BarChart3 },
              { label: 'Total Spent', value: data.user.totalSpent, icon: Shield },
            ].map((entry) => (
              <div key={entry.label} className="text-center p-3 rounded-xl bg-white/5">
                <entry.icon className="w-4 h-4 text-primary-400 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{entry.value}</p>
                <p className="text-xs text-gray-500">{entry.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit mb-6">
          {(['overview', 'devices', 'billing', 'activity'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-primary-500 text-dark-950' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: data.user.name },
                  { label: 'Email', value: data.user.email },
                  { label: 'Phone', value: data.user.phone },
                  { label: 'Company', value: data.user.company },
                  { label: 'Role', value: data.user.role },
                  { label: 'Join Date', value: data.user.joinDate },
                ].map((field) => (
                  <div key={field.label} className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500">{field.label}</span>
                    <span className="text-white text-right">{field.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {data.activity.slice(0, 5).map((entry, index) => (
                  <div key={`${entry.action}-${index}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{entry.action}</p>
                      <p className="text-xs text-gray-500">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'devices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Registered Devices ({data.devices.length})</h3>
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
                  </tr>
                </thead>
                <tbody>
                  {data.devices.map((device) => (
                    <tr key={device.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-sm text-primary-400 font-mono">{device.id}</td>
                      <td className="py-3 px-3 text-sm text-white">{device.name}</td>
                      <td className="py-3 px-3 text-sm text-gray-300">{device.vehicle}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          device.status === 'online' ? 'bg-accent-500/10 text-accent-400' : 'bg-red-500/10 text-red-400'
                        }`}>{device.status}</span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-400">{device.lastPing}</td>
                      <td className="py-3 px-3 text-sm text-gray-400">{device.battery}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white mb-4">Billing History</h3>
            <div className="space-y-3">
              {data.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{invoice.id}</p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-white">{invoice.amount}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <h3 className="font-semibold text-white mb-4">Full Activity Log</h3>
            <div className="space-y-2">
              {data.activity.map((entry, index) => (
                <div key={`${entry.action}-${index}`} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">{entry.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{entry.details}</p>
                    </div>
                    <span className="text-xs text-gray-500">{entry.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
