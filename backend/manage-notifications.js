import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from './model/notification.model.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_chatbot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB\n');
    markAsContacted();
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

async function markAsContacted() {
    try {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Get all uncontacted notifications
        const notifications = await Notification.find({ isContacted: false }).sort({ createdAt: -1 });
        
        if (notifications.length === 0) {
            console.log('📭 No uncontacted notifications found.\n');
            mongoose.connection.close();
            process.exit(0);
            return;
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('         UNCONTACTED NOTIFICATIONS                      ');
        console.log('═══════════════════════════════════════════════════════\n');

        notifications.forEach((notif, index) => {
            console.log(`${index + 1}. ${notif.name} - ${notif.phone} (${notif.createdAt.toLocaleDateString()})`);
        });

        console.log('\n─────────────────────────────────────────────────────');
        
        readline.question('\nEnter notification number to mark as contacted (or "all" for all, "exit" to quit): ', async (answer) => {
            if (answer.toLowerCase() === 'exit') {
                console.log('👋 Exiting...');
                readline.close();
                mongoose.connection.close();
                process.exit(0);
                return;
            }

            if (answer.toLowerCase() === 'all') {
                await Notification.updateMany({ isContacted: false }, { isContacted: true });
                console.log('✅ All notifications marked as contacted!');
            } else {
                const index = parseInt(answer) - 1;
                if (index >= 0 && index < notifications.length) {
                    notifications[index].isContacted = true;
                    await notifications[index].save();
                    console.log(`✅ Marked ${notifications[index].name} as contacted!`);
                } else {
                    console.log('❌ Invalid selection.');
                }
            }

            readline.close();
            mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}
