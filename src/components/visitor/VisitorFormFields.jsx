import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, Briefcase, Building, Edit3, Plus, Edit2, Trash2, CreditCard } from 'lucide-react';
import React from 'react';

const TO_MEET_KEY = 'toMeetOptions';

const VisitorFormFields = ({ formData }) => {
  const {
    name, setName,
    phone, setPhone,
    toMeet, setToMeet,
    companyName, setCompanyName,
    purpose, setPurpose,
    cardNo, setCardNo,
  } = formData;

  const [toMeetOptions, setToMeetOptions] = React.useState(() => {
    const saved = localStorage.getItem(TO_MEET_KEY);
    return saved ? JSON.parse(saved) : [
      "Manager",
      "Reception",
      "HR",
      "Admin",
      "Security"
    ];
  });
  const [editingToMeet, setEditingToMeet] = React.useState(null);
  const [toMeetInput, setToMeetInput] = React.useState('');
  const [showToMeetInput, setShowToMeetInput] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem(TO_MEET_KEY, JSON.stringify(toMeetOptions));
  }, [toMeetOptions]);

  // Add To Meet option (show input inside dropdown)
  const handleAddToMeet = () => {
    setShowToMeetInput(true);
    setEditingToMeet(null);
    setToMeetInput('');
  };

  const handleConfirmAddToMeet = () => {
    const value = toMeetInput.trim();
    if (value && !toMeetOptions.includes(value)) {
      setToMeetOptions([...toMeetOptions, value]);
      formData.setToMeet(value);
      setToMeetInput('');
      setShowToMeetInput(false);
      setDropdownOpen(false);
    }
  };

  const handleEditToMeet = (oldValue) => {
    setEditingToMeet(oldValue);
    setToMeetInput(oldValue);
    setShowToMeetInput(true);
    setDropdownOpen(false);
  };

  const handleSaveEditToMeet = () => {
    const value = toMeetInput.trim();
    if (editingToMeet && value) {
      setToMeetOptions(
        toMeetOptions.map(opt => (opt === editingToMeet ? value : opt))
      );
      if (formData.toMeet === editingToMeet) {
        formData.setToMeet(value);
      }
      setEditingToMeet(null);
      setToMeetInput('');
      setShowToMeetInput(false);
      setDropdownOpen(false);
    }
  };

  const handleDeleteToMeet = (value) => {
    setToMeetOptions(toMeetOptions.filter(opt => opt !== value));
    if (formData.toMeet === value) {
      formData.setToMeet('');
    }
    if (editingToMeet === value) {
      setEditingToMeet(null);
      setToMeetInput('');
      setShowToMeetInput(false);
    }
    setDropdownOpen(false);
  };

  const inputFields = [
    { id: "cardNo", label: "Card No", type: "text", value: cardNo, setter: setCardNo, icon: <CreditCard className="mr-2 h-4 w-4 text-pink-400" />, placeholder: "Enter card number", required: true },
    { id: "name", label: "Name", type: "text", value: name, setter: setName, icon: <User className="mr-2 h-4 w-4 text-purple-400" />, placeholder: "Visitor's full name", required: true },
    { id: "phone", label: "Phone Number", type: "tel", value: phone, setter: setPhone, icon: <Phone className="mr-2 h-4 w-4 text-sky-400" />, placeholder: "e.g., 01xxxxxxxxx", required: false },
    { id: "companyName", label: "Company Name", type: "text", value: companyName, setter: setCompanyName, icon: <Building className="mr-2 h-4 w-4 text-yellow-400" />, placeholder: "Visitor's company name", required: true },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="flex items-center text-slate-300 font-semibold">
              {field.icon} {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500"
              required={field.required}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="toMeet" className="flex items-center text-slate-300 font-semibold">
          <Briefcase className="mr-2 h-4 w-4 text-green-400" /> To Meet <span className="text-red-500 ml-1">*</span>
        </Label>
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <button
              type="button"
              className="w-full bg-slate-700 border-slate-600 text-slate-50 rounded px-3 py-2 text-left flex justify-between items-center"
              onClick={() => setDropdownOpen((open) => !open)}
              tabIndex={0}
            >
              {formData.toMeet || "Select person"}
              <span className="ml-2 text-green-400"><Plus size={18} /></span>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-slate-800 border border-slate-700 rounded shadow-lg z-20">
                <ul>
                  {toMeetOptions.map(option => (
                    <li key={option} className="flex items-center justify-between px-3 py-2 hover:bg-slate-700 cursor-pointer"
                        onClick={() => { formData.setToMeet(option); setDropdownOpen(false); }}>
                      <span>{option}</span>
                      <span className="flex items-center">
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleEditToMeet(option); }}
                          className="ml-2 text-yellow-400 hover:text-yellow-300"
                          tabIndex={-1}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleDeleteToMeet(option); }}
                          className="ml-1 text-red-400 hover:text-red-300"
                          tabIndex={-1}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center px-3 py-2 border-t border-slate-700">
                    {showToMeetInput || editingToMeet ? (
                      <>
                        <input
                          type="text"
                          value={toMeetInput}
                          onChange={e => setToMeetInput(e.target.value)}
                          placeholder={editingToMeet ? "Edit person" : "Add person"}
                          className="bg-slate-800 border-slate-600 text-slate-50 rounded px-2 py-1 w-full"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              editingToMeet ? handleSaveEditToMeet() : handleConfirmAddToMeet();
                            }
                            if (e.key === 'Escape') {
                              setShowToMeetInput(false);
                              setEditingToMeet(null);
                              setToMeetInput('');
                            }
                          }}
                        />
                        {editingToMeet ? (
                          <button type="button" onClick={handleSaveEditToMeet} className="ml-2 text-yellow-400 hover:text-yellow-300" title="Save Edit">
                            <Edit2 size={18} />
                          </button>
                        ) : (
                          <button type="button" onClick={handleConfirmAddToMeet} className="ml-2 text-green-400 hover:text-green-300" title="Add">
                            <Plus size={18} />
                          </button>
                        )}
                        <button type="button" onClick={() => { setShowToMeetInput(false); setEditingToMeet(null); setToMeetInput(''); }} className="ml-2 text-red-400 hover:text-red-300" title="Cancel">
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAddToMeet}
                        className="text-green-400 hover:text-green-300 flex items-center"
                        title="Add"
                        tabIndex={-1}
                      >
                        <Plus size={18} className="mr-1" /> Add New
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose" className="flex items-center text-slate-300 font-semibold">
          <Edit3 className="mr-2 h-4 w-4 text-orange-400" /> Purpose of Visit <span className="text-red-500 ml-1">*</span>
        </Label>
        <Textarea
          id="purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Write details here..."
          className="bg-slate-700 border-slate-600 text-slate-50 placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
          required
        />
      </div>
    </>
  );
};

export default VisitorFormFields;