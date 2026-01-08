
import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { User, Store, Rating } from '../types';
import { ICONS, VALIDATION } from '../constants';
import DataTable from '../components/DataTable';

interface OwnerProps {
  user: User;
}

const StoreOwner: React.FC<OwnerProps> = ({ user }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<(Rating & { userName: string, userEmail: string })[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    const allStores = await mockApi.getAllStores();
    const myStore = allStores.find(s => s.ownerId === user.id);
    if (myStore) {
      setStore(myStore);
      const storeRatings = await mockApi.getRatingsForStore(myStore.id);
      const users = await mockApi.getAllUsers();
      
      const ratingsWithUsers = storeRatings.map(r => {
        const ratingUser = users.find(u => u.id === r.userId);
        return {
          ...r,
          userName: ratingUser?.name || 'Anonymous User',
          userEmail: ratingUser?.email || '-'
        };
      });
      
      setRatings(ratingsWithUsers);
      const avg = storeRatings.length > 0 ? storeRatings.reduce((a, r) => a + r.score, 0) / storeRatings.length : 0;
      setAvgRating(avg);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const newPass = fd.get('newPass') as string;

    if (newPass.length < VALIDATION.PASSWORD.MIN || newPass.length > VALIDATION.PASSWORD.MAX || !VALIDATION.PASSWORD.PATTERN.test(newPass)) {
      setError(VALIDATION.PASSWORD.MESSAGE); return;
    }

    try {
      await mockApi.updatePassword(user.id, newPass);
      alert('Password updated successfully!');
      setShowProfileModal(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!store) return (
    <div className="h-96 flex flex-col items-center justify-center text-gray-500 italic space-y-4">
      <ICONS.Store className="w-16 h-16 text-gray-300" />
      <p>No store profile is currently linked to your account.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
          <p className="text-gray-500">{store.address}</p>
        </div>
        <button 
          onClick={() => { setError(''); setShowProfileModal(true); }}
          className="bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-xl font-bold transition-all shadow-sm"
        >
          Update Security
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="p-5 bg-amber-50 rounded-2xl">
            <ICONS.Star className="w-12 h-12 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Store Performance</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-4xl font-black text-gray-900">{avgRating.toFixed(1)}</h3>
              <span className="text-gray-400 font-medium text-lg">/ 5.0 Rating</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6">
          <div className="p-5 bg-blue-50 rounded-2xl">
            <ICONS.Users className="w-12 h-12 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Customer Engagement</p>
            <h3 className="text-4xl font-black text-gray-900">{ratings.length} Total Ratings</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b">
          <h3 className="text-xl font-bold text-gray-900">Rated By Customers</h3>
          <p className="text-gray-500 text-sm">Review specific users who have submitted feedback for your business.</p>
        </div>
        <div className="p-8">
          <DataTable
            data={ratings}
            columns={[
              { header: 'Customer Name', accessor: 'userName', sortable: true },
              { header: 'Customer Email', accessor: 'userEmail', sortable: true },
              { 
                header: 'Rating Provided', 
                accessor: 'score',
                sortable: true,
                render: (r) => (
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map(star => (
                      <ICONS.Star key={star} className={`w-4 h-4 ${r.score >= star ? 'text-amber-400' : 'text-gray-200'}`} />
                    ))}
                    <span className="ml-2 font-bold text-gray-700">{r.score}</span>
                  </div>
                )
              },
              { 
                header: 'Submission Date', 
                accessor: 'createdAt',
                sortable: true,
                render: (r) => new Date(r.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric'
                })
              }
            ]}
          />
        </div>
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full animate-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Update Security</h3>
            <p className="text-sm text-gray-500 mb-6 text-center">Change your access credentials. Requirements: 8-16 chars, 1 uppercase, 1 special character.</p>
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">{error}</div>}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input name="newPass" type="password" required placeholder="Enter New Password" className="w-full px-5 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 transition-all" />
              <div className="flex space-x-4 pt-4">
                <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwner;
