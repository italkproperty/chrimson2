import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  label: string;
  sublabel?: string;
  onFileSelect: (fileName: string) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, sublabel, onFileSelect, accept = ".pdf,.jpg,.png" }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileSelect(file.name); // In real app, upload blob here
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file.name);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    onFileSelect('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      {sublabel && <p className="text-xs text-slate-500 mb-2">{sublabel}</p>}
      
      <div 
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center
          ${isDragging 
            ? 'border-chrimson-500 bg-chrimson-50' 
            : fileName 
              ? 'border-green-200 bg-green-50' 
              : 'border-slate-200 hover:border-chrimson-300 hover:bg-slate-50'
          }`}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept={accept} 
          className="hidden" 
          onChange={handleChange}
        />
        
        <AnimatePresence mode="wait">
          {fileName ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }}
               className="flex items-center gap-3 text-green-700 font-medium"
             >
               <FileCheck size={24} />
               <span className="truncate max-w-[200px]">{fileName}</span>
               <button onClick={removeFile} className="p-1 hover:bg-green-100 rounded-full text-green-800">
                 <X size={16} />
               </button>
             </motion.div>
          ) : (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="space-y-2"
             >
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-chrimson-600 mx-auto">
                 <UploadCloud size={20} />
               </div>
               <div className="text-xs text-slate-500">
                 <span className="font-semibold text-chrimson-600">Click to upload</span> or drag and drop
               </div>
               <div className="text-[10px] text-slate-400 uppercase tracking-wide">PDF, JPG or PNG (MAX. 5MB)</div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};