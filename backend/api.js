import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenerativeAI } from "@google/generative-ai";

import { 
    getintroduction, 
    geteducations, 
    getskills, 
    getallprojects, 
    getspecificproject,
    getprojectsbyskill,
    getexperiences, 
    getextracurricularactivities, 
    getsociallinks,
    notify,
    trackConversation,
    getconversation,
    updateusername
} from "./tools/tools.js";

import Notification from './model/notification.model.js';
import Conversation from './model/conversation.model.js';
import Message from './model/message.model.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_chatbot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const PORTFOLIO_NAME = process.env.PORTFOLIO_NAME || 'Anish';

const SYSTEM_PROMPT = `You are an AI assistant for ${PORTFOLIO_NAME}'s portfolio. Your role is to help visitors learn about ${PORTFOLIO_NAME}'s professional background, skills, projects, and experiences.

CRITICAL RULES:
1. **Never assume information**: Only provide information that is explicitly available through the tools. If you don't have the information, clearly state: "I don't have that information about ${PORTFOLIO_NAME}, but I can connect you with him. Please provide your name, phone number, and optionally email, company, and designation."

2. **Be conversational and helpful**: Respond naturally in plain text to users. Keep responses concise and friendly.

3. **Available Tools** - When you need information, tell me which tool to call:
   - getintroduction - Get ${PORTFOLIO_NAME}'s introduction
   - geteducations - Get education details
   - getskills - Get skills list
   - getallprojects - Get all projects with short descriptions
   - getspecificproject [projectTitle] - Get detailed information about a specific project
   - getprojectsbyskill [skillName] - Get projects that use a specific skill
   - getexperiences - Get work experience details
   - getextracurricularactivities - Get extracurricular activities
   - getsociallinks - Get social media links
   - SAVE_CONTACT - Tell me when user wants to share contact details for notification

4. **When you need to call a tool**, respond in this exact format:
   TOOL_CALL: function_name [argument1, argument2]
   
   Examples:
   - TOOL_CALL: getintroduction
   - TOOL_CALL: getspecificproject ["Portfolio Website"]
   - TOOL_CALL: getprojectsbyskill ["javascript"]
   - TOOL_CALL: SAVE_CONTACT

5. **Project queries**: 
   - When user asks about projects, first show the list using getallprojects
   - If they want details about a specific project, use getspecificproject
   - If they ask about projects with a specific skill, use getprojectsbyskill

6. **User engagement**: 
   - Be proactive in helping users explore ${PORTFOLIO_NAME}'s portfolio
   - Suggest related information they might be interested in

7. **Contact requests**: 
   - When users want to connect with ${PORTFOLIO_NAME} or seem interested, use TOOL_CALL: SAVE_CONTACT
   - When user provides contact details (name, phone, email, etc.), immediately use TOOL_CALL: SAVE_CONTACT

Remember: You are ${PORTFOLIO_NAME}'s professional assistant. Be warm, professional, and helpful!`;

// Store active chat sessions
const chatSessions = new Map();

// Helper function to get or create chat session
function getChatSession(convKey) {
    if (!chatSessions.has(convKey)) {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: SYSTEM_PROMPT,
        });
        
        const chat = model.startChat({
            history: [],
        });
        
        chatSessions.set(convKey, chat);
    }
    
    return chatSessions.get(convKey);
}

// Helper function to execute tool calls
async function executeFunctionCall(functionName, args) {
    const availableFunctions = {
        getintroduction,
        geteducations,
        getskills,
        getallprojects,
        getspecificproject,
        getprojectsbyskill,
        getexperiences,
        getextracurricularactivities,
        getsociallinks
    };
    
    if (availableFunctions[functionName]) {
        return await availableFunctions[functionName](...args);
    }
    return null;
}

