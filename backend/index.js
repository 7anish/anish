import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import readline from "readline";
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
dotenv.config();

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

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_chatbot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

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
   - Tell them you'll notify ${PORTFOLIO_NAME} about their interest

Remember: You are ${PORTFOLIO_NAME}'s professional assistant. Be warm, professional, and helpful!`;

// Function to execute tool calls
async function executeFunctionCall(functionName, args, convKey) {
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

// Check if we should ask for user details
async function shouldAskForDetails(conversation) {
    if (!conversation) return false;
    
    // Ask after 5-6 messages if user seems interested and hasn't been asked yet
    if (conversation.messageCount >= 5 && 
        !conversation.hasAskedForDetails && 
        !conversation.hasNotified) {
        return true;
    }
    
    return false;
}

async function main() {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
    });
    
    const chat = model.startChat({
        history: [],
    });

    // Generate unique conversation key for this session
    const convKey = uuidv4();
    console.log(`📝 Session ID: ${convKey}\n`);

    // Create readline interface for user interaction
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(`🤖 ${PORTFOLIO_NAME}'s AI Portfolio Assistant`);
    console.log(`Ask me anything about ${PORTFOLIO_NAME}'s skills, education, projects, or experience!`);
    console.log("Type 'exit' to quit.\n");

    // Function to handle user input
    const handleUserInput = async (userInput) => {
        if (userInput.toLowerCase() === 'exit') {
            console.log(`\n👋 Thanks for visiting ${PORTFOLIO_NAME}'s portfolio!`);
            rl.close();
            mongoose.connection.close();
            return;
        }

        try {
            // Get current conversation state
            const conversation = await getconversation(convKey);
            
            // Check if we should proactively ask for user details
            if (await shouldAskForDetails(conversation)) {
                console.log(`\n🤖 Assistant: You seem very interested in ${PORTFOLIO_NAME}'s work! I'd love to learn more about you. Could you share your name, phone number, and optionally your email, company, and designation? This will help ${PORTFOLIO_NAME} connect with you better.`);
                
                // Mark as asked
                if (conversation) {
                    conversation.hasAskedForDetails = true;
                    await conversation.save();
                }
            }
            
            // Check if user is providing contact details or wants to connect
            const contactPattern = /name|phone|email|company|contact|connect|reach|hire|collaborate/i;
            const hasContactInfo = userInput.match(/(\+?\d{10,15})/) || userInput.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            
            if ((contactPattern.test(userInput) || hasContactInfo) && conversation && !conversation.hasNotified) {
                // Try to extract contact info
                const nameMatch = userInput.match(/(?:name[:\s]+|i'm|i am|this is)\s*([a-zA-Z][a-zA-Z\s]{2,30})/i);
                const phoneMatch = userInput.match(/(?:phone[:\s]*|call[:\s]*|mobile[:\s]*)?([\+]?[\d]{1,3}[\s-]?[\d]{10,14})/i);
                const emailMatch = userInput.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
                const companyMatch = userInput.match(/(?:company[:\s]+|work at|from)\s*([a-zA-Z][a-zA-Z\s&.,]{2,50})/i);
                const designationMatch = userInput.match(/(?:designation[:\s]+|role[:\s]+|i'm a|i am a)\s*([a-zA-Z][a-zA-Z\s]{2,30})/i);
                
                if (nameMatch && phoneMatch) {
                    const name = nameMatch[1].trim();
                    const phone = phoneMatch[1].trim().replace(/[\s-]/g, '');
                    const email = emailMatch ? emailMatch[1].trim() : '';
                    const company = companyMatch ? companyMatch[1].trim() : '';
                    const designation = designationMatch ? designationMatch[1].trim() : '';
                    
                    const notifyResult = await notify(name, phone, email, company, designation, convKey);
                    console.log(`\n🤖 Assistant: ${notifyResult}`);
                    console.log(`\n✅ Contact information saved to database!`);
                    console.log(`📋 Details: Name: ${name}, Phone: ${phone}${email ? ', Email: ' + email : ''}${company ? ', Company: ' + company : ''}`);
                    
                    // Track this interaction
                    await trackConversation(convKey, userInput, notifyResult);
                    
                    rl.question("\n💬 You: ", handleUserInput);
                    return;
                } else if (hasContactInfo || contactPattern.test(userInput)) {
                    // User wants to connect but hasn't provided complete info
                    console.log(`\n🤖 Assistant: I'd love to help ${PORTFOLIO_NAME} connect with you! Please provide your details in this format:\n\nName: [Your Name]\nPhone: [Your Phone Number]\nEmail: [Your Email] (optional)\nCompany: [Your Company] (optional)\nDesignation: [Your Role] (optional)`);
                    
                    rl.question("\n💬 You: ", handleUserInput);
                    return;
                }
            }
            
            // Generate response from AI
            const result = await chat.sendMessage(userInput);
            const responseText = await result.response.text();
            
            // Check if AI wants to call a tool
            if (responseText.includes('TOOL_CALL:')) {
                const toolCallMatch = responseText.match(/TOOL_CALL:\s*(\w+)(?:\s*\[(.*?)\])?/);
                
                if (toolCallMatch) {
                    const functionName = toolCallMatch[1];
                    const argsString = toolCallMatch[2] || '';                    
                    // Handle SAVE_CONTACT request from AI
                    if (functionName === 'SAVE_CONTACT') {
                        console.log(`\n🤖 Assistant: Great! I'd be happy to notify ${PORTFOLIO_NAME} about your interest. Please share your contact details:\n\nName: [Your Name]\nPhone: [Your Phone Number]\nEmail: [Your Email] (optional)\nCompany: [Your Company] (optional)\nDesignation: [Your Role] (optional)\n\nOr simply type your name and phone number.`);
                        
                        if (conversation) {
                            conversation.hasAskedForDetails = true;
                            await conversation.save();
                        }
                        
                        rl.question("\n💬 You: ", handleUserInput);
                        return;
                    }                    
                    // Parse arguments
                    let args = [];
                    if (argsString) {
                        try {
                            args = JSON.parse(`[${argsString}]`);
                        } catch {
                            args = [argsString.replace(/["']/g, '').trim()];
                        }
                    }
                    
                    console.log(`\n🔧 Calling function: ${functionName}(${args.join(', ')})`);
                    
                    // Execute the function
                    const functionResult = await executeFunctionCall(functionName, args, convKey);
                    
                    if (functionResult) {
                        // Send the result back to the AI to generate a natural response
                        const followUpPrompt = `Based on this data about ${PORTFOLIO_NAME}, provide a natural, conversational response to the user:\n\n${JSON.stringify(functionResult, null, 2)}\n\nRemember to speak naturally and be helpful.`;
                        
                        const followUpResult = await chat.sendMessage(followUpPrompt);
                        const finalResponse = await followUpResult.response.text();
                        
                        console.log(`\n🤖 Assistant: ${finalResponse.trim()}`);
                        
                        // Track conversation
                        await trackConversation(convKey, userInput, finalResponse.trim());
                    } else {
                        console.log(`\n🤖 Assistant: I couldn't retrieve that information. Is there something else you'd like to know about ${PORTFOLIO_NAME}?`);
                    }
                } else {
                    console.log(`\n🤖 Assistant: ${responseText}`);
                    await trackConversation(convKey, userInput, responseText);
                }
            } else {
                // Direct response from AI
                console.log(`\n🤖 Assistant: ${responseText}`);
                await trackConversation(convKey, userInput, responseText);
            }

        } catch (error) {
            console.error("\n❌ Error:", error.message);
        }

        rl.question("\n💬 You: ", handleUserInput);
    };

    // Start the conversation
    rl.question("💬 You: ", handleUserInput);
}

main();
