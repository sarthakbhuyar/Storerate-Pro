
import React, { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { User, Store, UserRole, DashboardStats } from '../types';
import DataTable from '../components/DataTable';
import { ICONS, VALIDATION } from '../constants';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<(User & { averageRating?: string })[]>([]);
  const [stores, setStores] = useState<(Store & { rating: string })[]>([]);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');
  const [showModal, setShowModal] = useState<null | 'user' | 'store'>(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    const [s, u, st] = await Promise.all([
      mockApi.getDashboardStats(),
      mockApi.getAllUsers(),
      mockApi.getAllStores()
    ]);

    const usersWithRatings = await Promise.all(u.map(async user => {
      if (user.role === UserRole.OWNER) {
        const myStore = st.find(s => s.ownerId === user.id);
        if (myStore) {
          const avg = await mockApi.getAverageRating(myStore.id);
          return { ...user, averageRating: avg.toFixed(1) };
        }
      }
      return user;
    }));

    const storesWithRatings = await Promise.all(st.map(async store => {
      const avg = await mockApi.getAverageRating(store.id);
      return { ...store, rating: avg.toFixed(1) };
    }));

    setStats(s);
    setUsers(usersWithRatings);
    setStores(storesWithRatings);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const password = fd.get('password') as string;
    const address = fd.get('address') as string;

    if (name.length < VALIDATION.NAME.MIN || name.length > VALIDATION.NAME.MAX) {
      setError(VALIDATION.NAME.MESSAGE); return;
    }
    if (!VALIDATION.EMAIL.PATTERN.test(email)) {
      setError(VALIDATION.EMAIL.MESSAGE); return;
    }
    if (password.length < VALIDATION.PASSWORD.MIN || password.length > VALIDATION.PASSWORD.MAX || !VALIDATION.PASSWORD.PATTERN.test(password)) {
      setError(VALIDATION.PASSWORD.MESSAGE); return;
    }
    if (address.length > VALIDATION.ADDRESS.MAX) {
      setError(VALIDATION.ADDRESS.MESSAGE); return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name, email, password, address,
      role: fd.get('role') as UserRole
    };
    await mockApi.addUser(newUser);
    setShowModal(null);
    fetchData();
  };

  const handleAddStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newStore: Store = {
      id: 's' + Math.random().toString(36).substr(2, 9),
      ownerId: fd.get('ownerId') as string,
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      address: fd.get('address') as string,
      description: fd.get('description') as string,
    };
    await mockApi.addStore(newStore);
    setShowModal(null);
    fetchData();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-500">Manage users, stores, and monitor system performance.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => { setError(''); setShowModal('user'); }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow transition-all font-medium"
          >
            <ICONS.Plus className="w-5 h-5 mr-2" /> Add User
          </button>
          <button 
            onClick={() => { setError(''); setShowModal('store'); }}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow transition-all font-medium"
          >
            <ICONS.Plus className="w-5 h-5 mr-2" /> Add Store
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: ICONS.Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Registered Stores', value: stats?.totalStores || 0, icon: ICONS.Store, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Submitted Ratings', value: stats?.totalRatings || 0, icon: ICONS.Star, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-4 rounded-xl ${s.bg}`}>
              <s.icon className={`w-8 h-8 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-4 text-sm font-semibold transition-all ${activeTab === 'users' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Users Directory
          </button>
          <button 
            onClick={() => setActiveTab('stores')}
            className={`px-8 py-4 text-sm font-semibold transition-all ${activeTab === 'stores' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Stores Directory
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={`Filter ${activeTab} by name, email, address...`}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {activeTab === 'stores' && (
              <button 
                onClick={() => { setError(''); setShowModal('store'); }}
                className="flex items-center justify-center bg-indigo-50 text-indigo-700 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-all font-bold border border-indigo-100"
              >
                <ICONS.Plus className="w-5 h-5 mr-2" /> New Store
              </button>
            )}
          </div>

          {activeTab === 'users' ? (
            <DataTable
              data={users}
              filterText={filter}
              filterFields={['name', 'email', 'address', 'role']}
              columns={[
                { header: 'Full Name', accessor: 'name', sortable: true },
                { header: 'Email Address', accessor: 'email', sortable: true },
                { header: 'Address', accessor: 'address', sortable: true },
                { 
                  header: 'Role', 
                  accessor: 'role',
                  sortable: true,
                  render: (u: User & { averageRating?: string }) => (
                    <div className="flex flex-col">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase w-fit ${
                        u.role === UserRole.ADMIN ? 'bg-amber-50 text-amber-600' : 
                        u.role === UserRole.OWNER ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {u.role}
                      </span>
                      {u.role === UserRole.OWNER && u.averageRating && (
                        <span className="text-[10px] mt-1 text-gray-400">Store Rating: {u.averageRating}/5</span>
                      )}
                    </div>
                  )
                }
              ]}
            />
          ) : (
            <DataTable
              data={stores}
              filterText={filter}
              filterFields={['name', 'email', 'address']}
              columns={[
                { header: 'Store Name', accessor: 'name', sortable: true },
                { header: 'Business Email', accessor: 'email', sortable: true },
                { header: 'Location', accessor: 'address', sortable: true },
                { 
                  header: 'Overall Rating', 
                  accessor: 'rating',
                  sortable: true,
                  render: (s) => (
                    <div className="flex items-center space-x-1 font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full w-fit">
                      <ICONS.Star className="w-4 h-4" />
                      <span>{s.rating}</span>
                    </div>
                  )
                }
              ]}
            />
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {showModal === 'user' ? 'Register New System User' : 'Register New Business Store'}
              </h3>
              <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium">
                {error}
              </div>
            )}
            <form onSubmit={showModal === 'user' ? handleAddUser : handleAddStore} className="p-6 space-y-4">
              {showModal === 'user' ? (
                <>
                  <input name="name" required placeholder="Full Name (20-60 characters)" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all" />
                  <input name="email" type="email" required placeholder="Email Address" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all" />
                  <input name="password" type="password" required placeholder="Password (8-16, 1 Upper, 1 Special)" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all" />
                  <textarea name="address" required placeholder="Full Residential Address" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all h-20" />
                  <select name="role" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all">
                    <option value={UserRole.USER}>Normal User</option>
                    <option value={UserRole.OWNER}>Store Owner</option>
                    <option value={UserRole.ADMIN}>System Administrator</option>
                  </select>
                </>
              ) : (
                <>
                  <input name="name" required placeholder="Store Name" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all" />
                  <input name="email" type="email" required placeholder="Business Email" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all" />
                  <textarea name="description" placeholder="Store Description" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all h-20" />
                  <textarea name="address" required placeholder="Store Location Address" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all h-20" />
                  <select name="ownerId" required className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 ring-blue-500 transition-all">
                    <option value="">Assign Store Owner</option>
                    {users.filter(u => u.role === UserRole.OWNER).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </>
              )}
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setShowModal(null)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50 font-semibold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-all shadow-md">Confirm Action</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
