import React from 'react';

const getStats = () => {
  const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
  const total = visitors.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = visitors.filter(v => v.inTime && v.inTime.slice(0, 10) === today).length;
  const uniqueCompanies = new Set(visitors.map(v => v.companyName)).size;
  const uniqueToMeet = new Set(visitors.map(v => v.toMeet)).size;
  return { total, todayCount, uniqueCompanies, uniqueToMeet };
};

const statsIcons = [
  {
    color: "text-green-400 bg-green-900/40",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    color: "text-blue-400 bg-blue-900/40",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    color: "text-yellow-400 bg-yellow-900/40",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
  {
    color: "text-pink-400 bg-pink-900/40",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21h13a2 2 0 0 0 2-2v-2a7 7 0 0 0-14 0v2a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
];

const StatisticsView = () => {
  const stats = getStats();
  const statsData = [
    {
      label: "Total Visitors",
      value: stats.total,
      color: "text-green-400",
      icon: statsIcons[0].icon,
      bg: statsIcons[0].color,
    },
    {
      label: "Today's Visitors",
      value: stats.todayCount,
      color: "text-blue-400",
      icon: statsIcons[1].icon,
      bg: statsIcons[1].color,
    },
    {
      label: "Unique Companies",
      value: stats.uniqueCompanies,
      color: "text-yellow-400",
      icon: statsIcons[2].icon,
      bg: statsIcons[2].color,
    },
    {
      label: "Unique To Meet",
      value: stats.uniqueToMeet,
      color: "text-pink-400",
      icon: statsIcons[3].icon,
      bg: statsIcons[3].color,
    },
  ];

  const [modal, setModal] = React.useState({ open: false, stat: null });

  // Modal component for showing details
  const StatModal = ({ open, stat, onClose }) => {
    if (!open || !stat) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[300px] max-w-xs flex flex-col items-center relative">
          <button
            className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >×</button>
          <div className={`rounded-full p-4 bg-gradient-to-br ${stat.bg} mb-4`}>
            {stat.icon}
          </div>
          <div className="text-3xl font-extrabold mb-2">{stat.value}</div>
          <div className="text-lg font-semibold mb-2">{stat.label}</div>
          <div className="text-gray-500 text-center mb-2">
            {stat.label === "Total Visitors" && "Total number of visitors recorded in the system."}
            {stat.label === "Today's Visitors" && "Number of visitors who checked in today."}
            {stat.label === "Unique Companies" && "Number of unique companies represented by visitors."}
            {stat.label === "Unique To Meet" && "Number of unique people visitors came to meet."}
          </div>
          {/* Show raw data if available */}
          <ShowDataList stat={stat} />
        </div>
      </div>
    );
  };

  // Helper to show data in modal
  function ShowDataList({ stat }) {
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    let list = visitors;
    if (stat.label === "Today's Visitors") {
      const today = new Date().toISOString().slice(0, 10);
      list = visitors.filter(v => v.inTime && v.inTime.slice(0, 10) === today);
    }
    if (stat.label === "Unique Companies") {
      const seen = new Set();
      list = visitors
        .map(v => v.companyName)
        .filter(x => {
          if (seen.has(x)) return false;
          seen.add(x);
          return true;
        });
    }
    if (stat.label === "Unique To Meet") {
      // Count occurrences for each unique "toMeet"
      const countMap = {};
      visitors.forEach(v => {
        if (v.toMeet) {
          countMap[v.toMeet] = (countMap[v.toMeet] || 0) + 1;
        }
      });
      // Unique list with counts
      list = Object.entries(countMap).map(([name, count]) => ({ name, count }));
    }
    return (
      <div className="w-full mt-2 max-h-40 overflow-y-auto">
        <div className="font-bold mb-1 text-gray-700">{stat.label} List:</div>
        <ul className="text-xs text-gray-600 space-y-1">
          {Array.isArray(list) && list.length > 0 ? (
            list.map((item, idx) =>
              stat.label === "Unique To Meet"
                ? (
                  <li key={idx}>
                    {item.name} <span className="text-slate-400 font-bold">({item.count})</span>
                  </li>
                )
                : typeof item === "object" && item !== null ? (
                  <li key={idx}>{item.name || JSON.stringify(item)}</li>
                ) : (
                  <li key={idx}>{item}</li>
                )
            )
          ) : (
            <li>No data found.</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative min-h-[400px] rounded-2xl shadow-2xl border border-slate-700 p-10 mt-8 mx-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute w-60 h-60 bg-pink-400 opacity-20 rounded-full blur-2xl left-[-60px] top-[-60px] animate-blob1 z-0" />
      <div className="absolute w-60 h-60 bg-blue-400 opacity-20 rounded-full blur-2xl right-[-60px] bottom-[-60px] animate-blob2 z-0" />
      <h2 className="text-3xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300 tracking-tight drop-shadow-lg z-10 animate-fade-in">
        Visitor Statistics
      </h2>
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-10 z-10">
        {statsData.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center"
          >
            <div
              className={`relative flex flex-col items-center justify-center w-48 h-48 rounded-full bg-slate-800/80 shadow-xl border-2 border-slate-700 hover:scale-110 transition-transform duration-300 cursor-pointer group animate-fade-up overflow-hidden`}
              style={{ animationDelay: `${i * 0.12 + 0.2}s` }}
              onClick={() => setModal({ open: true, stat })}
            >
              {/* Make sure content stays inside the circle */}
              <div className="flex flex-col items-center justify-center w-full h-full overflow-hidden px-2">
                <div className={`absolute -top-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-br ${stat.bg} opacity-30 blur-2xl animate-blob`} />
                <div className={`absolute -bottom-8 -left-8 w-12 h-12 rounded-full bg-gradient-to-tr ${stat.bg} opacity-20 blur-2xl animate-blob2`} />
                {/* Icon with glass inner circle */}
                <div className={`flex items-center justify-center rounded-full bg-gradient-to-br ${stat.bg} p-5 shadow-lg border-2 border-white/20 mb-1 z-10`}>
                  {stat.icon}
                </div>
                <span className={`text-xl font-extrabold ${stat.color} drop-shadow group-hover:scale-110 transition-transform duration-200 z-10 text-center leading-tight`} style={{ textShadow: "0 2px 8px #0008", wordBreak: "break-word", maxWidth: "100%" }}>{stat.value}</span>
                <span className="text-slate-200 mt-1 text-xs font-semibold text-center group-hover:text-pink-300 transition-colors duration-200 z-10 leading-tight" style={{ wordBreak: "break-word", maxWidth: "100%" }}>{stat.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <StatModal open={modal.open} stat={modal.stat} onClose={() => setModal({ open: false, stat: null })} />
      {/* Animations */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(40px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        @keyframes fade-in {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        @keyframes blob1 {
          0% { transform: scale(1) translate(0,0);}
          100% { transform: scale(1.15) translate(40px, 30px);}
        }
        @keyframes blob2 {
          0% { transform: scale(1) translate(0,0);}
          100% { transform: scale(1.1) translate(-30px, -40px);}
        }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(.39,.575,.565,1) both;}
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(.39,.575,.565,1) both;}
        .animate-blob1 { animation: blob1 8s infinite alternate cubic-bezier(.39,.575,.565,1);}
        .animate-blob2 { animation: blob2 9s infinite alternate cubic-bezier(.39,.575,.565,1);}
      `}</style>
    </div>
  );
};

export default StatisticsView;
