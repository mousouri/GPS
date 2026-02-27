import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CreditCard, Download, DollarSign, TrendingUp,
  Users, CheckCircle2, Clock, AlertTriangle, ChevronDown,
  Filter, Search, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart,
} from 'lucide-react';
import { getAdminBillingData, type AdminTransaction } from '../lib/api';

export default function AdminBillingPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState({
    monthlyRevenue: '$0',
    activeSubscriptions: 0,
    avgRevenuePerUser: '$0',
    failedPayments: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ month: string; revenue: number }>>([]);
  const [planBreakdown, setPlanBreakdown] = useState<Array<{ plan: string; users: number; revenue: number; percent: number; color: string }>>([]);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadBilling() {
      try {
        const response = await getAdminBillingData();
        if (!isMounted) {
          return;
        }
        setSummary(response.summary);
        setMonthlyRevenue(response.monthlyRevenue);
        setPlanBreakdown(response.planBreakdown);
        setTransactions(response.transactions);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load billing data.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBilling();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxRevenue = Math.max(...monthlyRevenue.map((entry) => entry.revenue), 1);

  const filtered = useMemo(() => (
    transactions.filter((transaction) => {
      if (filterStatus !== 'all' && transaction.status !== filterStatus) {
        return false;
      }
      if (!searchQuery.trim()) {
        return true;
      }
      const query = searchQuery.toLowerCase();
      return transaction.customer.toLowerCase().includes(query) || transaction.id.toLowerCase().includes(query);
    })
  ), [filterStatus, searchQuery, transactions]);

  return (
    <div className="min-h-screen bg-dark-950">
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
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Monthly Revenue', value: summary.monthlyRevenue, change: '+12.4%', up: true, icon: DollarSign },
            { label: 'Active Subscriptions', value: summary.activeSubscriptions.toLocaleString(), change: '+5.2%', up: true, icon: Users },
            { label: 'Avg Revenue/User', value: summary.avgRevenuePerUser, change: '+3.8%', up: true, icon: TrendingUp },
            { label: 'Failed Payments', value: summary.failedPayments.toLocaleString(), change: '-18%', up: false, icon: AlertTriangle },
          ].map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/5 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  card.label === 'Failed Payments' ? 'text-accent-400' : card.up ? 'text-accent-400' : 'text-red-400'
                }`}>
                  {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{isLoading ? '...' : card.value}</h3>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
              {monthlyRevenue.map((entry, index) => (
                <div key={entry.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500">${entry.revenue.toLocaleString()}</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(entry.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px]"
                  />
                  <span className="text-xs text-gray-600">{entry.month}</span>
                </div>
              ))}
            </div>
          </motion.div>

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
              {planBreakdown.map((plan) => (
                <div key={plan.plan}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-white">{plan.plan}</span>
                    <span className="text-gray-400">${plan.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${plan.percent}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{plan.users} users • {plan.percent}%</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 w-48"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(event) => setFilterStatus(event.target.value)}
                  className="pl-8 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                >
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
                {filtered.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-sm text-primary-400 font-mono">{transaction.id}</td>
                    <td className="py-3 px-3 text-sm text-white">{transaction.customer}</td>
                    <td className="py-3 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        transaction.plan === 'Enterprise' ? 'bg-primary-500/10 text-primary-400' :
                        transaction.plan === 'Professional' ? 'bg-accent-500/10 text-accent-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>{transaction.plan}</span>
                    </td>
                    <td className="py-3 px-3 text-sm font-medium text-white">{transaction.amount}</td>
                    <td className="py-3 px-3 text-sm text-gray-400">{transaction.date}</td>
                    <td className="py-3 px-3 text-sm text-gray-400">{transaction.method}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        transaction.status === 'completed' ? 'bg-accent-500/10 text-accent-400' :
                        transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {transaction.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                         transaction.status === 'pending' ? <Clock className="w-3 h-3" /> :
                         <AlertTriangle className="w-3 h-3" />}
                        {transaction.status}
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
