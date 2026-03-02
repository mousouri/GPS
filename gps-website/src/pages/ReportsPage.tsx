import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, BarChart3, Download, Calendar, ChevronDown,
  TrendingUp, TrendingDown, Fuel, Gauge, MapPin, Clock,
  FileText, Filter,
} from 'lucide-react';
import { getReportsData, getExportReportUrl, type ReportItem } from '../lib/api';

type TripPoint = {
  date: string;
  trips: number;
  distance: number;
  fuel: number;
  avgSpeed: number;
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'fuel' | 'downloads'>('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [tripData, setTripData] = useState<TripPoint[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [summary, setSummary] = useState({
    totalDistance: 0,
    fuelUsed: 0,
    avgSpeed: 0,
    activeHours: 0,
    totalTrips: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await getReportsData();
        if (!isMounted) return;
        setTripData(response.tripData);
        setReports(response.reports);
        setSummary(response.summary);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : 'Unable to load reports.');
      } finally { if (isMounted) setIsLoading(false); }
    })();
    return () => { isMounted = false; };
  }, []);

  /* ---- date-range filtered trip data ---- */
  const filteredTripData = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return tripData.slice(-days);
  }, [tripData, dateRange]);

  const maxTrips = useMemo(() => Math.max(...filteredTripData.map((p) => p.trips), 1), [filteredTripData]);
  const maxDistance = useMemo(() => Math.max(...filteredTripData.map((p) => p.distance), 1), [filteredTripData]);

  const statCards = [
    { label: 'Total Distance', value: summary.totalDistance.toLocaleString(), unit: 'miles', change: '+12%', up: true, icon: MapPin },
    { label: 'Fuel Used', value: summary.fuelUsed.toLocaleString(), unit: 'gallons', change: '-5%', up: false, icon: Fuel },
    { label: 'Avg Speed', value: summary.avgSpeed.toLocaleString(), unit: 'mph', change: '+3%', up: true, icon: Gauge },
    { label: 'Active Hours', value: summary.activeHours.toLocaleString(), unit: 'hrs', change: '+8%', up: true, icon: Clock },
  ];

  /* ---- export helpers ---- */
  const handleExportAll = () => {
    const url = getExportReportUrl('all', dateRange);
    window.open(url, '_blank');
  };

  const handleExportReport = (report: ReportItem) => {
    const url = getExportReportUrl(report.type, dateRange);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <header className="glass-strong border-b border-white/5 px-6 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            <span className="font-semibold text-white">Reports & Analytics</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
          </div>
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit mb-6">
          {(['overview', 'trips', 'fuel', 'downloads'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab ? 'bg-primary-500 text-dark-950 shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">{error}</div>
        )}

        {/* ============ OVERVIEW TAB ============ */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, index) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-accent-400' : 'text-red-400'}`}>
                      {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{isLoading ? '...' : stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.label} • {stat.unit}</p>
                </motion.div>
              ))}
            </div>

            {/* Fleet Activity Bar Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass rounded-2xl border border-white/5 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Fleet Activity</h3>
                  <p className="text-sm text-gray-500">Trips over {dateRange === '7d' ? '7 days' : dateRange === '30d' ? '30 days' : '90 days'}</p>
                </div>
                <button className="p-2 rounded-xl hover:bg-white/5 transition-colors"><Filter className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="flex items-end gap-3 h-48 mb-4">
                {filteredTripData.map((point, index) => (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500">{point.trips}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(point.trips / maxTrips) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.08, duration: 0.5 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-600 to-primary-400 min-h-[4px] relative group cursor-pointer hover:from-primary-500 hover:to-primary-300"
                    >
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-dark-900/95 backdrop-blur px-3 py-2 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 z-10">
                        <p className="text-white font-medium">{point.trips} trips</p>
                        <p className="text-gray-400">{point.distance} mi • {point.fuel} gal</p>
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-600">{point.date.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ============ TRIPS TAB ============ */}
        {activeTab === 'trips' && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-white/5 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Trip Summary</h3>
              <p className="text-sm text-gray-500 mb-4">Total trips in this period: <span className="text-white font-semibold">{summary.totalTrips}</span></p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{summary.totalTrips}</p>
                  <p className="text-xs text-gray-500">Total Trips</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{summary.totalDistance.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Miles</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{summary.avgSpeed}</p>
                  <p className="text-xs text-gray-500">Avg Speed (mph)</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{summary.activeHours}</p>
                  <p className="text-xs text-gray-500">Active Hours</p>
                </div>
              </div>
            </motion.div>

            {/* Distance by Day */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Distance by Day</h3>
              <div className="space-y-3">
                {filteredTripData.map((point) => (
                  <div key={point.date} className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-16">{point.date}</span>
                    <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(point.distance / maxDistance) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400" />
                    </div>
                    <span className="text-sm text-white font-medium w-20 text-right">{point.distance} mi</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ============ FUEL TAB ============ */}
        {activeTab === 'fuel' && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-white/5 p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">Fuel Consumption</h3>
              <p className="text-sm text-gray-500 mb-4">Total fuel used: <span className="text-white font-semibold">{summary.fuelUsed} gallons</span></p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">{summary.fuelUsed}</p>
                  <p className="text-xs text-gray-500">Total Gallons</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-2xl font-bold text-white">
                    {summary.totalDistance > 0 ? (summary.totalDistance / summary.fuelUsed).toFixed(1) : '0'}
                  </p>
                  <p className="text-xs text-gray-500">MPG Avg</p>
                </div>
              </div>
            </motion.div>

            {/* Fuel by Day */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Daily Fuel Usage</h3>
              <div className="space-y-3">
                {filteredTripData.map((point) => {
                  const maxFuel = Math.max(...filteredTripData.map((p) => p.fuel), 1);
                  return (
                    <div key={point.date} className="flex items-center gap-4">
                      <span className="text-sm text-gray-400 w-16">{point.date}</span>
                      <div className="flex-1 h-6 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(point.fuel / maxFuel) * 100}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400" />
                      </div>
                      <span className="text-sm text-white font-medium w-20 text-right">{point.fuel} gal</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}

        {/* ============ DOWNLOADS TAB ============ */}
        {activeTab === 'downloads' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Available Reports</h3>
              <button onClick={handleExportAll} className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download All
              </button>
            </div>
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.08] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{report.name}</p>
                      <p className="text-xs text-gray-500">{report.type} • {report.date} • {report.size}</p>
                    </div>
                  </div>
                  {report.status === 'ready' ? (
                    <button onClick={() => handleExportReport(report)} className="p-2 rounded-xl hover:bg-white/10 transition-colors group">
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-primary-400" />
                    </button>
                  ) : (
                    <span className="text-xs text-yellow-400 animate-pulse">Generating...</span>
                  )}
                </div>
              ))}
              {!isLoading && reports.length === 0 && (
                <div className="text-sm text-gray-500">No reports available.</div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
