import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, LogOut, UserCircle2, CreditCard } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VisitorTable = ({
  data,
  title,
  formatTime,
  calculateDuration,
  onCheckout,
  onEdit,
  onDelete,
  onViewCard,
}) => {
  if (data.length === 0) {
    return <p className="text-center text-slate-400 py-8 text-lg">No visitors in this list.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto"
    >
      <Table className="min-w-full">
        <TableHeader className="bg-slate-700/50">
          <TableRow>
            <TableHead className="text-slate-300 font-semibold">Photo</TableHead>
            <TableHead className="text-slate-300 font-semibold">Card No</TableHead>
            <TableHead className="text-slate-300 font-semibold">Name</TableHead>
            <TableHead className="text-slate-300 font-semibold">Phone</TableHead>
            <TableHead className="text-slate-300 font-semibold">Company</TableHead>
            <TableHead className="text-slate-300 font-semibold">To Meet</TableHead>
            <TableHead className="text-slate-300 font-semibold">Purpose</TableHead>
            <TableHead className="text-slate-300 font-semibold">Date</TableHead>
            <TableHead className="text-slate-300 font-semibold">In Time</TableHead>
            <TableHead className="text-slate-300 font-semibold">Out Time</TableHead>
            <TableHead className="text-slate-300 font-semibold">Duration</TableHead>
            <TableHead className="text-slate-300 font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((visitor) => (
            <TableRow key={visitor.id} className="border-b border-slate-700 hover:bg-slate-800/60 transition-colors">
              <TableCell>
                {visitor.photoDataUrl ? (
                  <img src={visitor.photoDataUrl} alt={visitor.name} className="h-12 w-12 rounded-full object-cover border-2 border-purple-500 shadow-sm" />
                ) : (
                  <UserCircle2 size={48} className="text-slate-500" />
                )}
              </TableCell>
              <TableCell className="font-medium text-slate-200">{visitor.cardNo || 'N/A'}</TableCell>
              <TableCell className="font-medium text-slate-200">{visitor.name}</TableCell>
              <TableCell className="text-slate-300">{visitor.phone}</TableCell>
              <TableCell className="text-slate-300">{visitor.companyName}</TableCell>
              <TableCell className="text-slate-300">{visitor.toMeet}</TableCell>
              <TableCell className="text-slate-300">{visitor.purpose}</TableCell>
              <TableCell className="text-slate-300">
                {visitor.inTime ? visitor.inTime.slice(0, 10) : '-'}
              </TableCell>
              <TableCell className="text-slate-300">{formatTime(visitor.inTime)}</TableCell>
              <TableCell className="text-slate-300">{visitor.outTime ? formatTime(visitor.outTime) : '-'}</TableCell>
              <TableCell className="text-slate-300">
                {visitor.inTime && visitor.outTime
                  ? calculateDuration(visitor.inTime, visitor.outTime)
                  : '-'}
              </TableCell>
              <TableCell className="text-right space-x-1 md:space-x-2">
                <Button variant="ghost" size="icon" className="text-sky-400 hover:text-sky-300" onClick={() => onViewCard(visitor)} title="View Card">
                  <CreditCard size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-300" onClick={() => onEdit(visitor)} title="Edit">
                  <Edit size={18} />
                </Button>
                 {visitor.outTime ? 
                  <span className="text-xs text-green-400 p-2 inline-block align-middle" title={`Checked Out: ${formatTime(visitor.outTime)} | Duration: ${calculateDuration(visitor.inTime, visitor.outTime)}`}>Checked Out</span>
                  : (
                  <Button variant="ghost" size="icon" className="text-green-400 hover:text-green-300" onClick={() => onCheckout(visitor.id)} title="Check Out">
                    <LogOut size={18} />
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" title="Delete">
                      <Trash2 size={18} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-50">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-400">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This visitor's data will be permanently deleted. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:bg-slate-800 hover:text-white border-rose-700 bg-slate-900">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(visitor.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default VisitorTable;