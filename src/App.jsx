import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, UserPlus, List, Camera, FileText, CalendarDays, BarChart3, Download } from 'lucide-react';
import VisitorForm from '@/pages/VisitorForm';
import VisitorList from '@/pages/VisitorList';
import CalendarView from '@/pages/CalendarView';
import StatisticsView from '@/pages/StatisticsView';
import PresentVisitorPage from '@/pages/PresentVisitorPage';
import CheckoutVisitorPage from '@/pages/CheckoutVisitorPage';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as XLSX from 'xlsx';


const AppLayout = ({ children }) => {
  const location = useLocation();
  const logoUrl = "/icons/icon.svg";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Add Visitor', icon: <UserPlus size={24} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={24} /> },
    { path: '/visitor-list', label: 'Visitor List', icon: <List size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-50 flex flex-col">
      <header className="bg-slate-900/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center">
              <img src={logoUrl} alt="MNR Sweaters Ltd. Logo" className="h-10 w-10 object-cover rounded-full mr-3 shadow-md" />
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                MNR Sweaters Ltd.
              </h1>
            </Link>
          </motion.div>

          {/*....................... Desktop Navigation Start Here ......................... */}
          <nav className="hidden md:flex space-x-2 items-center">
            <TooltipProvider>
              {navItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={location.pathname === item.path ? "secondary" : "ghost"}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${location.pathname === item.path
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                    >
                      <Link to={item.path} className="flex items-center space-x-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white border-slate-700">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
          {/*....................... Desktop Navigation End Here ......................... */}


          {/*....................... Mobile Menu Button Start Here ......................... */}
          <div className="md:hidden relative">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Home size={24} />
            </Button>

            {mobileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 ${location.pathname === item.path ? 'bg-slate-700' : ''
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/*....................... Mobile Menu Button End Here ......................... */}

        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <footer className="bg-slate-900/80 backdrop-blur-md text-center py-4 text-sm text-slate-400 border-t border-slate-700">
        <p>© {new Date().getFullYear()} MNR Sweaters Ltd. All rights reserved.</p>
        <p>Built by MNR Sweaters Ltd. IT Team</p>
      </footer>

      <Toaster />
    </div>
  );
};


{/*.......................Helper to calculate duration between two ISO strings Start Here ......................... */}
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
{/*.......................Helper to calculate duration between two ISO strings End Here ......................... */}


// Export visitors as Excel file
function handleExportVisitors() {
  const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
  if (!visitors.length) {
    alert('No visitor data to export.');
    return;
  }
  const headers = [
    'Card No', 'Name', 'Phone', 'Company', 'To Meet', 'Purpose', 'In Time', 'Out Time', 'Duration'
  ];
  const rows = visitors.map(v => [
    v.cardNo || '',
    v.name || '',
    v.phone || '',
    v.companyName || '',
    v.toMeet || '',
    v.purpose || '',
    v.inTime || '',
    v.outTime || '',
    v.inTime && v.outTime ? calculateDuration(v.inTime, v.outTime) : ''
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Visitors');
  XLSX.writeFile(wb, 'visitors.xlsx');
}

// Import visitors from Excel file
function handleImportVisitors(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const [headers, ...dataRows] = rows;
    if (!headers || !dataRows.length) {
      alert('Invalid or empty Excel file.');
      return;
    }

    // Map Excel rows to visitor objects
    const importedVisitors = dataRows.map(row => ({
      cardNo: row[0] || '',
      name: row[1] || '',
      phone: row[2] || '',
      companyName: row[3] || '',
      toMeet: row[4] || '',
      purpose: row[5] || '',
      inTime: row[6] || '',
      outTime: row[7] || '',
      id: Date.now().toString() + Math.random().toString(36).slice(2)
    }));

    // Merge with existing visitors
    const existing = JSON.parse(localStorage.getItem('visitors') || '[]');
    localStorage.setItem('visitors', JSON.stringify([...existing, ...importedVisitors]));
    alert('Import successful!');
    // Optionally, reload page or trigger state update
    window.location.reload();
  };
  reader.readAsArrayBuffer(file);
}

const Dashboard = () => {
  const [showPresent, setShowPresent] = React.useState(false);

  // Get all visitors from localStorage
  const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
  const presentVisitors = visitors.filter(v => !v.outTime);
  const checkoutVisitors = visitors.filter(v => v.outTime);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold mb-6 ">Welcome to MNR Sweaters Ltd Visitor Management System</h2>
      <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
        This application is designed to efficiently manage visitor information for MNR Sweaters Ltd. You can easily add new visitors, view lists, and manage their details.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          icon={<UserPlus size={32} className="text-purple-400" />}
          title="Add Visitor"
          description="Easily add new visitor details like name, phone, purpose of visit, etc."
          linkTo="/"
        />
        <FeatureCard
          icon={<List size={32} className="text-sky-400" />}
          title="View Visitor List"
          description="See an organized list of today's, monthly, or all visitors and manage their information."
          linkTo="/visitor-list"
        />
        <FeatureCard
          icon={<Camera size={32} className="text-pink-400" />}
          title="Capture Photo"
          description="Take photos of visitors and save them with their profiles. (Feature active)"
          linkTo="/"
        />
      </div>
      <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300">
        <Link to="/" className="flex items-center space-x-2">
          <UserPlus />
          <span>Get Started</span>
        </Link>
      </Button>

      <motion.div
        className="mt-12 p-6 bg-slate-800/50 rounded-xl shadow-xl border border-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-slate-100 mb-4">Helpful Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
          {/* <ToolItem icon={<FileText className="text-green-400"/>} label="Generate Reports (CSV)" action={handleExportVisitors} /> */}
          <ToolItem icon={<BarChart3 className="text-red-400" />} label="Statistics" linkTo="/statistics" />
          <ToolItem icon={<Download className="text-indigo-400" />} label="Export Data" action={handleExportVisitors} />
          <ToolItem
            icon={<Download className="text-green-400 rotate-180" />}
            label="Import Data"
            action={() => document.getElementById('importVisitorsInput').click()}
          />
          {/* Hidden file input for import */}
          <input
            id="importVisitorsInput"
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleImportVisitors}
          />
          <ToolItem icon={<CalendarDays className="text-yellow-400" />} label="Calendar View" linkTo="/calendar" />
          {/* Present/Checkout Visitor Cards with same size/content as Import Data */}
          <Link
            to="/present-visitors"
            className="flex flex-col items-center justify-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200 h-24 min-w-[96px] cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <UserPlus size={24} className="text-green-400 mb-1" />
            <span className="mt-1 text-xs text-slate-300 text-center">Current Present</span>
            <span className="text-lg font-bold text-green-400">{presentVisitors.length}</span>
          </Link>
          <Link
            to="/checkout-visitors"
            className="flex flex-col items-center justify-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200 h-24 min-w-[96px] cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <Download size={24} className="text-pink-400 mb-1" />
            <span className="mt-1 text-xs text-slate-300 text-center">Checked Out</span>
            <span className="text-lg font-bold text-pink-400">{checkoutVisitors.length}</span>
          </Link>
        </div>

        {/* Show present visitor list if selected */}
        {showPresent && (
          <div className="mt-6 bg-slate-900 rounded-lg p-4 border border-green-700 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-green-400 mb-2">Current Present Visitors</h4>
            {presentVisitors.length === 0 ? (
              <p className="text-slate-400">No present visitors.</p>
            ) : (
              <ul className="divide-y divide-slate-700">
                {presentVisitors.map(v => (
                  <li key={v.id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium text-slate-100">{v.name}</span>
                    <span className="text-slate-400 text-sm">{v.companyName}</span>
                    <span className="text-slate-400 text-sm">{v.toMeet}</span>
                    <span className="text-slate-400 text-sm">{v.cardNo}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description, linkTo, onClick, clickable }) => (
  <motion.div
    className="bg-slate-800/70 p-6 rounded-xl shadow-lg border border-slate-700 hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col"
    whileHover={{ y: -5 }}
    onClick={clickable ? onClick : undefined}
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-400 text-sm mb-4 flex-grow">{description}</p>
    {linkTo && (
      <Button asChild variant="outline" className="mt-auto border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
        <Link to={linkTo}>Go to {title}</Link>
      </Button>
    )}
  </motion.div>
);

const ToolItem = ({ icon, label, action, linkTo }) => (
  linkTo ? (
    <Button
      asChild
      variant="ghost"
      className="flex flex-col items-center justify-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200 h-24"
    >
      <Link to={linkTo}>
        {icon}
        <span className="mt-1 text-xs text-slate-300 text-center">{label}</span>
      </Link>
    </Button>
  ) : (
    <Button
      variant="ghost"
      onClick={action}
      className="flex flex-col items-center justify-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors duration-200 h-24"
    >
      {icon}
      <span className="mt-1 text-xs text-slate-300 text-center">{label}</span>
    </Button>
  )
);


const App = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<VisitorForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visitor-list" element={<VisitorList />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/statistics" element={<StatisticsView />} />
          <Route path="/present-visitors" element={<PresentVisitorPage />} />
          <Route path="/checkout-visitors" element={<CheckoutVisitorPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;