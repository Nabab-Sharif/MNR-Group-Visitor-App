import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';
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

const VisitorFormActions = ({ onReset }) => {
  return (
    <div className="flex justify-end space-x-4 pt-4">
       <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="outline" className="text-yellow-50 border-rose-700 bg-slate-900 hover:bg-rose-700 hover:text-black">
            <Trash2 className="mr-2 h-4 w-4" /> Reset
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-400">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              All form data will be cleared. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-800 hover:text-white border-rose-700 bg-slate-900">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onReset} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button type="submit" className="bg-gradient-to-r  from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-black font-semibold shadow-lg">
        <Save className="mr-2 h-4 w-4" /> Save Data
      </Button>
    </div>
  );
};

export default VisitorFormActions;