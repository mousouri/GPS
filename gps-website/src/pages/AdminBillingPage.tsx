import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Download, DollarSign, TrendingUp,
  Users, CheckCircle2, Clock, AlertTriangle, ChevronDown,
  Filter, Search, Receipt, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart,
} from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jul', revenue: 218000 },
  { month: 'Aug', revenue: 232000 },
  { month: 'Sep', revenue: 248000 },
  { month: 'Oct', revenue: 256000 },
  { month: 'Nov', revenue: 271000 },
  { month: 'Dec', revenue: 284930 },
];

const planBreakdown = [
  { plan: 'Enterprise', users: 142, revenue: 170580, percent: 60, color: '#eab308' },
  { plan: 'Professional', users: 489, revenue: 85410, percent: 30, color: '#f59e0b' },
  { plan: 'Starter', users: 1247, revenue: 28940, percent: 10, color: '#f59e0b' },
];

const transactions = [
  { id: 'TXN-8847', customer: 'Acme Corp', plan: 'Enterprise', amount: '$1,199.00', date: 'Dec 21, 2024', status: 'completed', method: 'Visa •••• 4242' },
  { id: 'TXN-8846', customer: 'TechFlow Inc', plan: 'Professional', amount: '$79.00', date: 'Dec 21, 2024', status: 'completed', method: 'Mastercard •••• 8888' },
  { id: 'TXN-8845', customer: 'GlobalShip LLC', plan: 'Enterprise', amount: '$1,199.00', date: 'Dec 20, 2024', status: 'completed', method: 'ACH Transfer' },
  { id: 'TXN-8844', customer: 'Metro Delivery', plan: 'Professional', amount: '$79.00', date: 'Dec 20, 2024', status: 'pending', method: 'Visa •••• 1234' },
  { id: 'TXN-8843', customer: 'FastTrack Co', plan: 'Starter', amount: '$29.00', date: 'Dec 20, 2024', status: 'completed', method: 'PayPal' },
  { id: 'TXN-8842', customer: 'Blue Ocean Ltd', plan: 'Enterprise', amount: '$1,199.00', date: 'Dec 19, 2024', status: 'failed', method: 'Visa •••• 9999' },
  { id: 'TXN-8841', customer: 'RedLogistics', plan: 'Professional', amount: '$79.00', date: 'Dec 19, 2024', status: 'completed', method: 'Stripe' },
];

export default function AdminBillingPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  const filtered = transactions.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery && !t.customer.toLowerCase().includes(searchQuery.toLowerCase()) && !t.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Billing & Revenue</span>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Monthly Revenue', value: '$284,930', change: '+12.4%', up: true, icon: DollarSign, color: 'primary' },
            { label: 'Active Subscriptions', value: '1,878', change: '+5.2%', up: true, icon: Users, color: 'accent' },
            { label: 'Avg Revenue/User', value: '$151.72', change: '+3.8%', up: true, icon: TrendingUp, color: 'blue' },
            { label: 'Failed Payments', value: '23', change: '-18%', up: false, icon: AlertTriangle, color: 'yellow' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/5 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  s.label === 'Failed Payments' ? 'text-accent-400' : s.up ? 'text-accent-400' : 'text-red-400'
                }`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{s.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-400" />
                <h3 className="font-semibold text-white">Revenue Trend</h3>
              </div>
              <span className="text-xs text-gray-500">Last 6 months</span>
            </div>
            <div className="flex items-end gap-4 h-40">
              {monthlyRevenue.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500">${(m.revenue / 1000).toFixed(0)}k</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px]"
                  />
                  <span className="text-xs text-gray-600">{m.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Plan Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl border border-white/5 p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-4 h-4 text-primary-400" />
              <h3 className="font-semibold text-white">Plan Split</h3>
            </div>
            <div className="space-y-4">
              {planBreakdown.map((p) => (
                <div key={p.plan}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-white">{p.plan}</span>
                    <span className="text-gray-400">${(p.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.percent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{p.users} users • {p.percent}%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-white">Recent Transactions</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input type="text" placeholder="Search..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 w-48" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-8 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-white/5">
                  <th className="text-left py-3 px-3">Transaction</th>
                  <th className="text-left py-3 px-3">Customer</th>
                  <th className="text-left py-3 px-3">Plan</th>
                  <th className="text-left py-3 px-3">Amount</th>
                  <th className="text-left py-3 px-3">Date</th>
                  <th className="text-left py-3 px-3">Payment</th>
                  <th className="text-left py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-sm text-primary-400 font-mono">{t.id}</td>
                    <td className="py-3 px-3 text-sm text-white">{t.customer}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        t.plan === 'Enterprise' ? 'bg-primary-500/10 text-primary-400' :
                        t.plan === 'Professional' ? 'bg-accent-500/10 text-accent-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>{t.plan}</span>
                    </td>
                    <td className="py-3 px-3 text-sm font-medium text-white">{t.amount}</td>
                    <td className="py-3 px-3 text-sm text-gray-400">{t.date}</td>
                    <td className="py-3 px-3 text-sm text-gray-400">{t.method}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        t.status === 'completed' ? 'bg-accent-500/10 text-accent-400' :
                        t.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {t.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                         t.status === 'pending' ? <Clock className="w-3 h-3" /> :
                         <AlertTriangle className="w-3 h-3" />}
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
