import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    convKey: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        default: null
    },
    messageCount: {
        type: Number,
        default: 0
    },
    hasNotified: {
        type: Boolean,
        default: false
    },
    hasAskedForDetails: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
