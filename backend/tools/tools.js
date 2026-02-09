import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Notification from '../model/notification.model.js';
import Conversation from '../model/conversation.model.js';
import Message from '../model/message.model.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load data from JSON file
const dataPath = path.join(__dirname, '../data/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Get introduction
export const getintroduction = () => {
    return data.introduction;
};

// Get educations - returns array of education objects
export const geteducations = () => {
    return data.educations;
};

// Get skills - returns array of skill objects
export const getskills = () => {
    return data.skills;
};

// Get all projects - returns array with title, shortDesc, and skills only
export const getallprojects = () => {
    return data.projects.map(project => ({
        title: project.title,
        shortDesc: project.shortDesc,
        skills: project.skills
    }));
};

// Get specific project by title
export const getspecificproject = (projectTitle) => {
    if (!projectTitle) {
        return "Please provide a project title";
    }
    
    const project = data.projects.find(
        p => p.title.toLowerCase() === projectTitle.toLowerCase()
    );
    
    if (!project) {
        return `Project "${projectTitle}" not found. Please check the project name and try again.`;
    }
    
    return project;
};

// Get projects by skill name
export const getprojectsbyskill = (skillName) => {
    if (!skillName) {
        return "Please provide a skill name";
    }
    
    const matchingProjects = data.projects.filter(project => 
        project.skills.some(skill => 
            skill.key.toLowerCase() === skillName.toLowerCase() ||
            skill.label.toLowerCase() === skillName.toLowerCase()
        )
    );
    
    if (matchingProjects.length === 0) {
        return `No projects found using "${skillName}". Please check the skill name and try again.`;
    }
    
    return matchingProjects;
};

// Get experiences
export const getexperiences = () => {
    return data.experiences;
};

// Get extracurricular activities
export const getextracurricularactivities = () => {
    return data.extracurricularActivities;
};

// Get social links
export const getsociallinks = () => {
    return data.socialLinks;
};

// Notify function - saves user inquiry to database
export const notify = async (name, phone, email = '', company = '', designation = '', convKey) => {
    try {
        // Check if already notified for this conversation
        const conversation = await Conversation.findOne({ convKey });
        
        if (conversation && conversation.hasNotified) {
            return `I've already notified ${process.env.PORTFOLIO_NAME || 'Anish'} with your details. Please wait for a response!`;
        }
        
        // Validate required fields
        if (!name || !phone) {
            return "Please provide at least your name and phone number.";
        }
        
        // Create notification
        const notification = new Notification({
            name,
            email,
            phone,
            company,
            designation,
            convKey
        });
        
        await notification.save();
        
        // Update conversation to mark as notified
        if (conversation) {
            conversation.hasNotified = true;
            await conversation.save();
        }
        
        return `Thank you ${name}! I've notified ${process.env.PORTFOLIO_NAME || 'Anish'} about your interest. He will reach out to you soon at ${phone}${email ? ' or ' + email : ''}.`;
        
    } catch (error) {
        console.error('Error saving notification:', error);
        return "There was an error processing your request. Please try again.";
    }
};

// Track conversation and message count
export const trackConversation = async (convKey, userMessage, botResponse) => {
    try {
        // Save user message
        const userMsg = new Message({
            message: userMessage,
            role: 'user',
            convKey
        });
        await userMsg.save();
        
        // Save bot response
        const botMsg = new Message({
            message: botResponse,
            role: 'bot',
            convKey
        });
        await botMsg.save();
        
        // Update or create conversation
        let conversation = await Conversation.findOne({ convKey });
        
        if (!conversation) {
            conversation = new Conversation({
                convKey,
                messageCount: 1
            });
        } else {
            conversation.messageCount += 1;
        }
        
        await conversation.save();
        
        return conversation;
        
    } catch (error) {
        console.error('Error tracking conversation:', error);
        return null;
    }
};

// Get conversation details
export const getconversation = async (convKey) => {
    try {
        const conversation = await Conversation.findOne({ convKey });
        return conversation;
    } catch (error) {
        console.error('Error getting conversation:', error);
        return null;
    }
};

// Update user name in conversation
export const updateusername = async (convKey, userName) => {
    try {
        const conversation = await Conversation.findOne({ convKey });
        
        if (conversation) {
            conversation.userName = userName;
            await conversation.save();
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error updating user name:', error);
        return false;
    }
};