// Helper function to extract contact info
function extractContactInfo(text) {
    const nameMatch = text.match(/(?:name[:\s]+|i'm|i am|this is)\s*([a-zA-Z][a-zA-Z\s]{2,30})/i);
    const phoneMatch = text.match(/(?:phone[:\s]*|call[:\s]*|mobile[:\s]*)?([\\+]?[\d]{1,3}[\s-]?[\d]{10,14})/i);
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const companyMatch = text.match(/(?:company[:\s]+|work at|from)\s*([a-zA-Z][a-zA-Z\s&.,]{2,50})/i);
    const designationMatch = text.match(/(?:designation[:\s]+|role[:\s]+|i'm a|i am a)\s*([a-zA-Z][a-zA-Z\s]{2,30})/i);
    
    return {
        name: nameMatch ? nameMatch[1].trim() : null,
        phone: phoneMatch ? phoneMatch[1].trim().replace(/[\s-]/g, '') : null,
        email: emailMatch ? emailMatch[1].trim() : '',
        company: companyMatch ? companyMatch[1].trim() : '',
        designation: designationMatch ? designationMatch[1].trim() : ''
    };
}

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Portfolio Chatbot API is running',
        portfolioName: PORTFOLIO_NAME,
        timestamp: new Date().toISOString()
    });
});

