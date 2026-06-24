import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['pdf', 'image'],
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    cloudinaryId: {
      type: String,
    },
    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    rawText: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['uploading', 'uploaded', 'extracting', 'extracted', 'failed'],
      default: 'uploading',
    },
    errorMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload;
