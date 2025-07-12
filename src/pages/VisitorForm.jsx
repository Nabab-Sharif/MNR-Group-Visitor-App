import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import VisitorFormFields from '@/components/visitor/VisitorFormFields';
import VisitorPhotoUpload from '@/components/visitor/VisitorPhotoUpload';
import VisitorFormActions from '@/components/visitor/VisitorFormActions';
import { useNavigate } from 'react-router-dom';


const VisitorForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [toMeet, setToMeet] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [photo, setPhoto] = useState(null);
  const [cardNo, setCardNo] = useState('');

  
  const resetForm = () => {
    setName('');
    setPhone('');
    setToMeet('');
    setCompanyName('');
    setPurpose('');
    setPhoto(null);
    setCardNo('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !toMeet || !companyName || !purpose || !cardNo) {
      toast({
        variant: "destructive",
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const newVisitor = {
      id: Date.now().toString(),
      name,
      phone,
      toMeet,
      companyName,
      purpose,
      cardNo,
      photoDataUrl: photo,
      inTime: new Date().toISOString(),
      outTime: null,
    };

    const existingVisitorsRaw = localStorage.getItem('visitors');
    let existingVisitors = [];
    try {
      if (existingVisitorsRaw) {
        existingVisitors = JSON.parse(existingVisitorsRaw);
        if (!Array.isArray(existingVisitors)) existingVisitors = [];
      }
    } catch {
      existingVisitors = [];
    }

    // --- FIX: Use async/await with FileReader for base64 photo compression ---
    const saveVisitor = (photoData) => {
      try {
        localStorage.setItem('__storage_test__', '1');
        localStorage.removeItem('__storage_test__');
      } catch {
        toast({
          variant: "destructive",
          title: "Storage Error",
          description: "Local storage is full. Please clear some data and try again.",
        });
        return;
      }

      try {
        localStorage.setItem('visitors', JSON.stringify([
          ...existingVisitors,
          { ...newVisitor, photoDataUrl: photoData }
        ]));
        toast({
          title: "Successfully Added",
          description: `${name}'s information has been saved.`,
        });
        resetForm();
        // setTimeout(() => {
        //   navigate('/visitor-list');
        // }, 500);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Storage Error",
          description: "Visitor data could not be saved. Local storage is full or data is corrupted.",
        });
      }
    };

    if (photo && typeof photo === 'string' && photo.length > 500000) {
      try {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = photo;
        img.onload = function () {
          try {
            // Use a much smaller size and lower quality for base64
            const maxW = 80;
            const maxH = 60;
            let w = img.width;
            let h = img.height;
            if (w > maxW || h > maxH) {
              const scale = Math.min(maxW / w, maxH / h);
              w = Math.max(20, Math.floor(w * scale));
              h = Math.max(20, Math.floor(h * scale));
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const reducedPhoto = canvas.toDataURL('image/jpeg', 0.25); // very low quality

            // Check if reduced photo is still too large for localStorage
            try {
              localStorage.setItem('__storage_test__', reducedPhoto);
              localStorage.removeItem('__storage_test__');
            } catch {
              toast({
                variant: "destructive",
                title: "Storage Error",
                description: "Local storage is full or image is still too large. Please clear some data or use a much smaller photo.",
              });
              return;
            }

            saveVisitor(reducedPhoto);
          } catch {
            toast({
              variant: "destructive",
              title: "Photo Error",
              description: "Photo could not be processed. Try a much smaller image.",
            });
          }
        };
        img.onerror = function () {
          toast({
            variant: "destructive",
            title: "Photo Error",
            description: "Photo could not be processed. Try a smaller image.",
          });
        };
        return;
      } catch {
        toast({
          variant: "destructive",
          title: "Photo Error",
          description: "Photo could not be processed. Try a smaller image.",
        });
        return;
      }
    }

    // Save directly if no resize needed
    saveVisitor(photo);
  };

  const formData = {
    name, setName,
    phone, setPhone,
    toMeet, setToMeet,
    companyName, setCompanyName,
    purpose, setPurpose,
    cardNo, setCardNo, // pass cardNo to VisitorFormFields
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-800 rounded-xl shadow-2xl border border-slate-700"
    >
      <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        New Visitor Information
      </h2>
      <p className="text-center text-slate-400 mb-8">Please fill out the form below.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <VisitorFormFields formData={formData} />
        <VisitorPhotoUpload value={photo} onChange={setPhoto} />
        <VisitorFormActions onReset={resetForm} />
      </form>
    </motion.div>
  );
};

export default VisitorForm;