// Get portfolio introduction
app.get('/api/portfolio/introduction', (req, res) => {
    try {
        const intro = getintroduction();
        res.json({ success: true, data: intro });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all portfolio data
app.get('/api/portfolio', (req, res) => {
    try {
        const data = {
            introduction: getintroduction(),
            educations: geteducations(),
            skills: getskills(),
            projects: getallprojects(),
            experiences: getexperiences(),
            extracurricularActivities: getextracurricularactivities(),
            socialLinks: getsociallinks()
        };
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Chat endpoint - Main conversation API
app.post('/api/chat', async (req, res) => {
    try {
        const { message, convKey } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Message is required' 
            });
        }
        
        // Generate or use provided conversation key
        const sessionKey = convKey || uuidv4();
        
        // Get conversation state
        let conversation = await getconversation(sessionKey);
        
        // Check if we should ask for user details
        const shouldAskForDetails = conversation && 
                                   conversation.messageCount >= 5 && 
                                   !conversation.hasAskedForDetails && 
                                   !conversation.hasNotified;
        
        if (shouldAskForDetails) {
            conversation.hasAskedForDetails = true;
            await conversation.save();
        }
        
        // Check for contact information
        const contactPattern = /name|phone|email|company|contact|connect|reach|hire|collaborate/i;
        const hasContactInfo = message.match(/(\+?\d{10,15})/) || 
                              message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        
        if ((contactPattern.test(message) || hasContactInfo) && conversation && !conversation.hasNotified) {
            const contactInfo = extractContactInfo(message);
            
            if (contactInfo.name && contactInfo.phone) {
                const notifyResult = await notify(
                    contactInfo.name, 
                    contactInfo.phone, 
                    contactInfo.email, 
                    contactInfo.company, 
                    contactInfo.designation, 
                    sessionKey
                );
                
                await trackConversation(sessionKey, message, notifyResult);
                
                return res.json({
                    success: true,
                    data: {
                        message: notifyResult,
                        convKey: sessionKey,
                        contactSaved: true,
                        contactInfo: {
                            name: contactInfo.name,
                            phone: contactInfo.phone,
                            email: contactInfo.email,
                            company: contactInfo.company
                        }
                    }
                });
            } else if (hasContactInfo || contactPattern.test(message)) {
                const askForDetailsMsg = `I'd love to help ${PORTFOLIO_NAME} connect with you! Please provide your details:\n\nName: [Your Name]\nPhone: [Your Phone Number]\nEmail: [Your Email] (optional)\nCompany: [Your Company] (optional)\nDesignation: [Your Role] (optional)`;
                
                await trackConversation(sessionKey, message, askForDetailsMsg);
                
                return res.json({
                    success: true,
                    data: {
                        message: askForDetailsMsg,
                        convKey: sessionKey,
                        needsContactInfo: true
                    }
                });
            }
        }
        
        // Get chat session
        const chat = getChatSession(sessionKey);
        
        // Generate AI response
        const result = await chat.sendMessage(message);
        const responseText = await result.response.text();
        
        let finalResponse = responseText;
        let toolResult = null;
        
        // Check if AI wants to call a tool
        if (responseText.includes('TOOL_CALL:')) {
            const toolCallMatch = responseText.match(/TOOL_CALL:\s*(\w+)(?:\s*\[(.*?)\])?/);
            
            if (toolCallMatch) {
                const functionName = toolCallMatch[1];
                const argsString = toolCallMatch[2] || '';
                
                // Handle SAVE_CONTACT request
                if (functionName === 'SAVE_CONTACT') {
                    if (conversation) {
                        conversation.hasAskedForDetails = true;
                        await conversation.save();
                    }
                    
                    finalResponse = `Great! I'd be happy to notify ${PORTFOLIO_NAME} about your interest. Please share your contact details:\n\nName: [Your Name]\nPhone: [Your Phone Number]\nEmail: [Your Email] (optional)\nCompany: [Your Company] (optional)\nDesignation: [Your Role] (optional)\n\nOr simply share your name and phone number.`;
                } else {
                    // Parse arguments
                    let args = [];
                    if (argsString) {
                        try {
                            args = JSON.parse(`[${argsString}]`);
                        } catch {
                            args = [argsString.replace(/["']/g, '').trim()];
                        }
                    }
                    
                    // Execute the function
                    toolResult = await executeFunctionCall(functionName, args);
                    
                    if (toolResult) {
                        // Generate natural response from tool result
                        const followUpPrompt = `Based on this data about ${PORTFOLIO_NAME}, provide a natural, conversational response to the user:\n\n${JSON.stringify(toolResult, null, 2)}\n\nRemember to speak naturally and be helpful.`;
                        
                        const followUpResult = await chat.sendMessage(followUpPrompt);
                        finalResponse = await followUpResult.response.text();
                    } else {
                        finalResponse = `I couldn't retrieve that information. Is there something else you'd like to know about ${PORTFOLIO_NAME}?`;
                    }
                }
            }
        }
        
        // Track conversation
        await trackConversation(sessionKey, message, finalResponse);
        
        // Get updated conversation state
        conversation = await getconversation(sessionKey);
        
        res.json({
            success: true,
            data: {
                message: finalResponse,
                convKey: sessionKey,
                messageCount: conversation ? conversation.messageCount : 1,
                toolUsed: toolResult ? true : false,
                shouldAskForDetails: conversation && conversation.messageCount >= 5 && !conversation.hasNotified
            }
        });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get all conversations
app.get('/api/conversations', async (req, res) => {
    try {
        const { limit = 50, skip = 0 } = req.query;
        
        const conversations = await Conversation.find()
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
        
        const total = await Conversation.countDocuments();
        
        res.json({
            success: true,
            data: {
                conversations,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    hasMore: skip + conversations.length < total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific conversation with messages
app.get('/api/conversations/:convKey', async (req, res) => {
    try {
        const { convKey } = req.params;
        
        const conversation = await Conversation.findOne({ convKey });
        
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                error: 'Conversation not found' 
            });
        }
        
        const messages = await Message.find({ convKey }).sort({ createdAt: 1 });
        
        res.json({
            success: true,
            data: {
                conversation,
                messages
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete conversation
app.delete('/api/conversations/:convKey', async (req, res) => {
    try {
        const { convKey } = req.params;
        
        await Conversation.deleteOne({ convKey });
        await Message.deleteMany({ convKey });
        
        // Remove from active sessions
        chatSessions.delete(convKey);
        
        res.json({
            success: true,
            message: 'Conversation deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all notifications
app.get('/api/notifications', async (req, res) => {
    try {
        const { isContacted, limit = 100, skip = 0 } = req.query;
        
        const filter = {};
        if (isContacted !== undefined) {
            filter.isContacted = isContacted === 'true';
        }
        
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));
        
        const total = await Notification.countDocuments(filter);
        
        res.json({
            success: true,
            data: {
                notifications,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    hasMore: skip + notifications.length < total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific notification
app.get('/api/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ 
                success: false, 
                error: 'Notification not found' 
            });
        }
        
        res.json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update notification (mark as contacted)
app.put('/api/notifications/:id', async (req, res) => {
    try {
        const { isContacted } = req.body;
        
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isContacted },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ 
                success: false, 
                error: 'Notification not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: notification,
            message: 'Notification updated successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete notification
app.delete('/api/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ 
                success: false, 
                error: 'Notification not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Notification deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get GitHub recent activities
app.get('/api/github/activities', async (req, res) => {
    try {
        const githubUsername = process.env.GITHUB_USERNAME || '7anish';
        const response = await fetch(`https://api.github.com/users/${githubUsername}/events`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub activities');
        }
        
        const data = await response.json();
        
        // Filter for PushEvent and extract repo names
        const pushEvents = data
            .filter(event => event.type === 'PushEvent')
            .slice(0, 10) // Get more to filter duplicates
            .map(event => ({
                id: event.id,
                repoName: event.repo.name.split('/')[1],
                repoFullName: event.repo.name,
                repoUrl: `https://github.com/${event.repo.name}`,
                createdAt: event.created_at,
                activityType: 'Gihub'
            }));
        
        // Remove duplicates by repo name
        const uniqueRepos = pushEvents.filter((event, index, self) =>
            index === self.findIndex((e) => e.repoName === event.repoName)
        );
        
        res.json({
            success: true,
            data: uniqueRepos.slice(0, 5)
        });
    } catch (error) {
        console.error('Error fetching GitHub activities:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            data: [] // Return empty array as fallback
        });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const totalConversations = await Conversation.countDocuments();
        const notifiedConversations = await Conversation.countDocuments({ hasNotified: true });
        const totalMessages = await Message.countDocuments();
        const totalNotifications = await Notification.countDocuments();
        const uncontactedNotifications = await Notification.countDocuments({ isContacted: false });
        
        // Get recent activity
        const recentConversations = await Conversation.find()
            .sort({ updatedAt: -1 })
            .limit(5)
            .select('convKey userName messageCount hasNotified updatedAt');
        
        const recentNotifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name phone email company createdAt isContacted');
        
        res.json({
            success: true,
            data: {
                stats: {
                    totalConversations,
                    notifiedConversations,
                    totalMessages,
                    totalNotifications,
                    uncontactedNotifications,
                    averageMessagesPerConversation: totalConversations > 0 
                        ? (totalMessages / totalConversations).toFixed(2) 
                        : 0
                },
                recentActivity: {
                    recentConversations,
                    recentNotifications
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio Chatbot API Server`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`👤 Portfolio: ${PORTFOLIO_NAME}`);
    console.log(`\n📚 API Endpoints:`);
    console.log(`   GET  /api/health                    - Health check`);
    console.log(`   GET  /api/portfolio                 - Get all portfolio data`);
    console.log(`   POST /api/chat                      - Send message and get response`);
    console.log(`   GET  /api/conversations             - Get all conversations`);
    console.log(`   GET  /api/conversations/:convKey    - Get specific conversation`);
    console.log(`   DELETE /api/conversations/:convKey  - Delete conversation`);
    console.log(`   GET  /api/notifications             - Get all notifications`);
    console.log(`   GET  /api/notifications/:id         - Get specific notification`);
    console.log(`   PUT  /api/notifications/:id         - Update notification`);
    console.log(`   DELETE /api/notifications/:id       - Delete notification`);
    console.log(`   GET  /api/stats                     - Get statistics`);
    console.log(`   GET  /api/github/activities         - Get GitHub activities`);
    console.log(`\n✨ Ready to accept requests!\n`);
});

export default app;
