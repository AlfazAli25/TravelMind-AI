import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadAPI } from '../api';
import toast from 'react-hot-toast';
import {
  HiOutlineCloudUpload,
  HiOutlineDocument,
  HiOutlinePhotograph,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineSparkles,
  HiOutlineSave,
} from 'react-icons/hi';

const STEPS = [
  { id: 'uploading', label: 'Uploading Files', icon: HiOutlineCloudUpload },
  { id: 'extracting', label: 'Extracting Data', icon: HiOutlineDocument },
  { id: 'complete', label: 'Processing Complete', icon: HiOutlineSparkles },
];

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return '📄';
    return '🖼️';
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please add at least one file');
      return;
    }

    setProcessing(true);
    setCurrentStep(0);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      setCurrentStep(0);
      const response = await uploadAPI.uploadFiles(formData, (progress) => {
        setUploadProgress(progress);
        if (progress === 100) setCurrentStep(1);
      });

      setCurrentStep(2);
      setResult(response.data);
      toast.success('Files processed successfully!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
      setProcessing(false);
      setCurrentStep(-1);
    }
  };

  const handleProceedToReview = () => {
    navigate('/review', {
      state: {
        extractedData: result.extractedData,
        uploadIds: result.uploads.map((u) => u._id),
      },
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2">Upload Documents</h1>
          <p className="text-dark-400 mb-8">
            Upload your travel tickets, bookings, and confirmations. We'll extract all the details automatically.
          </p>
        </motion.div>

        {!processing ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`glass-card border-2 border-dashed cursor-pointer text-center py-16 transition-all duration-300 ${
                isDragActive
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-600 hover:border-primary-500/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4">
                <HiOutlineCloudUpload className="w-8 h-8 text-primary-400" />
              </div>
              {isDragActive ? (
                <p className="text-primary-400 font-semibold text-lg">Drop files here...</p>
              ) : (
                <>
                  <p className="text-white font-semibold text-lg mb-1">Drag & drop your files here</p>
                  <p className="text-dark-400 text-sm">or click to browse</p>
                  <p className="text-dark-500 text-xs mt-3">Supports PDF, PNG, JPG, JPEG, WEBP · Max 10MB each</p>
                </>
              )}
            </div>

            {/* File list */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="glass-card !p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getFileIcon(file)}</span>
                        <div>
                          <p className="text-white text-sm font-medium truncate max-w-[200px] sm:max-w-none">
                            {file.name}
                          </p>
                          <p className="text-dark-500 text-xs">{formatSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="btn-ghost !p-1.5 text-dark-400 hover:text-red-400"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}

                  <button
                    onClick={handleUpload}
                    className="btn-primary w-full mt-4"
                  >
                    <HiOutlineSparkles className="w-5 h-5" />
                    Process {files.length} {files.length === 1 ? 'File' : 'Files'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Processing Steps */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <h2 className="text-xl font-display font-semibold text-white mb-6">
              Processing Your Documents
            </h2>

            <div className="space-y-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isDone = index < currentStep || (index === 2 && currentStep === 2);
                const isPending = index > currentStep;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : isActive
                        ? 'border-primary-500/50 bg-primary-500/10'
                        : 'border-dark-700 bg-dark-800/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-500'
                        : isActive
                        ? 'bg-primary-500 animate-pulse'
                        : 'bg-dark-700'
                    }`}>
                      {isDone ? (
                        <HiOutlineCheck className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-dark-500'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-dark-500'}`}>
                        {step.label}
                      </p>
                      {isActive && index === 0 && (
                        <div className="mt-2 w-full bg-dark-700 rounded-full h-1.5">
                          <motion.div
                            className="bg-primary-500 h-1.5 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      )}
                      {isActive && index === 1 && (
                        <p className="text-dark-400 text-sm mt-1 animate-pulse">
                          AI is analyzing your documents...
                        </p>
                      )}
                    </div>
                    {isDone && (
                      <span className="text-emerald-400 text-sm font-medium">✓ Complete</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-6 border-t border-dark-700"
              >
                <p className="text-emerald-400 font-semibold mb-4">
                  ✨ {result.uploads?.length || 0} file(s) processed successfully!
                </p>
                <button onClick={handleProceedToReview} className="btn-primary w-full">
                  Review Extracted Data
                  <HiOutlineSparkles className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
