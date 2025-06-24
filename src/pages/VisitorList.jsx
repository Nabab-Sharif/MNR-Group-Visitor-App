import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useVisitorData from '@/hooks/useVisitorData';
import VisitorTable from '@/components/visitor/VisitorTable';
import VisitorEditDialog from '@/components/visitor/VisitorEditDialog';
import VisitorListHeader from '@/components/visitor/VisitorListHeader';
import VisitorCard from '@/components/visitor/VisitorCard';
import { parseISO, isToday, isThisMonth } from 'date-fns';



const VisitorList = () => {
  const {
    visitors,
    handleDelete,
    handleCheckout,
    handleUpdateVisitor,
    formatTime,
    calculateDuration,
    exportToExcel,
  } = useVisitorData();


  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingCardVisitor, setViewingCardVisitor] = useState(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const companyLogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/924959b3-e014-4736-8457-bb0ebc34acf2/d5218e41ff2a37fdb03a046db22ffe47.jpg";



  const filteredVisitors = useMemo(() => {
    return visitors.filter(visitor => {
      const term = (searchTerm || '').toLowerCase();
      const matchesText =
        (visitor.cardNo || '').toLowerCase().includes(term) ||
        (visitor.phone || '').toLowerCase().includes(term) ||
        (visitor.name || '').toLowerCase().includes(term);

      const matchesDate = searchDate
        ? (visitor.inTime && visitor.inTime.slice(0, 10) === searchDate)
        : true;

      return (!term || matchesText) && matchesDate;
    });
  }, [visitors, searchTerm, searchDate]);


  const todayVisitors = useMemo(() => filteredVisitors.filter(v => v.inTime && isToday(parseISO(v.inTime))), [filteredVisitors]);
  const monthVisitors = useMemo(() => filteredVisitors.filter(v => v.inTime && isThisMonth(parseISO(v.inTime))), [filteredVisitors]);

  const openEditDialog = (visitor) => {
    setEditingVisitor(visitor);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = (updatedVisitorData) => {
    handleUpdateVisitor(updatedVisitorData);
    setIsEditDialogOpen(false);
    setEditingVisitor(null);
  };

  const openCardDialog = (visitor) => {
    setViewingCardVisitor(visitor);
    setIsCardDialogOpen(true);
  };

  // Add delete all handler for month and all visitors
  const handleDeleteAll = (type) => {
    if (window.confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      let newVisitors = visitors;
      if (type === "month") {
        // Remove all visitors of this month
        const monthIds = new Set(monthVisitors.map(v => v.id));
        newVisitors = visitors.filter(v => !monthIds.has(v.id));
      } else if (type === "all") {
        // Remove all visitors
        newVisitors = [];
      }
      localStorage.setItem('visitors', JSON.stringify(newVisitors));
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700"
    >
      <VisitorListHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchDate={searchDate}
        onSearchDateChange={setSearchDate}
        onExportAll={() => exportToExcel(filteredVisitors, 'All_Visitors')}
        onExportToday={() => exportToExcel(todayVisitors, 'Todays_Visitors')}
        allVisitorsCount={filteredVisitors.length}
        todayVisitorsCount={todayVisitors.length}
      />

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="bg-slate-700 p-1 rounded-lg mb-4 w-full sm:w-auto justify-start sm:justify-center overflow-x-auto">
          <TabsTrigger value="today" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 text-slate-300">Today's Visitors ({todayVisitors.length})</TabsTrigger>
          <TabsTrigger value="month" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 text-slate-300">This Month's Visitors ({monthVisitors.length})</TabsTrigger>
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 text-slate-300">All Visitors ({filteredVisitors.length})</TabsTrigger>
        </TabsList>
        
        {[
          { value: "today", data: todayVisitors, title: "Today's Visitors" },
          { value: "month", data: monthVisitors, title: "This Month's Visitors" },
          { value: "all", data: filteredVisitors, title: "All Visitors" },
        ].map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            <VisitorTable 
              data={tab.data} 
              title={tab.title} 
              formatTime={formatTime}
              calculateDuration={calculateDuration}
              onCheckout={handleCheckout}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              onViewCard={openCardDialog}
            />
            {/* Add Delete All Data button for month and all visitors */}
            {(tab.value === "month" && monthVisitors.length > 0) && (
              <div className="mt-8 flex justify-center">
                <button
                  className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition"
                  onClick={() => handleDeleteAll("month")}
                >
                  Delete All Data
                </button>
              </div>
            )}
            {(tab.value === "all" && filteredVisitors.length > 0) && (
              <div className="mt-8 flex justify-center">
                <button
                  className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg transition"
                  onClick={() => handleDeleteAll("all")}
                >
                  Delete All Data
                </button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <VisitorEditDialog
        visitor={editingVisitor}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveChanges}
      />

      {viewingCardVisitor && (
        <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
          <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-50 p-0 overflow-hidden">
             <VisitorCard 
                visitor={viewingCardVisitor} 
                companyName="MNR Sweaters Ltd." 
                companyLogoUrl={companyLogoUrl} 
              />
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default VisitorList;