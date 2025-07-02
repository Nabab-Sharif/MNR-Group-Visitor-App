import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download } from 'lucide-react';

const VisitorListHeader = ({
  searchTerm,
  onSearchTermChange,
  searchDate,
  onSearchDateChange,
  onExportAll,
  onExportToday,
  allVisitorsCount,
  todayVisitorsCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
        <input
          type="text"
          placeholder="Search by Card No, Phone, or Name"
          value={searchTerm}
          onChange={e => onSearchTermChange(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-200 w-full sm:w-64"
        />
        <input
          type="date"
          value={searchDate}
          onChange={e => onSearchDateChange(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-200 w-full sm:w-44"
        />
      </div>
      <div className="flex space-x-2 w-full sm:w-auto justify-center">
        <Button 
          id="exportAllVisitorsButton"
          variant="outline" 
          className="text-slate-800 border-slate-600 hover:bg-slate-700 hover:text-white flex-1 sm:flex-none" 
          onClick={onExportAll}
          disabled={allVisitorsCount === 0}
        >
          <FileText className="mr-2 h-4 w-4" /> All ({allVisitorsCount})
        </Button>

        <Button 
          id="exportTodayVisitorsButton"
          variant="outline" 
          className="text-slate-800 border-slate-600 hover:bg-slate-700 hover:text-white flex-1 sm:flex-none" 
          onClick={onExportToday}
          disabled={todayVisitorsCount === 0}
        >
          <Download className="mr-2 h-4 w-4" /> Today's ({todayVisitorsCount})
        </Button>

      </div>
    </div>
  );
};

export default VisitorListHeader;