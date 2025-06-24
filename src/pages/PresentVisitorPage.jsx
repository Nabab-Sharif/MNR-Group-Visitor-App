import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Building2, User, Phone, ClipboardList, Clock4 } from 'lucide-react';

const PresentVisitorPage = () => {
  const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
  const presentVisitors = visitors.filter(v => !v.outTime);

  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Filter by name, company, cardNo, toMeet, phone
  const filtered = presentVisitors.filter(v =>
    (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.companyName || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.cardNo || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.toMeet || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  // Checkout handler: set outTime for this visitor and update localStorage, then go to checkout page
  function handleCheckout(visitorId) {
    const now = new Date().toISOString();
    const updatedVisitors = visitors.map(v =>
      v.id === visitorId && !v.outTime ? { ...v, outTime: now } : v
    );
    localStorage.setItem('visitors', JSON.stringify(updatedVisitors));
    navigate('/checkout-visitors');
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-6 min-h-[300px] mt-8 mx-0">
      <h2 className="text-2xl font-bold mb-6 text-green-400">Current Present Visitors</h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, company, card no, to meet, phone"
          className="w-full sm:w-80 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-slate-400">No present visitors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div key={v.id} className="bg-slate-900 rounded-xl shadow border border-green-700 p-5 flex flex-col gap-2 hover:shadow-green-700/30 transition relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 bg-slate-800 flex-shrink-0 flex items-center justify-center">
                  {v.photoUrl && typeof v.photoUrl === 'string' && v.photoUrl.trim() !== '' ? (
                    <img
                      src={v.photoUrl}
                      alt={v.name}
                      className="object-cover w-full h-full"
                      style={{ imageRendering: 'auto', filter: 'contrast(1.1) brightness(1.1)' }}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-400 text-2xl bg-slate-700">
                      <span>{v.name ? v.name[0] : '?'}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <User size={18} className="text-green-300" />
                    <span className="text-lg font-bold text-green-400">{v.name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <CreditCard size={16} className="text-green-300" />
                    <span className="text-xs bg-green-700/30 text-green-300 px-2 py-1 rounded inline-block">
                      Card No: <span className="font-bold text-green-200">{v.cardNo}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Building2 size={16} className="text-green-300" />
                <span className="font-semibold">Company:</span> {v.companyName}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <User size={16} className="text-green-300" />
                <span className="font-semibold">To Meet:</span> {v.toMeet}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Phone size={16} className="text-green-300" />
                <span className="font-semibold">Phone:</span> {v.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <ClipboardList size={16} className="text-green-300" />
                <span className="font-semibold">Purpose:</span> {v.purpose}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                <Clock4 size={14} className="text-green-300" />
                <span className="font-semibold">In Time:</span> {v.inTime}
              </div>
              {/* Checkout button */}
              <button
                className="mt-3 px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white font-semibold transition"
                onClick={() => handleCheckout(v.id)}
              >
                Checkout
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PresentVisitorPage;
