import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    uploadIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload',
      },
    ],
    shareId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'generating',
    },
  },
  {
    timestamps: true,
  }
);

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;
