import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './model/notification.model.js';
import Conversation from './model/conversation.model.js';
import Message from './model/message.model.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_chatbot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB\n');
    viewNotifications();
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

async function viewNotifications() {
    try {
        console.log('═══════════════════════════════════════════════════════');
        console.log('           PORTFOLIO CHATBOT - NOTIFICATIONS           ');
        console.log('═══════════════════════════════════════════════════════\n');

        // Get all notifications
        const notifications = await Notification.find().sort({ createdAt: -1 });
        
        if (notifications.length === 0) {
            console.log('📭 No notifications found in the database.\n');
        } else {
            console.log(`📬 Total Notifications: ${notifications.length}\n`);
            
            notifications.forEach((notif, index) => {
                console.log(`─────────────────── Notification #${index + 1} ───────────────────`);
                console.log(`👤 Name:        ${notif.name}`);
                console.log(`📞 Phone:       ${notif.phone}`);
                console.log(`📧 Email:       ${notif.email || 'Not provided'}`);
                console.log(`🏢 Company:     ${notif.company || 'Not provided'}`);
                console.log(`💼 Designation: ${notif.designation || 'Not provided'}`);
                console.log(`🔑 Session ID:  ${notif.convKey}`);
                console.log(`📅 Date:        ${notif.createdAt.toLocaleString()}`);
                console.log(`✅ Contacted:   ${notif.isContacted ? 'Yes' : 'No'}`);
                console.log('');
            });
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('                CONVERSATION STATISTICS                 ');
        console.log('═══════════════════════════════════════════════════════\n');

        // Get conversation stats
        const totalConversations = await Conversation.countDocuments();
        const notifiedConversations = await Conversation.countDocuments({ hasNotified: true });
        const totalMessages = await Message.countDocuments();

        console.log(`💬 Total Conversations:     ${totalConversations}`);
        console.log(`✅ Notified Conversations:  ${notifiedConversations}`);
        console.log(`📨 Total Messages:          ${totalMessages}`);
        console.log('');

        // Get recent conversations
        const recentConvs = await Conversation.find().sort({ updatedAt: -1 }).limit(5);
        
        if (recentConvs.length > 0) {
            console.log('─────────────── Recent Conversations ───────────────');
            recentConvs.forEach((conv, index) => {
                console.log(`${index + 1}. Session: ${conv.convKey.substring(0, 8)}...`);
                console.log(`   User: ${conv.userName || 'Anonymous'}`);
                console.log(`   Messages: ${conv.messageCount}`);
                console.log(`   Notified: ${conv.hasNotified ? 'Yes ✅' : 'No'}`);
                console.log(`   Last Activity: ${conv.updatedAt.toLocaleString()}`);
                console.log('');
            });
        }

        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error fetching notifications:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}
