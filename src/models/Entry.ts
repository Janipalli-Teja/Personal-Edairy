import mongoose from 'mongoose';

const EntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    blocks: [{
        type: { type: String, enum: ['text', 'image'], default: 'text' },
        content: { type: String, required: true }
    }],
    language: {
        type: String,
        enum: ['en', 'te'],
        default: 'en',
    },
    mood: {
        type: String,
        enum: ['joy', 'peace', 'love', 'reflection', 'neutral'],
        default: 'neutral',
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);
