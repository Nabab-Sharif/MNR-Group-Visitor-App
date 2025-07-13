import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, User, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const VisitorPhotoUpload = ({ value, onChange }) => {
  const [photoPreview, setPhotoPreview] = useState(value || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const openCamera = async () => {
    setIsCameraOpen(true);
  };

  useEffect(() => {
    if (!isCameraOpen) return;
    const startCamera = async () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        alert('Could not access camera');
        setIsCameraOpen(false);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [isCameraOpen, cameraFacing]);

  const closeCamera = () => {
    setIsCameraOpen(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Keep preview in sync with value from parent/form
  useEffect(() => {
    // Only update preview if value changes and is different
    if (value !== photoPreview) {
      setPhotoPreview(value || null);
    }
    // eslint-disable-next-line
  }, [value]);

  // Set photo and notify parent (form)
  const setPhoto = (val) => {
    setPhotoPreview(val);
    if (typeof onChange === "function") {
      console.log("Photo set and sent to parent:", val); // Debug log
      onChange(val === undefined ? null : val);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Use higher resolution for better quality
      const scale = 3; // 3x for higher quality
      const width = video.videoWidth * scale;
      const height = video.videoHeight * scale;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);
      // Use PNG for lossless quality
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setPhoto(dataUrl);
      closeCamera();
      setTimeout(() => {
        console.log("PhotoPreview after capture:", photoPreview);
      }, 100);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result); // always use setPhoto
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center text-slate-300 font-semibold">
        <Camera className="mr-2 h-4 w-4 text-pink-400" /> Visitor's Photo
      </Label>
      
      <div className="flex items-center space-x-4">
        {/* Open Camera Button */}
        <Button
          type="button"
          variant="outline"
          className="bg-sky-500 hover:bg-sky-600 text-white border-sky-500"
          onClick={openCamera}
        >
          <Camera className="mr-2 h-4 w-4" /> Open Camera
        </Button>
        {/* Camera Dialog */}
        <Dialog open={isCameraOpen} onOpenChange={(open) => { if (!open) closeCamera(); }}>
          <DialogContent className="sm:max-w-[625px] bg-slate-800 border-slate-700 text-slate-50">
            <DialogHeader>
              {/* For accessibility, always render DialogTitle (can be visually hidden if needed) */}
              <DialogTitle>
                <span className="text-purple-400">Capture Photo</span>
              </DialogTitle>
              <DialogDescription>
                <span className="text-slate-400">
                  Look at the camera and press 'Spacebar' or click the 'Capture' button below.
                </span>
              </DialogDescription>
            </DialogHeader>
            {/* Camera Facing Switch */}
            <div className="flex justify-center mb-4">
              <button
                type="button"
                className={`px-3 py-1 rounded-l bg-slate-700 text-slate-200 ${cameraFacing === 'user' ? 'bg-purple-600' : ''}`}
                onClick={() => setCameraFacing('user')}
                disabled={cameraFacing === 'user'}
              >
                Front Camera
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-r bg-slate-700 text-slate-200 ${cameraFacing === 'environment' ? 'bg-purple-600' : ''}`}
                onClick={() => setCameraFacing('environment')}
                disabled={cameraFacing === 'environment'}
              >
                Back Camera
              </button>
            </div>
            {isCameraOpen && (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border border-slate-600"></video>
                <canvas ref={canvasRef} className="hidden" width="640" height="480"></canvas>
              </div>
            )}
            <DialogFooter>
              <Button type="button" onClick={capturePhoto} className="bg-green-500 hover:bg-green-600 text-white">
                <Camera className="mr-2 h-4 w-4" /> Capture
              </Button>
              <Button type="button" variant="secondary" onClick={closeCamera}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Upload from File */}
        <Label htmlFor="photo-upload" className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-md inline-flex items-center transition-colors">
          <User className="mr-2 h-4 w-4" /> Upload from File
        </Label>
        <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      </div>
      {photoPreview && (
        <div className="mt-4 relative group w-40 h-40 rounded-lg overflow-hidden border-2 border-purple-500 shadow-lg">
          <img
            src={photoPreview}
            alt="Visitor's photo preview"
            className="w-full h-full object-cover"
            style={{
              imageRendering: 'auto',
              filter: 'contrast(1.1) brightness(1.1)',
              objectPosition: 'center',
              borderRadius: '0.75rem',
            }}
            loading="lazy"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600/80 hover:bg-red-600"
            onClick={() => { setPhoto(null); }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisitorPhotoUpload;