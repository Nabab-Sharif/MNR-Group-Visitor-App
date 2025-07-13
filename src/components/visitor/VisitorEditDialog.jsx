import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const VisitorEditDialog = ({ visitor, isOpen, onOpenChange, onSave }) => {
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editToMeet, setEditToMeet] = useState('');
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editPurpose, setEditPurpose] = useState('');

  useEffect(() => {
    if (visitor) {
      setEditName(visitor.name || '');
      setEditPhone(visitor.phone || '');
      setEditToMeet(visitor.toMeet || '');
      setEditCompanyName(visitor.companyName || '');
      setEditPurpose(visitor.purpose || '');
    }
  }, [visitor]);

  const handleSaveChanges = () => {
    if (!visitor) return;
    const updatedData = {
      ...visitor,
      name: editName,
      phone: editPhone,
      toMeet: editToMeet,
      companyName: editCompanyName,
      purpose: editPurpose,
    };
    onSave(updatedData);
  };

  if (!visitor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Edit Visitor Information</DialogTitle>
          <DialogDescription className="text-slate-400">
            Modify the details for {visitor.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {[
            { label: "Name", value: editName, setter: setEditName, id: "edit-name" },
            { label: "Phone", value: editPhone, setter: setEditPhone, id: "edit-phone" },
            { label: "To Meet", value: editToMeet, setter: setEditToMeet, id: "edit-toMeet" },
            { label: "Company", value: editCompanyName, setter: setEditCompanyName, id: "edit-companyName" },
          ].map(field => (
            <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
              <Label htmlFor={field.id} className="text-right text-slate-300">{field.label}</Label>
              <Input id={field.id} value={field.value} onChange={(e) => field.setter(e.target.value)} className="col-span-3 bg-slate-700 border-slate-600 text-slate-50 focus:border-yellow-500 focus:ring-yellow-500" />
            </div>
          ))}
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-purpose" className="text-right text-slate-300 pt-2">Purpose</Label>
            <Textarea id="edit-purpose" value={editPurpose} onChange={(e) => setEditPurpose(e.target.value)} rows={3} className="col-span-3 bg-slate-700 border-slate-600 text-slate-50 focus:border-yellow-500 focus:ring-yellow-500 p-2 rounded-md" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-slate-800 hover:text-yellow-50 border-rose-700 bg-slate-900">Cancel</Button>
          <Button type="button" onClick={handleSaveChanges} className="bg-yellow-500 hover:bg-yellow-600 text-white">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VisitorEditDialog;