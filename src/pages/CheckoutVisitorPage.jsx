import React, { useState } from 'react';
import { CreditCard, Building2, User, Phone, ClipboardList, Clock4, LogOut } from 'lucide-react';

// Helper to calculate duration between two ISO strings
function calculateDuration(inTime, outTime) {
  if (!inTime || !outTime) return '';
  const start = new Date(inTime);
  const end = new Date(outTime);
  const ms = end - start;
  if (isNaN(ms) || ms < 0) return '';
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

const CheckoutVisitorPage = () => {
  const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
  const checkoutVisitors = visitors.filter(v => v.outTime);

  const [search, setSearch] = useState('');
  const [_, setForceUpdate] = useState(0);

  // Filter by name, company, cardNo, toMeet, phone
  const filtered = checkoutVisitors.filter(v =>
    (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.cardNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.toMeet || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  // Delete all checked out visitors
  function handleDeleteAll() {
    if (window.confirm("Are you sure you want to delete all checked out visitors? This cannot be undone.")) {
      const remaining = visitors.filter(v => !v.outTime);
      localStorage.setItem('visitors', JSON.stringify(remaining));
      setForceUpdate(x => x + 1); // force re-render
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-6 min-h-[300px] mt-8 mx-0">
      <h2 className="text-2xl font-bold mb-6 text-pink-400">Checked Out Visitors</h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, company, card no, to meet, phone"
          className="w-full sm:w-80 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-slate-400">No checked out visitors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-slate-900 rounded-xl shadow border border-pink-700 p-5 flex flex-col gap-2 hover:shadow-pink-700/30 transition relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 bg-slate-800 flex-shrink-0">
                  {/* Ensure the visitor object has a valid photoUrl property */}
                  {v.photoUrl && typeof v.photoUrl === 'string' && v.photoUrl.trim() !== '' ? (
                    <img src={v.photoUrl} alt={v.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400 text-2xl bg-slate-700">
                      <span>{v.name ? v.name[0] : '?'}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <User size={18} className="text-pink-300" />
                    <span className="text-lg font-bold text-pink-400">{v.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <CreditCard size={16} className="text-pink-300" />
                    <span className="text-xs bg-pink-700/30 text-pink-300 px-2 py-1 rounded inline-block">
                      Card No: {v.cardNo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Building2 size={16} className="text-pink-300" />
                <span className="font-semibold">Company:</span> {v.companyName}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <User size={16} className="text-pink-300" />
                <span className="font-semibold">To Meet:</span> {v.toMeet}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Phone size={16} className="text-pink-300" />
                <span className="font-semibold">Phone:</span> {v.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <ClipboardList size={16} className="text-pink-300" />
                <span className="font-semibold">Purpose:</span> {v.purpose}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                <Clock4 size={14} className="text-pink-300" />
                <span className="font-semibold">In Time:</span> {v.inTime}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <LogOut size={14} className="text-pink-300" />
                <span className="font-semibold">Out Time:</span> {v.outTime}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Clock4 size={14} className="text-pink-300" />
                <span className="font-semibold">Duration:</span> {calculateDuration(v.inTime, v.outTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckoutVisitorPage;
