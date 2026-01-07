import Execution from '../models/Execution';
import { triggerNode } from "./nodes/triggerNode";
import { apiCallNode } from "./nodes/apiCallNode";
import { conditionNode } from "./nodes/conditionNode";
import { aiActionNode } from "./nodes/aiActionNode";

import axios from 'axios';

interface Node {
  id: string;
  type: string;
  data: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

export class AgentExecutor {
  private executionId: string;
  private nodes: Node[];
  private edges: Edge[];
  
  constructor(executionId: string, nodes: Node[], edges: Edge[]) {
    this.executionId = executionId;
    this.nodes = nodes;
    this.edges = edges;
  }

  async execute() {
    try {
      await this.log('info', 'Starting agent execution');
      
      // Find the trigger node (starting point)
      const triggerNode = this.nodes.find(n => 
        n.type === 'trigger' || n.type === 'scheduleTrigger' || n.type === 'webhookTrigger'
      );
      
      if (!triggerNode) {
        throw new Error('No trigger node found');
      }

      await this.log('info', `Trigger found: ${triggerNode.data.label || triggerNode.type}`);

      // Execute the workflow starting from the trigger
      const results = await this.executeNode(triggerNode.id, {});
      
      await this.log('info', 'Agent execution completed successfully');
      return results;
      
    } catch (error: any) {
      await this.log('error', 'Agent execution failed', { error: error.message });
      throw error;
    }
  }

  private async executeNode(nodeId: string, context: any): Promise<any> {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return context;

    await this.log('info', `Executing node: ${node.data.label || node.type}`);

    let result = context;

    // Execute based on node type
    switch (node.type) {

  case "trigger":
  case "scheduleTrigger":
  case "webhookTrigger":
    result = await triggerNode(node, context);
    break;

  case "apiCall":
  case "action":
    result = await apiCallNode(node, context);
    break;

  case "condition":
  case "ifElse":
    result = await conditionNode(node, context);
    break;

  case "aiProcess":
  case "aiAction":
    result = await aiActionNode(node, context);
    break;

  default:
    await this.log("warning", `Unknown node type: ${node.type}`);
    result = context;
}


    // Store the result
    await this.addResult({
      nodeId: node.id,
      nodeType: node.type,
      nodeLabel: node.data.label,
      result
    });

    // Find and execute next nodes
    const nextEdges = this.edges.filter(e => e.source === nodeId);
    
    for (const edge of nextEdges) {
      await this.executeNode(edge.target, result);
    }

    return result;
  }

  private async executeTrigger(node: Node, context: any) {
    await this.log('info', `Trigger activated: ${node.data.label || 'Unnamed trigger'}`);
    return {
      ...context,
      triggeredAt: new Date().toISOString(),
      triggerType: node.type,
      triggerData: node.data
    };
  }

