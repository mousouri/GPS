import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, ArrowLeft, User, Mail, Building2, Camera,
  Bell, Shield, Key, Save, Check,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [timezone, setTimezone] = useState('America/New_York');

  // Notification preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [speedAlerts, setSpeedAlerts] = useState(true);
  const [geofenceAlerts, setGeofenceAlerts] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [fuelAlerts, setFuelAlerts] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Top Bar */}
      <header className="glass-strong border-b border-white/5 px-8 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-400" />
          <span className="font-semibold">Track<span className="gradient-text">Pro</span></span>
        </div>
        <span className="text-gray-500 mx-2">/</span>
        <span className="text-gray-300">Settings</span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-1">Account Settings</h1>
          <p className="text-gray-400 mb-8">Manage your profile, notifications, and security</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 glass rounded-xl p-1 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-primary-500/10 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'}
                    alt={user?.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
                  <p className="text-gray-400 text-sm">{user?.plan} Plan</p>
                  <p className="text-gray-500 text-xs mt-1">Member since {user?.joinDate}</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 glass rounded-xl text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="America/New_York" className="bg-dark-900">Eastern Time (ET)</option>
                    <option value="America/Chicago" className="bg-dark-900">Central Time (CT)</option>
                    <option value="America/Denver" className="bg-dark-900">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles" className="bg-dark-900">Pacific Time (PT)</option>
                    <option value="Europe/London" className="bg-dark-900">GMT (London)</option>
                    <option value="Asia/Dubai" className="bg-dark-900">GST (Dubai)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Receive alerts via email', value: emailAlerts, setter: setEmailAlerts },
                    { label: 'SMS Notifications', desc: 'Receive critical alerts via SMS', value: smsAlerts, setter: setSmsAlerts },
                    { label: 'Push Notifications', desc: 'Browser push notifications', value: pushAlerts, setter: setPushAlerts },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.setter(!item.value)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${item.value ? 'bg-primary-500' : 'bg-white/10'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${item.value ? 'translate-x-5.5 left-[1px]' : 'left-[2px]'}`}
                          style={{ transform: item.value ? 'translateX(21px)' : 'translateX(0)' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Alert Types</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Speed Alerts', desc: 'When vehicle exceeds speed limit', value: speedAlerts, setter: setSpeedAlerts },
                    { label: 'Geofence Alerts', desc: 'Enter/exit zone notifications', value: geofenceAlerts, setter: setGeofenceAlerts },
                    { label: 'Maintenance Alerts', desc: 'Scheduled service reminders', value: maintenanceAlerts, setter: setMaintenanceAlerts },
                    { label: 'Fuel Alerts', desc: 'Low fuel level warnings', value: fuelAlerts, setter: setFuelAlerts },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.setter(!item.value)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${item.value ? 'bg-accent-500' : 'bg-white/10'}`}
                      >
                        <div className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform"
                          style={{ transform: item.value ? 'translateX(21px)' : 'translateX(0)', left: item.value ? '1px' : '2px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="w-4 h-4 text-primary-400" />
                  Change Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input type="password" placeholder="Enter current password"
                      className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input type="password" placeholder="Enter new password"
                      className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password"
                      className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400 mb-4">Add an extra layer of security to your account</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-xl border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
                >
                  Enable 2FA
                </motion.button>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'New York, US', current: true },
                    { device: 'Safari on iPhone', location: 'New York, US', current: false },
                  ].map((session) => (
                    <div key={session.device} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5">
                      <div>
                        <p className="text-sm text-white">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location}</p>
                      </div>
                      {session.current ? (
                        <span className="text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-full">Current</span>
                      ) : (
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex items-center gap-4">
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all flex items-center gap-2"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </motion.button>
            <Link to="/dashboard" className="px-6 py-3 glass text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-all">
              Cancel
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
