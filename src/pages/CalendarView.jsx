import React, { useState } from 'react';

// Always get fresh data from localStorage on each render
const getVisitorsByDate = () => {
  const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
  const byDate = {};
  visitors.forEach(visitor => {
    // Defensive: skip if no inTime or id
    if (!visitor.inTime || !visitor.id) return;
    const date = visitor.inTime.slice(0, 10);
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(visitor);
  });
  return byDate;
};

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const visitorsByDate = getVisitorsByDate();
  const allDates = Object.keys(visitorsByDate).sort().reverse();

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 min-h-[400px] mt-8 mx-0">
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-400 tracking-tight">Calendar View</h2>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <label className="text-slate-300 font-semibold mr-2">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          max={allDates[0] || ''}
        />
        {selectedDate && (
          <button
            className="ml-2 px-3 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 transition"
            onClick={() => setSelectedDate('')}
          >
            Show All
          </button>
        )}
      </div>
      <div>
        {(selectedDate ? [selectedDate] : allDates).map(date => (
          <div key={date} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
              <h3 className="text-xl font-semibold text-slate-100">{date}</h3>
              <span className="ml-2 text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                {visitorsByDate[date]?.length || 0} visitor{visitorsByDate[date]?.length === 1 ? '' : 's'}
              </span>
            </div>
            {visitorsByDate[date] && visitorsByDate[date].length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {visitorsByDate[date].map(visitor => (
                  <div key={visitor.id + visitor.inTime} className="bg-slate-900 rounded-xl shadow border border-purple-700 p-5 flex flex-col gap-2 hover:shadow-purple-700/30 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500 bg-slate-800 flex-shrink-0">
                        {visitor.photoUrl ? (
                          <img src={visitor.photoUrl} alt={visitor.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-purple-400 text-2xl bg-slate-700">
                            <span>{visitor.name ? visitor.name[0] : '?'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-purple-400">{visitor.name}</div>
                        <div className="text-xs bg-purple-700/30 text-purple-300 px-2 py-1 rounded inline-block mt-1">{visitor.cardNo}</div>
                      </div>
                    </div>
                    <div className="text-slate-300 text-sm">
                      <span className="font-semibold">Company:</span> {visitor.companyName}
                    </div>
                    <div className="text-slate-300 text-sm">
                      <span className="font-semibold">To Meet:</span> {visitor.toMeet}
                    </div>
                    <div className="text-slate-300 text-sm">
                      <span className="font-semibold">Phone:</span> {visitor.phone}
                    </div>
                    <div className="text-slate-300 text-sm">
                      <span className="font-semibold">Purpose:</span> {visitor.purpose}
                    </div>
                    <div className="text-slate-400 text-xs mt-2">
                      <span className="font-semibold">In Time:</span> {visitor.inTime}
                    </div>
                    {visitor.outTime && (
                      <div className="text-slate-400 text-xs">
                        <span className="font-semibold">Out Time:</span> {visitor.outTime}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center mt-4">No visitors found for this date.</p>
            )}
          </div>
        ))}
        {allDates.length === 0 && (
          <div className="text-center text-slate-400 mt-12 text-lg">
            No visitor data found.
          </div>
        )}
      </div>
      {/* Overview Graph at the bottom */}
      <div className="w-full max-w-5xl mx-auto mt-16">
        <h3 className="text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 tracking-tight drop-shadow-lg">
          Calendar Overview
        </h3>
        <div className="relative flex items-end h-64 bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-3xl shadow-2xl p-10 border border-white/10 overflow-x-auto">
          {/* Decorative grid dots */}
          <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" width="100%" height="100%">
            <defs>
              <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#334155" opacity="0.13" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
          {/* Grid lines */}
          {[1, 0.75, 0.5, 0.25].map((frac, idx) => (
            <div
              key={idx}
              className="absolute left-0 w-full border-t border-dashed border-slate-700"
              style={{ bottom: `${frac * 100}%`, zIndex: 1 }}
            >
              <span className="absolute left-0 -top-4 text-xs text-slate-500 pl-2 font-mono">
                {Math.round(Math.max(...allDates.map(date => visitorsByDate[date]?.length || 0), 1) * frac)}
              </span>
            </div>
          ))}
          {/* Bars */}
          {allDates.slice().reverse().slice(-14).map((date, idx, arr) => {
            const count = visitorsByDate[date]?.length || 0;
            const maxCount = Math.max(...allDates.map(d => visitorsByDate[d]?.length || 0), 1);
            return (
              <div
                key={date}
                className="flex flex-col items-center z-10 cursor-pointer group"
                style={{
                  minWidth: "38px",
                  marginLeft: idx === 0 ? 0 : 18,
                  marginRight: idx === arr.length - 1 ? 0 : 18,
                }}
                title={date}
                onClick={() => setSelectedDate(date)}
              >
                {/* Value label above bar with glow */}
                <span
                  className="mb-2 text-xl font-extrabold transition-all duration-200 group-hover:scale-110"
                  style={{
                    color: "#a78bfa",
                    textShadow: "0 2px 16px #fff8, 0 1px 0 #fff4, 0 0 8px #a78bfa"
                  }}
                >
                  {count}
                </span>
                {/* Animated 3D bar with glass and neon border */}
                <div
                  className="rounded-t-2xl transition-all duration-700 group-hover:scale-x-110 relative"
                  style={{
                    height: `${maxCount ? (count / maxCount) * 128 : 0}px`,
                    width: "38px",
                    background: `linear-gradient(180deg,#a78bfa 70%,#232946 100%)`,
                    boxShadow: `0 12px 40px 0 #a78bfa33, 0 2px 8px 0 #fff2 inset`,
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    borderBottomLeftRadius: "14px",
                    borderBottomRightRadius: "14px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    border: `2.5px solid #a78bfa`,
                    transform: "rotateX(7deg) scaleY(1.06)",
                    backdropFilter: "blur(2px)",
                    overflow: "hidden"
                  }}
                  title={count}
                >
                  {/* Neon glow at base */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "18px",
                    background: `radial-gradient(ellipse at center, #a78bfa88 0%, transparent 80%)`,
                    filter: "blur(4px)",
                    zIndex: 2,
                    opacity: 0.7
                  }} />
                  {/* Glass shine */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "60%",
                    background: "linear-gradient(120deg,rgba(255,255,255,0.18) 30%,rgba(255,255,255,0.02) 100%)",
                    zIndex: 2,
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px"
                  }} />
                </div>
                {/* Date label */}
                <span className="text-xs text-slate-400 mt-2 font-semibold tracking-wide group-hover:text-fuchsia-300 transition-colors text-center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
                  {date.slice(5)}
                </span>
                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
