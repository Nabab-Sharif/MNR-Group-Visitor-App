import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, UserCircle2, Building, Phone, Briefcase, Edit3, Clock, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const VisitorCard = ({ visitor, companyLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/924959b3-e014-4736-8457-bb0ebc34acf2/d5218e41ff2a37fdb03a046db22ffe47.jpg", companyName = "MNR Sweaters Ltd." }) => {
  const cardRef = useRef(null);

  const handlePrint = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Visitor Pass</title>');
    printWindow.document.write('<link rel="stylesheet" href="/src/index.css">'); 
    printWindow.document.write('<style>');
    printWindow.document.write(`
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
      body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
      .visitor-card-print-area { 
        width: 350px !important; 
        height: auto !important;
        min-height: 520px !important; 
        padding: 20px !important; 
        border: 1px solid #ccc !important; 
        box-shadow: 0 0 10px rgba(0,0,0,0.1) !important; 
        background-color: white !important;
        border-radius: 8px !important;
        box-sizing: border-box !important;
        display: flex;
        flex-direction: column;
      }
      .visitor-card-print-area img { max-width: 100%; height: auto; }
      .visitor-card-print-area .logo-image { border-radius: 50% !important; width: 64px !important; height: 64px !important; object-fit: cover !important; }
      .visitor-card-print-area h2, .visitor-card-print-area h3, .visitor-card-print-area p { margin: 0.5em 0; color: #333; }
      .visitor-card-print-area .text-purple-700 { color: #6b21a8 !important; }
      .visitor-card-print-area .text-slate-600 { color: #475569 !important; }
      .visitor-card-print-area .text-slate-800 { color: #1e293b !important; }
      .visitor-card-print-area .text-slate-900 { color: #0f172a !important; }
      .visitor-card-print-area .text-slate-500 { color: #64748b !important; }
      .visitor-card-print-area .border-slate-300 { border-color: #cbd5e1 !important; }
      .visitor-card-print-area .border-purple-500 { border-color: #a855f7 !important; }
      .visitor-card-print-area .bg-gradient-to-br { background: linear-gradient(to bottom right, #f8fafc, #e2e8f0) !important; }
      .flex { display: flex !important; }
      .flex-col { flex-direction: column !important; }
      .items-center { align-items: center !important; }
      .mb-4 { margin-bottom: 1rem !important; }
      .pb-4 { padding-bottom: 1rem !important; }
      .border-b { border-bottom-width: 1px !important; }
      .h-16 { height: 4rem !important; }
      .w-auto { width: auto !important; }
      .mb-2 { margin-bottom: 0.5rem !important; }
      .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
      .font-bold { font-weight: 700 !important; }
      .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
      .mb-6 { margin-bottom: 1.5rem !important; }
      .w-24 { width: 6rem !important; }
      .h-24 { height: 6rem !important; }
      .rounded-full { border-radius: 9999px !important; }
      .overflow-hidden { overflow: hidden !important; }
      .border-2 { border-width: 2px !important; }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06) !important; }
      .mr-4 { margin-right: 1rem !important; }
      .flex-shrink-0 { flex-shrink: 0 !important; }
      .object-cover { object-fit: cover !important; }
      .w-full { width: 100% !important; }
      .h-full { height: 100% !important; }
      .p-2 { padding: 0.5rem !important; }
      .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
      .font-semibold { font-weight: 600 !important; }
      .mr-1 { margin-right: 0.25rem !important; }
      .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
      .mt-0\.5 { margin-top: 0.125rem !important; }
      .font-medium { font-weight: 500 !important; }
      .mt-6 { margin-top: 1.5rem !important; }
      .pt-4 { padding-top: 1rem !important; }
      .border-t { border-top-width: 1px !important; }
      .text-center { text-align: center !important; }
      .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
      .print-button-container { display: none !important; } 
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(cardElement.outerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus(); 
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatShortTime = (isoString) => {
    if (!isoString) return 'N/A';
    return format(new Date(isoString), 'dd MMM, yyyy hh:mm a', { locale: enUS });
  };
  
  return (
    <div className="p-10">

      <div ref={cardRef} className="visitor-card-print-area bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 p-6 rounded-lg shadow-xl w-[350px] mx-auto border border-slate-300">
        <div className="flex flex-col items-center mb-4 pb-4 border-b border-slate-300">
          {companyLogoUrl && <img src={companyLogoUrl} alt={`${companyName} Logo`} className="logo-image h-16 w-16 object-cover rounded-full mb-2 shadow-md" />}
          <h2 className="text-2xl font-bold text-purple-700">{companyName}</h2>
          <p className="text-sm text-slate-600">Visitor Pass</p>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 shadow-md mr-4 flex-shrink-0">
            {visitor.photoDataUrl ? (
              <img src={visitor.photoDataUrl} alt={visitor.name} className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 size={96} className="text-slate-400 w-full h-full p-2" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{visitor.name}</h3>
            {visitor.companyName && <p className="text-sm text-slate-600 flex items-center"><Building size={14} className="mr-1 text-purple-600" />{visitor.companyName}</p>}
            {visitor.phone && <p className="text-sm text-slate-600 flex items-center"><Phone size={14} className="mr-1 text-purple-600" />{visitor.phone}</p>}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex">
            <Hash size={16} className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-500">Card No:</p>
              <p className="text-slate-700 font-semibold">{visitor.cardNo || 'N/A'}</p>
            </div>
          </div>
          <div className="flex">
            <Briefcase size={16} className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-500">To Meet:</p>
              <p className="text-slate-700">{visitor.toMeet}</p>
            </div>
          </div>
          <div className="flex">
            <Edit3 size={16} className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-500">Purpose:</p>
              <p className="text-slate-700">{visitor.purpose}</p>
            </div>
          </div>
          <div className="flex">
            <Clock size={16} className="mr-2 mt-0.5 text-purple-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-slate-500">In-Time:</p>
              <p className="text-slate-700">{formatShortTime(visitor.inTime)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-300 text-center">
          <p className="text-xs text-slate-500">This pass is valid for the specified time only.</p>
          <p className="text-xs text-slate-500">MNR Sweaters Ltd. reserves the right to revoke this pass at any time.</p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center print-button-container">
        <Button onClick={handlePrint} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold shadow-lg">
          <Printer className="mr-2 h-4 w-4" /> Print Card
        </Button>
      </div>

    </div>
  );
};

export default VisitorCard;