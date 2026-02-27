import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Shield } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('trackpro_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    setPrefs({ necessary: true, analytics: true, marketing: true, functional: true });
    localStorage.setItem('trackpro_cookie_consent', JSON.stringify({
      necessary: true, analytics: true, marketing: true, functional: true, timestamp: Date.now(),
    }));
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem('trackpro_cookie_consent', JSON.stringify({
      necessary: true, analytics: false, marketing: false, functional: false, timestamp: Date.now(),
    }));
    setVisible(false);
  };

  const savePrefs = () => {
    localStorage.setItem('trackpro_cookie_consent', JSON.stringify({
      ...prefs, timestamp: Date.now(),
    }));
    setVisible(false);
    setShowPrefs(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {!showPrefs ? (
              /* Main banner */
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Cookie className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">We value your privacy</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                      By clicking "Accept All", you consent to our use of cookies.{' '}
                      <a href="#" className="text-primary-400 hover:text-primary-300 underline">Privacy Policy</a>
                    </p>
                  </div>
                  <button onClick={() => setVisible(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4 ml-14">
                  <button onClick={acceptAll}
                    className="px-5 py-2.5 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">
                    Accept All
                  </button>
                  <button onClick={rejectAll}
                    className="px-5 py-2.5 bg-white/5 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors border border-white/10">
                    Reject All
                  </button>
                  <button onClick={() => setShowPrefs(true)}
                    className="px-5 py-2.5 text-gray-400 text-sm font-medium hover:text-white transition-colors flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" /> Manage Preferences
                  </button>
                </div>
              </div>
            ) : (
              /* Preferences Panel */
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-400" />
                    <h3 className="font-semibold text-white">Cookie Preferences</h3>
                  </div>
                  <button onClick={() => setShowPrefs(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    { key: 'necessary' as const, label: 'Strictly Necessary', desc: 'Required for the website to function. Cannot be disabled.', locked: true },
                    { key: 'functional' as const, label: 'Functional', desc: 'Enable enhanced functionality and personalization.', locked: false },
                    { key: 'analytics' as const, label: 'Analytics', desc: 'Help us understand how visitors interact with our website.', locked: false },
                    { key: 'marketing' as const, label: 'Marketing', desc: 'Used to deliver relevant ads and track campaign performance.', locked: false },
                  ].map((c) => (
                    <div key={c.key} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div>
                        <p className="text-sm font-medium text-white">{c.label}</p>
                        <p className="text-xs text-gray-500">{c.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={prefs[c.key]}
                          onChange={() => !c.locked && setPrefs({ ...prefs, [c.key]: !prefs[c.key] })}
                          disabled={c.locked}
                          className="sr-only peer"
                        />
                        <div className={`w-9 h-5 rounded-full transition-colors ${
                          prefs[c.key] ? 'bg-primary-500' : 'bg-gray-600'
                        } ${c.locked ? 'opacity-60' : ''}`}>
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform mt-0.5 ${
                            prefs[c.key] ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'
                          }`} />
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={savePrefs}
                    className="flex-1 px-5 py-2.5 bg-primary-500 text-dark-950 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">
                    Save Preferences
                  </button>
                  <button onClick={acceptAll}
                    className="flex-1 px-5 py-2.5 bg-white/5 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors border border-white/10">
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
