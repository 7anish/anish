import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'bot'],
        default: 'user'
    },
    name: {
        type: String,
        required: false
    },
    convKey: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
