import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';

const Stat = ({ label, value, accent='[#d3756b]' }) => (
  <div className="bg-white border border-[#e7dcca] rounded-2xl p-5 shadow-sm">
    <div className="text-xs text-gray-500">{label}</div>
    <div className={`text-2xl font-extrabold text-[#5e3023] mt-1`}>{value}</div>
  </div>
);

const AdminDashboard = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState(null);
  const [topStores, setTopStores] = useState([]);
  const [sales7d, setSales7d] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/admin/overview');
        if (res.data.success) {
          setTotals(res.data.totals);
          setTopStores(res.data.top_stores || []);
          setSales7d(res.data.sales_7d || []);
        }
      } catch (e) {
        console.error('Admin overview failed', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!isAuthenticated || currentUser?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#fff9f5] pt-20">
      <div className="bg-gradient-to-r from-[#064232] via-[#8c7c68] to-[#d3756b] text-white">
        <div className="container mx-auto max-w-7xl px-4 py-10 mt-16">
          <h1 className="text-3xl md:text-4xl font-extrabold">Admin Dashboard</h1>
          <p className="opacity-90 mt-2 text-sm md:text-base">Global overview across all stores</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 -mt-10 relative z-10">
        {loading ? (
          <div className="bg-white border border-[#e7dcca] rounded-2xl p-8 shadow-sm">Loading…</div>
        ) : (
          <>
            {/* Totals */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Stat label="Revenue" value={formatMoney(totals?.revenue)} />
              <Stat label="Orders" value={totals?.orders ?? 0} />
              <Stat label="Stores" value={totals?.stores ?? 0} />
              <Stat label="Products" value={totals?.products ?? 0} />
              <Stat label="Users" value={totals?.users ?? 0} />
            </div>

            {/* Sales 7 days */}
            <div className="mt-6 bg-white border border-[#e7dcca] rounded-2xl p-5 shadow-sm">
              <div className="text-[#5e3023] font-semibold mb-3">Sales (Last 7 Days)</div>
              <div className="grid grid-cols-7 gap-3">
                {sales7d.map(d => (
                  <div key={d.day} className="text-xs">
                    <div className="text-gray-500">{d.day.slice(5)}</div>
                    <div className="font-semibold text-[#5e3023]">{formatMoney(d.revenue)}</div>
                    <div className="text-[10px] text-gray-500">{d.orders} orders</div>
                  </div>
                ))}
                {sales7d.length === 0 && <div className="text-gray-500 text-sm">No sales yet.</div>}
              </div>
            </div>

            {/* Top Stores */}
            <div className="mt-6 bg-white border border-[#e7dcca] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-[#5e3023] font-semibold">Top Stores by Revenue</div>
                <Link to="/admin/products" className="text-sm text-[#d3756b] hover:text-[#c25d52]">View all products →</Link>
              </div>
              <div className="mt-3 divide-y">
                {topStores.map(s => (
                  <div key={s.store_id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#fff3ee] flex items-center justify-center text-[#d3756b] text-sm font-bold">
                        {(s.store_name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-[#5e3023] font-medium">{s.store_name}</div>
                        <div className="text-xs text-gray-500">{s.city || '—'} • {s.orders_count} orders</div>
                      </div>
                    </div>
                    <div className="text-[#5e3023] font-semibold">{formatMoney(s.revenue)}</div>
                  </div>
                ))}
                {topStores.length === 0 && <div className="py-6 text-gray-500 text-sm">No data.</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const formatMoney = (v) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 })
    .format(Number(v || 0)).replace('PKR', 'Rs.');
};

export default AdminDashboard;
