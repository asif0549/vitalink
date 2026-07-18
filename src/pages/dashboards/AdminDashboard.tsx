import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Heart, Droplets, MapPin, Users, Building2, TrendingUp, ShieldCheck, RefreshCw, BarChart2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'stats' | 'users' | 'map'>('stats');

  const loadData = async () => {
    try {
      setLoading(true);
      const s = await adminApi.getStats();
      setStats(s);

      const u = await adminApi.getUsers();
      setUsers(u);

      const d = await adminApi.getDonorLocations();
      setDonors(d);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load administration stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Summary */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">System Administration Console</span>
            <h1 className="text-2xl font-bold text-gray-900">VitaLink Admin Panel</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor GPS donor coordinate maps, revenue, hospital memberships, and security policies.</p>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm max-w-md">
          <button
            onClick={() => setTab('stats')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tab === 'stats' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-primary hover:bg-gray-50'}`}
          >
            Statistics & Revenue
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tab === 'users' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-primary hover:bg-gray-50'}`}
          >
            User Directory
          </button>
          <button
            onClick={() => setTab('map')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tab === 'map' ? 'bg-primary text-white shadow' : 'text-gray-500 hover:text-primary hover:bg-gray-50'}`}
          >
            Live GPS Map
          </button>
        </div>

        {/* Tab 1: Stats Dashboard */}
        {tab === 'stats' && stats && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-50 shadow-lg flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">Total Accounts</span>
                  <span className="text-2xl font-black text-gray-900">{stats.totalUsers}</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-50 shadow-lg flex items-center space-x-4">
                <div className="p-3 bg-life-green/10 rounded-xl text-life-green">
                  <Droplets className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">Registered Donors</span>
                  <span className="text-2xl font-black text-gray-900">{stats.totalDonors}</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-50 shadow-lg flex items-center space-x-4">
                <div className="p-3 bg-medical-blue/10 rounded-xl text-medical-blue">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">Partner Hospitals</span>
                  <span className="text-2xl font-black text-gray-900">{stats.totalHospitals}</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-50 shadow-lg flex items-center space-x-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-600">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">Arranged Donations</span>
                  <span className="text-2xl font-black text-gray-900">{stats.completedRequests} / {stats.totalRequests}</span>
                </div>
              </div>

            </div>

            {/* Financial Revenue Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/85 backdrop-blur-md p-8 rounded-2xl border border-red-100 shadow-xl">
              
              <div className="text-center p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="p-2.5 bg-life-green/10 rounded-full inline-block text-life-green mb-3">
                  <DollarSign className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Monthly Subscription Revenue</h3>
                <span className="text-3xl font-black text-life-green block mt-2">Rs. {stats.subscriptionRevenue?.toFixed(2)}</span>
                <p className="text-xxs text-gray-400 mt-2">Aggregated BASIC, PREMIUM, and ENTERPRISE plan recharges.</p>
              </div>

              <div className="text-center p-6 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="p-2.5 bg-medical-blue/10 rounded-full inline-block text-medical-blue mb-3">
                  <TrendingUp className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Maintenance Deductions</h3>
                <span className="text-3xl font-black text-medical-blue block mt-2">Rs. {stats.maintenanceRevenue?.toFixed(2)}</span>
                <p className="text-xxs text-gray-400 mt-2">Fees charged from hospital wallets on successful arrangement completions.</p>
              </div>

              <div className="text-center p-6">
                <div className="p-2.5 bg-primary/10 rounded-full inline-block text-primary mb-3">
                  <BarChart2 className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Total Platform Revenues</h3>
                <span className="text-3xl font-black text-primary block mt-2">Rs. {stats.totalRevenue?.toFixed(2)}</span>
                <p className="text-xxs text-gray-400 mt-2">Net financial intake generated across India operations.</p>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: User Registry */}
        {tab === 'users' && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" /> Active Platform Users Registry
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                    <th className="py-2.5 px-2">User ID</th>
                    <th className="py-2.5 px-2">Name</th>
                    <th className="py-2.5 px-2">Email</th>
                    <th className="py-2.5 px-2">Role</th>
                    <th className="py-2.5 px-2">Contact Number</th>
                    <th className="py-2.5 px-2">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-gray-400">{u.id.substring(0, 8)}...</td>
                      <td className="py-3 px-2 font-bold text-gray-800">{u.name}</td>
                      <td className="py-3 px-2 text-gray-600">{u.email}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'ADMIN' ? 'bg-red-100 text-red-600' : u.role === 'DONOR' ? 'bg-life-green/10 text-life-green' : u.role === 'HOSPITAL' ? 'bg-medical-blue/10 text-medical-blue' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500">{u.contactNumber}</td>
                      <td className="py-3 px-2 text-gray-500">{u.city}, {u.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Active Map View */}
        {tab === 'map' && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-xl space-y-4 animate-in fade-in duration-300">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary heartbeat" /> Active GPS Donor Monitoring Map
              </h2>
              <p className="text-xs text-gray-500 mt-1">Real-time coordinates plotting of active online blood donors across Guntur, Vijayawada, and other cities.</p>
            </div>

            <div className="h-96 bg-slate-950 border border-gray-800 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-10 bg-radial-grid"></div>
              
              {/* Radar Sweeper simulation effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full border border-primary/20 animate-ping"></div>

              {/* Plotted pins */}
              <div className="absolute inset-0 p-8 flex flex-wrap gap-8 justify-around items-center">
                {donors.map((d) => {
                  if (!d.location) return null;
                  const lng = d.location.coordinates[0];
                  const lat = d.location.coordinates[1];
                  return (
                    <div key={d.id} className="bg-slate-900/90 border border-gray-800 p-2.5 rounded-lg text-center space-y-1 text-[10px] w-28 shadow-xl">
                      <div className="flex justify-center">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-life-green opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-life-green"></span>
                        </span>
                      </div>
                      <span className="font-bold text-white block truncate">{d.name.split(' ')[0]} ({d.bloodGroup})</span>
                      <span className="text-gray-400 block">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase inline-block ${d.available ? 'bg-life-green/20 text-life-green' : 'bg-red-950/20 text-red-500'}`}>
                        {d.available ? 'Available' : 'Offline'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {donors.length === 0 && (
                <p className="text-xs text-gray-500 italic relative z-10">No donors active on the map.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
