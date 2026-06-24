import pdfParse from 'pdf-parse';
import sharp from 'sharp';
import * as geminiService from './geminiService.js';

/**
 * Detect if a PDF is text-based or scanned (image-based)
 * by attempting text extraction and checking content length
 */
const isTextBasedPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    const text = data.text.trim();
    // If we got meaningful text (more than a few chars), it's text-based
    return text.length > 50;
  } catch {
    return false;
  }
};

/**
 * Extract text from a text-based PDF using pdf-parse
 */
const extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

/**
 * Convert PDF buffer to images for Gemini Vision processing.
 * Uses sharp to convert each page — for simplicity, we convert
 * the entire PDF buffer as a single image if no page-splitting
 * library is available, or we send the PDF to Gemini directly
 * as it supports PDF input.
 */
const convertPDFToImages = async (buffer) => {
  // Gemini 2.0 Flash supports PDF input directly,
  // so we can send the PDF buffer as a document
  return [{ buffer, mimeType: 'application/pdf' }];
};

/**
 * Main extraction pipeline — handles both PDFs and images
 */
export const extractFromFile = async (fileBuffer, mimeType, fileName) => {
  const isPDF = mimeType === 'application/pdf';
  const isImage = mimeType.startsWith('image/');

  if (isPDF) {
    return extractFromPDF(fileBuffer);
  } else if (isImage) {
    return extractFromImageFile(fileBuffer, mimeType);
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
};

/**
 * PDF extraction — auto-detects text vs scanned
 */
const extractFromPDF = async (buffer) => {
  const isText = await isTextBasedPDF(buffer);

  if (isText) {
    // Text-based PDF → pdf-parse → Gemini structured extraction
    const rawText = await extractTextFromPDF(buffer);
    const structured = await geminiService.extractStructuredData(rawText);
    return { rawText, structured, method: 'text-pdf' };
  } else {
    // Scanned PDF → Gemini Vision (supports PDF directly)
    const structured = await geminiService.extractFromScannedPDF([
      { buffer, mimeType: 'application/pdf' },
    ]);
    return { rawText: '', structured, method: 'scanned-pdf' };
  }
};

/**
 * Image extraction → Gemini Vision
 */
const extractFromImageFile = async (buffer, mimeType) => {
  const structured = await geminiService.extractFromImage(buffer, mimeType);
  return { rawText: '', structured, method: 'image-vision' };
};

/**
 * Merge multiple extracted datasets into one consolidated dataset
 */
export const mergeExtractedData = (datasets) => {
  const merged = {
    destination: '',
    startDate: '',
    endDate: '',
    flights: [],
    hotels: [],
    trains: [],
    buses: [],
    bookings: [],
  };

  for (const data of datasets) {
    if (data.destination && !merged.destination) {
      merged.destination = data.destination;
    }

    if (data.startDate) {
      if (!merged.startDate || data.startDate < merged.startDate) {
        merged.startDate = data.startDate;
      }
    }

    if (data.endDate) {
      if (!merged.endDate || data.endDate > merged.endDate) {
        merged.endDate = data.endDate;
      }
    }

    if (data.flights?.length) merged.flights.push(...data.flights);
    if (data.hotels?.length) merged.hotels.push(...data.hotels);
    if (data.trains?.length) merged.trains.push(...data.trains);
    if (data.buses?.length) merged.buses.push(...data.buses);
    if (data.bookings?.length) merged.bookings.push(...data.bookings);
  }

  return merged;
};