  private async executeApiCall(node: Node, context: any) {
    const { url, method = 'GET', headers = {}, body } = node.data;
    
    await this.log('info', `Making API call to: ${url || 'No URL specified'}`);
    
    try {
      // Make REAL API call if URL is provided
      if (url) {
        const response = await axios({
          method,
          url,
          headers,
          data: body,
          timeout: 30000
        });
        
        await this.log('info', `API call successful: ${response.status}`);
        
        return {
          ...context,
          apiResponse: {
            status: response.status,
            data: response.data,
            headers: response.headers
          }
        };
      }
    } catch (error: any) {
      await this.log('error', `API call failed: ${error.message}`);
    }
    
    // Fallback to simulation
    return {
      ...context,
      apiResponse: {
        status: 200,
        data: {
          message: 'API call simulated (no URL provided)',
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  private async executeSendEmail(node: Node, context: any) {
    const { to, subject, body } = node.data;
    
    await this.log('info', `Sending email to: ${to || 'No recipient'}`);
    
    // TODO: Integrate with SendGrid, AWS SES, or Resend
    // For now, just log it
    
    return {
      ...context,
      emailSent: {
        to,
        subject,
        body,
        sentAt: new Date().toISOString(),
        status: 'simulated'
      }
    };
  }

  private async executeAiProcess(node: Node, context: any) {
  const { prompt, model = 'gemini-pro', systemPrompt } = node.data || {};

  await this.log('info', `Processing AI Node (${model})`);

  try {
    // 1️⃣ Try Gemini First (if API Key exists)
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && prompt) {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const geminiModel = genAI.getGenerativeModel({ model });

      const fullPrompt = systemPrompt
        ? `${systemPrompt}\n\nUser Input:\n${prompt}`
        : prompt;

      const result = await geminiModel.generateContent(fullPrompt);
      const response = await result.response;
      const aiText = response.text();

      await this.log('info', 'AI processing completed using Gemini');

      return {
        ...context,
        aiResponse: {
          engine: "Gemini",
          model,
          inputPrompt: prompt,
          systemPrompt: systemPrompt || null,
          output: aiText,
          timestamp: new Date().toISOString()
        }
      };
    }

    // 2️⃣ Optionally Future Flask Bridge (coming next phases)
    // If you later add Flask, we will route requests here

  } catch (error: any) {
    await this.log('error', `AI Processing Crash: ${error.message}`);
  }

  // 3️⃣ Guaranteed Safe Fallback (Always Returns Something)
  await this.log(
    'warning',
    'AI executed in simulation mode. No Gemini key or failure occurred.'
  );

  return {
    ...context,
    aiResponse: {
      engine: "simulation",
      model,
      inputPrompt: prompt || null,
      output:
        "AI processing simulated. Add GEMINI_API_KEY or connect Flask AI service for real execution.",
      timestamp: new Date().toISOString()
    }
  };
}

  private async executeCondition(node: Node, context: any) {
    const { condition, conditionType = 'simple' } = node.data;
    
    await this.log('info', `Evaluating condition: ${condition || 'No condition specified'}`);
    
    let conditionMet = false;
    
    try {
      // Simple condition evaluation
      if (conditionType === 'simple' && condition) {
        // Parse simple conditions like "value > 100"
        conditionMet = this.evaluateSimpleCondition(condition, context);
      } else {
        // Random for demo purposes
        conditionMet = Math.random() > 0.5;
      }
    } catch (error: any) {
      await this.log('error', `Condition evaluation failed: ${error.message}`);
      conditionMet = false;
    }
    
    await this.log('info', `Condition result: ${conditionMet ? 'TRUE' : 'FALSE'}`);
    
    // Find the appropriate next node based on condition
    const nextEdges = this.edges.filter(e => e.source === node.id);
    
    // You can enhance this to support labeled edges (true/false branches)
    const nextEdge = nextEdges[conditionMet ? 0 : 1] || nextEdges[0];
    
    if (nextEdge) {
      return await this.executeNode(nextEdge.target, {
        ...context,
        conditionResult: conditionMet
      });
    }
    
    return context;
  }

  private evaluateSimpleCondition(condition: string, context: any): boolean {
    // Simple condition parser
    // Supports: value > 100, status == "active", count < 50
    const operators = ['==', '!=', '>', '<', '>=', '<='];
    
    for (const op of operators) {
      if (condition.includes(op)) {
        const [left, right] = condition.split(op).map(s => s.trim());
        const leftValue = this.getContextValue(left, context);
        const rightValue = this.parseValue(right);
        
        return this.compareValues(leftValue, rightValue, op);
      }
    }
    
    return false;
  }

  private getContextValue(key: string, context: any): any {
    // Support nested keys like "user.age"
    const keys = key.split('.');
    let value = context;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value;
  }

  private parseValue(value: string): any {
    // Remove quotes
    value = value.replace(/['"]/g, '');
    
    // Parse numbers
    if (!isNaN(Number(value))) {
      return Number(value);
    }
    
    // Parse booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    return value;
  }

  private compareValues(left: any, right: any, operator: string): boolean {
    switch (operator) {
      case '==': return left == right;
      case '!=': return left != right;
      case '>': return left > right;
      case '<': return left < right;
      case '>=': return left >= right;
      case '<=': return left <= right;
      default: return false;
    }
  }

  private async log(level: 'info' | 'warning' | 'error', message: string, data?: any) {
    try {
      await Execution.findByIdAndUpdate(this.executionId, {
        $push: {
          logs: {
            timestamp: new Date(),
            level,
            message,
            data
          }
        }
      });
      
      // Also log to console for debugging
      console.log(`[${level.toUpperCase()}] ${message}`, data || '');
    } catch (error) {
      console.error('Failed to log:', error);
    }
  }

  private async addResult(result: any) {
    try {
      await Execution.findByIdAndUpdate(this.executionId, {
        $push: { results: result }
      });
    } catch (error) {
      console.error('Failed to add result:', error);
    }
  }
}

export async function executeAgentWorkflow(
  agentId: string,
  userId: string,
  nodes: Node[],
  edges: Edge[]
) {
  // Create execution record
  const execution = new Execution({
    agentId,
    userId,
    status: 'running',
    startTime: new Date()
  });
  
  await execution.save();
  
  try {
    // Execute the agent
    const executor = new AgentExecutor(execution._id.toString(), nodes, edges);
    await executor.execute();
    
    // Update execution status
    const endTime = new Date();
    execution.status = 'completed';
    execution.endTime = endTime;
    execution.duration = endTime.getTime() - execution.startTime.getTime();
    await execution.save();
    
    return execution;
    
  } catch (error: any) {
    // Mark execution as failed
    execution.status = 'failed';
    execution.endTime = new Date();
    execution.error = error.message;
    await execution.save();
    
    throw error;
  }
}