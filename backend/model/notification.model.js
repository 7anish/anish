import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    },
    designation: {
        type: String,
        required: false
    },
    convKey: {
        type: String,
        required: true
    },
    isContacted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
