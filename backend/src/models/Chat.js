import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itineraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Itinerary',
      required: true,
      index: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient lookup
chatSchema.index({ userId: 1, itineraryId: 1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
