
import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { User, Store, StoreWithRating, Rating } from '../types';
import { ICONS } from '../constants';

interface UserProps {
  user: User;
}

const UserDashboard: React.FC<UserProps> = ({ user }) => {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState<StoreWithRating | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    const allStores = await mockApi.getAllStores();
    const storesWithData = await Promise.all(allStores.map(async s => {
      const ratings = await mockApi.getRatingsForStore(s.id);
      const avg = ratings.length > 0 ? ratings.reduce((a, r) => a + r.score, 0) / ratings.length : 0;
      const userR = ratings.find(r => r.userId === user.id)?.score;
      return { ...s, averageRating: avg, totalRatings: ratings.length, userRating: userR };
    }));
    setStores(storesWithData);
    setLoading(false);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleRatingSubmit = async () => {
    if (!showRatingModal) return;
    await mockApi.submitRating(user.id, showRatingModal.id, ratingValue);
    setShowRatingModal(null);
    setRatingValue(0);
    fetchStores();
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newPass = fd.get('newPass') as string;
    try {
      await mockApi.updatePassword(user.id, newPass);
      alert('Password updated successfully!');
      setShowProfileModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-1">Discover and rate the best stores in your neighborhood.</p>
        </div>
        <button 
          onClick={() => setShowProfileModal(true)}
          className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl font-bold transition-all flex items-center justify-center"
        >
          Security Settings
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search stores by name or location..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm text-lg"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <svg className="w-7 h-7 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <div key={store.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors">
                    <ICONS.Store className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center space-x-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-sm font-bold">
                    <ICONS.Star className="w-4 h-4" />
                    <span>{store.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{store.address}</p>
                
                {store.userRating ? (
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium mb-4 flex justify-between items-center">
                    <span>Your Rating</span>
                    <span className="font-bold">{store.userRating} / 5</span>
                  </div>
                ) : (
                  <div className="bg-gray-50 text-gray-500 px-4 py-2 rounded-xl text-sm font-medium mb-4">
                    Not rated yet
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setRatingValue(store.userRating || 0);
                  setShowRatingModal(store);
                }}
                className="w-full py-3 rounded-2xl bg-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all text-gray-700 font-bold"
              >
                {store.userRating ? 'Modify Rating' : 'Submit Rating'}
              </button>
            </div>
          ))}
          {filteredStores.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              <p className="text-xl">No stores found matching "{search}"</p>
            </div>
          )}
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Rate this Store</h3>
            <p className="text-gray-500 text-center mb-8">{showRatingModal.name}</p>
            
            <div className="flex justify-center space-x-2 mb-8">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className={`p-2 transition-all transform active:scale-125 ${ratingValue >= star ? 'text-amber-400' : 'text-gray-200'}`}
                >
                  <ICONS.Star className="w-10 h-10" />
                </button>
              ))}
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRatingSubmit}
                disabled={ratingValue === 0}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                Submit Feedback
              </button>
              <button
                onClick={() => setShowRatingModal(null)}
                className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-gray-100"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile/Password Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Update Security</h3>
            <p className="text-gray-500 mb-6">Enter your new password below. Requirements: 8-16 chars, 1 uppercase, 1 special character.</p>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input 
                name="newPass" 
                type="password" 
                required 
                placeholder="New Password" 
                className="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100" 
              />
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
                >
                  Update Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
