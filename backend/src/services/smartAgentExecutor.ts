import Execution from '../models/Execution';
import Agent from '../models/Agent';
import { GoogleGenerativeAI } from '@google/generative-ai';
// FIX 1: Moved imports to the top level
import { sendEmail } from "../integrations/emailService";
import { readSheet } from "../integrations/googleSheets";

export async function executeSmartAgent(agentId: string, userId: string) {
  const agent = await Agent.findById(agentId);
  if (!agent) throw new Error('Agent not found');

  const execution = new Execution({
    agentId,
    userId,
    status: 'running',
    startTime: new Date()
  });
  await execution.save();

  try {
    await logExecution(execution._id.toString(), 'info', '🚀 Starting smart agent execution');
    await logExecution(execution._id.toString(), 'info', `📋 Task: ${agent.description}`);

    const result = await executeWithAI(agent.description, execution._id.toString());

    execution.status = 'completed';
    execution.endTime = new Date();
    execution.duration = execution.endTime.getTime() - execution.startTime.getTime();

    await execution.save();
    return execution;

  } catch (error: any) {
    execution.status = 'failed';
    execution.error = error?.message || 'Unknown error';
    execution.endTime = new Date();
    await execution.save();
    throw error;
  }
}

async function executeWithAI(description: string, executionId: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    await logExecution(executionId, 'warning', '⚠️ GEMINI_API_KEY not set - simulation mode enabled');
    return simulateExecution(description, executionId);
  }

  try {
 const genAI = new GoogleGenerativeAI(apiKey);

// 'gemini-2.0-flash-lite' is the 2026 standard for high-quota free tier
const model = genAI.getGenerativeModel(
  { model: "gemini-2.0-flash-lite" }, // Lite has the most reliable free quota
  { apiVersion: "v1" }
);
    const prompt = `
You are an AI automation agent. Understand this user automation task and generate a structured execution plan.
Task: "${description}"
Return STRICT JSON ONLY. Format exactly like:
{
  "steps": [
    {
      "action": "What to do",
      "type": "api_call | data_fetch | email | analysis | automation",
      "details": "Explain specifically",
      "status": "planned"
    }
  ],
  "summary": "Short description"
}
`;

    await logExecution(executionId, 'info', '🤖 AI analyzing task...');
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    await logExecution(executionId, 'info', '✅ AI generated execution plan');
    const plan = parseAIJson(response);

    if (plan?.steps?.length) {
      for (const step of plan.steps) {
        await logExecution(executionId, 'info', `📌 ${step.action}: ${step.details || ''}`);
      }
    }

    // FIX 2: Call the real action executor
    await executeRealActions(plan, executionId);

    await Execution.findByIdAndUpdate(executionId, {
      $push: {
        results: {
          nodeId: 'ai-planner',
          nodeType: 'smart-execution',
          nodeLabel: 'AI Task Planner',
          result: plan,
          timestamp: new Date()
        }
      }
    });

    return plan;

  } catch (error: any) {
    await logExecution(executionId, 'error', `❌ AI execution failed: ${error.message}`);
    throw error;
  }
}

// FIX 3: Moved this function outside of executeWithAI
async function executeRealActions(plan: any, executionId: string) {
  if (!plan?.steps?.length) {
    await logExecution(executionId, "warning", "No steps to execute");
    return;
  }

  for (const step of plan.steps) {
    switch (step.type) {
      case "data_fetch":
      case "google_sheets":
        try {
          await logExecution(executionId, "info", "📊 Fetching Google Sheets data...");
          const data = await readSheet(
            process.env.SHEET_ID as string,
            "Sheet1!A1:C100"
          );
          await logExecution(executionId, "info", "✅ Google Sheets data fetched");

          await Execution.findByIdAndUpdate(executionId, {
            $push: {
              results: {
                nodeId: "google-sheets",
                nodeType: "data",
                nodeLabel: "Google Sheets",
                result: data,
                timestamp: new Date()
              }
            }
          });
        } catch (err: any) {
          await logExecution(executionId, "error", `❌ Sheet fetch failed: ${err.message}`);
        }
        break;

      case "email":
        try {
          await logExecution(executionId, "info", "📧 Sending email...");
          await sendEmail(
            process.env.RECEIVER_EMAIL as string,
            "Automation Report",
            "This email is sent automatically by AI Agent"
          );
          await logExecution(executionId, "info", "✅ Email sent successfully");
        } catch (err: any) {
          await logExecution(executionId, "error", `❌ Email failed: ${err.message}`);
        }
        break;

      default:
        await logExecution(executionId, "info", `ℹ️ Skipping action: ${step.type}`);
    }
  }
}

function parseAIJson(text: string) {
  try {
    let cleaned = text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
    }
    return JSON.parse(cleaned);
  } catch {
    return { steps: [], summary: 'Failed to parse AI response' };
  }
}

async function simulateExecution(description: string, executionId: string) {
  // FIX 4: Removed the stray "import" and "await" snippets that were pasted here
  const lower = description.toLowerCase();
  
  if (lower.includes('analyze')) {
    await logExecution(executionId, 'info', '🤖 Simulating AI analysis...');
  }

  await logExecution(executionId, 'info', '💡 Simulation mode: Add API keys to enable real execution.');
  return { simulated: true, description };
}

async function logExecution(executionId: string, level: 'info' | 'warning' | 'error', message: string) {
  try {
    await Execution.findByIdAndUpdate(executionId, {
      $push: { logs: { timestamp: new Date(), level, message } }
    });
    console.log(`[${level.toUpperCase()}] ${message}`);
  } catch (err) {
    console.error('Failed to log execution:', err);
  }
}