import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePasswordRequest, getProfileData, updateProfileRequest } from '../lib/api';
import {
  MapPin, ArrowLeft, User, Mail, Building2, Camera,
  Bell, Shield, Key, Save, Check,
} from 'lucide-react';

type PreferenceState = {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushAlerts: boolean;
  speedAlerts: boolean;
  geofenceAlerts: boolean;
  maintenanceAlerts: boolean;
  fuelAlerts: boolean;
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'America/New_York');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferences, setPreferences] = useState<PreferenceState>({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    speedAlerts: true,
    geofenceAlerts: true,
    maintenanceAlerts: true,
    fuelAlerts: false,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await getProfileData();
        if (!isMounted) {
          return;
        }
        setName(response.user.name);
        setEmail(response.user.email);
        setCompany(response.user.company);
        setPhone(response.user.phone);
        setTimezone(response.user.timezone);
        setPreferences(response.preferences);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Unable to load profile.');
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveProfile = async () => {
    setError('');
    try {
      const updatedUser = await updateProfileRequest({ name, email, company, phone, timezone });
      updateUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save profile.');
    }
  };

  const handlePasswordSave = async () => {
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      await changePasswordRequest(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update password.');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const channelOptions: Array<{ key: keyof PreferenceState; label: string; desc: string }> = [
    { key: 'emailAlerts', label: 'Email Notifications', desc: 'Receive alerts via email' },
    { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Receive critical alerts via SMS' },
    { key: 'pushAlerts', label: 'Push Notifications', desc: 'Browser push notifications' },
  ];

  const alertOptions: Array<{ key: keyof PreferenceState; label: string; desc: string }> = [
    { key: 'speedAlerts', label: 'Speed Alerts', desc: 'When vehicle exceeds speed limit' },
    { key: 'geofenceAlerts', label: 'Geofence Alerts', desc: 'Enter/exit zone notifications' },
    { key: 'maintenanceAlerts', label: 'Maintenance Alerts', desc: 'Scheduled service reminders' },
    { key: 'fuelAlerts', label: 'Fuel Alerts', desc: 'Low fuel level warnings' },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Account Settings</h1>
              <p className="text-gray-400">Manage your profile, notifications, and security</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={activeTab === 'security' ? handlePasswordSave : handleSaveProfile}
              className="px-5 py-2.5 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-xl border border-primary-500/20 hover:bg-primary-500/20 transition-colors inline-flex items-center gap-2"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved' : 'Save Changes'}
            </motion.button>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

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

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={user?.avatar || '/images/person-man-2.jpg'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full pl-11 pr-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full pl-11 pr-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      className="w-full pl-11 pr-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    className="w-full px-4 py-3 glass rounded-xl text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  >
                    <option value="America/New_York" className="bg-dark-900">New York</option>
                    <option value="America/Chicago" className="bg-dark-900">Chicago</option>
                    <option value="America/Denver" className="bg-dark-900">Denver</option>
                    <option value="America/Los_Angeles" className="bg-dark-900">Los Angeles</option>
                    <option value="Europe/London" className="bg-dark-900">London</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  {channelOptions.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setPreferences((current) => ({ ...current, [item.key]: !current[item.key] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative ${preferences[item.key] ? 'bg-primary-500' : 'bg-white/10'}`}
                      >
                        <div
                          className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform"
                          style={{
                            transform: preferences[item.key] ? 'translateX(21px)' : 'translateX(0)',
                            left: preferences[item.key] ? '1px' : '2px',
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Alert Types</h3>
                <div className="space-y-4">
                  {alertOptions.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setPreferences((current) => ({ ...current, [item.key]: !current[item.key] }))}
                        className={`w-11 h-6 rounded-full transition-colors relative ${preferences[item.key] ? 'bg-accent-500' : 'bg-white/10'}`}
                      >
                        <div
                          className="w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform"
                          style={{
                            transform: preferences[item.key] ? 'translateX(21px)' : 'translateX(0)',
                            left: preferences[item.key] ? '1px' : '2px',
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

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
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400 mb-4">This project now stores authenticated sessions server-side. 2FA can be layered on top of the same token flow next.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-primary-500/10 text-primary-400 text-sm font-medium rounded-xl border border-primary-500/20 hover:bg-primary-500/20 transition-colors"
                >
                  Enable 2FA
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
