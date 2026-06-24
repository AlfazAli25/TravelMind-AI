import cloudinary from '../config/cloudinary.js';
import Upload from '../models/Upload.js';
import { extractFromFile, mergeExtractedData } from './extractionService.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Upload a file to Cloudinary and create an Upload record
 */
const uploadToCloudinary = (fileBuffer, fileName, mimeType) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimeType === 'application/pdf' ? 'raw' : 'image';

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'travelmind',
        resource_type: resourceType,
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Process multiple uploaded files:
 * 1. Upload each to Cloudinary
 * 2. Extract data from each
 * 3. Merge extracted data
 * 4. Return merged result with upload records
 */
export const processUploads = async (files, userId) => {
  if (!files || files.length === 0) {
    throw ApiError.badRequest('No files provided');
  }

  const uploadRecords = [];
  const extractedDatasets = [];

  for (const file of files) {
    // Create upload record
    const upload = await Upload.create({
      userId,
      fileName: file.originalname,
      fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
      mimeType: file.mimetype,
      fileUrl: '',
      status: 'uploading',
    });

    try {
      // Upload to Cloudinary
      const cloudResult = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        file.mimetype
      );

      upload.fileUrl = cloudResult.secure_url;
      upload.cloudinaryId = cloudResult.public_id;
      upload.status = 'extracting';
      await upload.save();

      // Extract data
      const { rawText, structured, method } = await extractFromFile(
        file.buffer,
        file.mimetype,
        file.originalname
      );

      upload.rawText = rawText;
      upload.extractedData = structured;
      upload.status = 'extracted';
      await upload.save();

      extractedDatasets.push(structured);
      uploadRecords.push(upload);
    } catch (error) {
      upload.status = 'failed';
      upload.errorMessage = error.message;
      await upload.save();
      uploadRecords.push(upload);
    }
  }

  // Merge all extracted data into one unified dataset
  const mergedData = mergeExtractedData(extractedDatasets);

  return {
    uploads: uploadRecords,
    extractedData: mergedData,
  };
};
