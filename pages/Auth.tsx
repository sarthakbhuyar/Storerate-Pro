
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../services/mockApi';
import { VALIDATION, ICONS } from '../constants';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!VALIDATION.EMAIL.PATTERN.test(formData.email)) return VALIDATION.EMAIL.MESSAGE;
    if (formData.password.length < 8 || formData.password.length > 16 || !VALIDATION.PASSWORD.PATTERN.test(formData.password)) {
      return VALIDATION.PASSWORD.MESSAGE;
    }
    if (!isLogin) {
      if (formData.name.length < VALIDATION.NAME.MIN || formData.name.length > VALIDATION.NAME.MAX) {
        return VALIDATION.NAME.MESSAGE;
      }
      if (formData.address.length > VALIDATION.ADDRESS.MAX) {
        return VALIDATION.ADDRESS.MESSAGE;
      }
    }
    return null;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      const user = await mockApi.login(formData.email, formData.password);
      onAuthSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await mockApi.signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        address: formData.address,
        role: UserRole.USER
      });
      setIsLogin(true);
      setError('Account created successfully! Please sign in with your credentials.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (email: string, pass: string) => {
    setFormData({ ...formData, email, password: pass });
    setIsLogin(true);
    setError('');
  };

  const quickLogins = [
    { label: 'Admin Access', email: 'admin@example.com', pass: 'AdminPassword1!', color: 'bg-amber-500' },
    { label: 'Standard User', email: 'user@example.com', pass: 'UserPassword1!', color: 'bg-green-600' },
    { label: 'Business Owner', email: 'owner@example.com', pass: 'OwnerPassword1!', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-gray-100 animate-in fade-in zoom-in duration-500">
        
        {/* Left Panel: Branding & Quick Actions */}
        <div className="md:w-80 bg-slate-900 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ICONS.Store className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black tracking-tight">StoreRate Pro</h1>
            </div>
            <h2 className="text-2xl font-bold mb-4">Quick Credentials</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Click any button below to auto-fill the form with test account credentials.
            </p>
            <div className="space-y-3">
              {quickLogins.map((ql, idx) => (
                <button
                  key={idx}
                  onClick={() => fillQuickLogin(ql.email, ql.pass)}
                  className={`w-full ${ql.color} text-white p-3 rounded-xl text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all flex justify-between items-center group`}
                >
                  <span>{ql.label}</span>
                  <ICONS.Plus className="w-4 h-4 transform group-hover:rotate-90 transition-transform" />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 text-[10px] text-slate-500 leading-tight">
            Built for the Intern Coding Challenge. Using React, Tailwind, and simulated MySQL logic.
          </div>
        </div>

        {/* Right Panel: Active Form */}
        <div className="flex-grow p-10 md:p-14 bg-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-slate-500 text-sm mb-10">
              {isLogin ? 'Please enter your account details to access the dashboard.' : 'Fill in the details below to join our rating community.'}
            </p>

            {error && (
              <div className={`p-4 rounded-xl mb-8 text-sm font-bold animate-in slide-in-from-top-2 ${error.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {error}
              </div>
            )}

            <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="At least 20 characters"
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Physical Address</label>
                    <textarea
                      required
                      placeholder="Max 400 characters"
                      className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium h-24 resize-none"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 bg-slate-900 text-white font-black rounded-xl shadow-2xl shadow-slate-200 transform active:scale-[0.98] transition-all hover:bg-black flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                   <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>{isLogin ? 'Sign In to Account' : 'Register Account'}</span>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <button
                onClick={() => { setError(''); setIsLogin(!isLogin); }}
                className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already a member? Sign In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
