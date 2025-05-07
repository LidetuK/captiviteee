/**
 * Conversation Flow Management System
 */

import { auditLogger } from "../../auth/audit";
import { ConversationContext, Intent, Entity } from "../nlp/contextAwareNLP";
import { EmotionAnalysis } from "../nlp/emotionDetection";

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  name: string;
  description?: string;
  data: FlowNodeData;
  next: FlowTransition[];
  metadata?: Record<string, any>;
}

export type FlowNodeType = 
  | "start" 
  | "message" 
  | "condition" 
  | "input" 
  | "action" 
  | "decision" 
  | "emotion_router"
  | "intent_router"
  | "entity_collector"
  | "external_service"
  | "end";

export interface FlowNodeData {
  // Common properties
  timeout?: number; // Timeout in milliseconds
  retries?: number; // Number of retries
  
  // Message node properties
  messages?: string[];
  messageTemplate?: string;
  messageVariables?: Record<string, string>;
  
  // Condition node properties
  condition?: string;
  conditionVariables?: Record<string, any>;
  
  // Input node properties
  inputPrompt?: string;
  inputValidation?: string;
  inputType?: "text" | "number" | "date" | "time" | "selection" | "confirmation";
  inputOptions?: string[];
  
  // Action node properties
  action?: string;
  actionParams?: Record<string, any>;
  
  // Decision node properties
  decisionVariable?: string;
  decisionOptions?: Record<string, any>;
  
  // Emotion router properties
  emotionThresholds?: Record<string, number>;
  defaultEmotionRoute?: string;
  
  // Intent router properties
  intentConfidenceThreshold?: number;
  defaultIntentRoute?: string;
  
  // Entity collector properties
  requiredEntities?: string[];
  entityPrompts?: Record<string, string>;
  entityConfirmation?: boolean;
  
  // External service properties
  serviceUrl?: string;
  serviceMethod?: "GET" | "POST" | "PUT" | "DELETE";
  serviceHeaders?: Record<string, string>;
  serviceBody?: string | Record<string, any>;
  serviceResponseMapping?: Record<string, string>;
}

export interface FlowTransition {
  targetNodeId: string;
  condition?: string;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface ConversationFlow {
  id: string;
  name: string;
  description?: string;
  version: string;
  nodes: FlowNode[];
  startNodeId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowExecutionContext {
  flowId: string;
  sessionId: string;
  userId: string;
  currentNodeId: string;
  previousNodeIds: string[];
  variables: Record<string, any>;
  entities: Record<string, Entity>;
  lastIntent?: Intent;
  lastEmotion?: EmotionAnalysis;
  startedAt: Date;
  lastUpdatedAt: Date;
  completedAt?: Date;
  status: "active" | "completed" | "failed" | "timeout";
  metrics: {
    nodesVisited: number;
    totalTimeMs: number;
    userInputs: number;
    actionsExecuted: number;
    errors: number;
  };
}

export interface FlowExecutionResult {
  success: boolean;
  nextNodeId?: string;
  output?: any;
  message?: string;
  action?: string;
  actionParams?: Record<string, any>;
  error?: string;
}

class FlowManager {
  private flows = new Map<string, ConversationFlow>();
  private executionContexts = new Map<string, FlowExecutionContext>();
  private storageKey = "captivite_flow_contexts";

  constructor() {
    // Load execution contexts from localStorage in browser environment
    if (typeof window !== "undefined") {
      try {
        const storedContexts = localStorage.getItem(this.storageKey);
        if (storedContexts) {
          const parsedContexts = JSON.parse(storedContexts);
          Object.entries(parsedContexts).forEach(([sessionId, context]: [string, any]) => {
            // Convert string dates back to Date objects
            context.startedAt = new Date(context.startedAt);
            context.lastUpdatedAt = new Date(context.lastUpdatedAt);
            if (context.completedAt) {
              context.completedAt = new Date(context.completedAt);
            }
            this.executionContexts.set(sessionId, context as FlowExecutionContext);
          });
        }
      } catch (error) {
        console.error("Failed to load flow contexts from storage:", error);
      }
    }
  }

  /**
   * Register a new conversation flow
   */
  registerFlow(flow: Omit<ConversationFlow, "createdAt" | "updatedAt">): ConversationFlow {
    const now = new Date();
    const newFlow: ConversationFlow = {
      ...flow,
      createdAt: now,
      updatedAt: now
    };

    // Validate the flow
    this.validateFlow(newFlow);

    // Store the flow
    this.flows.set(newFlow.id, newFlow);

    // Log the registration
    auditLogger.log({
      userId: "system",
      action: "flow_registered",
      resource: "conversation_flow",
      details: { flowId: newFlow.id, flowName: newFlow.name },
      status: "success"
    });

    return newFlow;
  }

  /**
   * Get a registered flow by ID
   */
  getFlow(flowId: string): ConversationFlow | undefined {
    return this.flows.get(flowId);
  }

  /**
   * Get all registered flows
   */
  getAllFlows(): ConversationFlow[] {
    return Array.from(this.flows.values());
  }

  /**
   * Start a new flow execution
   */
  async startFlow(flowId: string, sessionId: string, userId: string, initialVariables: Record<string, any> = {}): Promise<FlowExecutionContext> {
    const flow = this.flows.get(flowId);
    if (!flow) {
      throw new Error(`Flow with ID ${flowId} not found`);
    }

    // Create a new execution context
    const now = new Date();
    const context: FlowExecutionContext = {
      flowId,
      sessionId,
      userId,
      currentNodeId: flow.startNodeId,
      previousNodeIds: [],
      variables: { ...initialVariables },
      entities: {},
      startedAt: now,
      lastUpdatedAt: now,
      status: "active",
      metrics: {
        nodesVisited: 1, // Start node is visited
        totalTimeMs: 0,
        userInputs: 0,
        actionsExecuted: 0,
        errors: 0
      }
    };

    // Store the execution context
    this.executionContexts.set(sessionId, context);
    this.persistExecutionContexts();

    // Log the flow start
    await auditLogger.log({
      userId,
      action: "flow_started",
      resource: "conversation_flow",
      details: { flowId, sessionId },
      status: "success"
    });

    // Process the start node
    await this.processNode(sessionId);

    return context;
  }

  /**
   * Process the current node in a flow
   */
  async processNode(sessionId: string, input?: any): Promise<FlowExecutionResult> {
    const context = this.executionContexts.get(sessionId);
    if (!context) {
      return { success: false, error: `No active flow for session ${sessionId}` };
    }

    const flow = this.flows.get(context.flowId);
    if (!flow) {
      return { success: false, error: `Flow with ID ${context.flowId} not found` };
    }

    // Find the current node
    const currentNode = flow.nodes.find(node => node.id === context.currentNodeId);
    if (!currentNode) {
      return { success: false, error: `Node with ID ${context.currentNodeId} not found in flow ${context.flowId}` };
    }

    // Update metrics
    context.metrics.nodesVisited++;
    context.lastUpdatedAt = new Date();

    // Process the node based on its type
    let result: FlowExecutionResult;

    try {
      switch (currentNode.type) {
        case "start":
          result = await this.processStartNode(currentNode, context, input);
          break;

        case "message":
          result = await this.processMessageNode(currentNode, context, input);
          break;

        case "condition":
          result = await this.processConditionNode(currentNode, context, input);
          break;

        case "input":
          result = await this.processInputNode(currentNode, context, input);
          break;

        case "action":
          result = await this.processActionNode(currentNode, context, input);
          break;

        case "decision":
          result = await this.processDecisionNode(currentNode, context, input);
          break;

        case "emotion_router":
          result = await this.processEmotionRouterNode(currentNode, context, input);
          break;

        case "intent_router":
          result = await this.processIntentRouterNode(currentNode, context, input);
          break;

        case "entity_collector":
          result = await this.processEntityCollectorNode(currentNode, context, input);
          break;

        case "external_service":
          result = await this.processExternalServiceNode(currentNode, context, input);
          break;

        case "end":
          result = await this.processEndNode(currentNode, context, input);
          break;

        default:
          result = { success: false, error: `Unknown node type: ${currentNode.type}` };
      }
    } catch (error: unknown) {
      context.metrics.errors++;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      result = { success: false, error: `Error processing node: ${errorMessage}` };

      // Log the error
      await auditLogger.log({
        userId: context.userId,
        action: "flow_node_error",
        resource: "conversation_flow",
        details: { 
          flowId: context.flowId, 
          nodeId: currentNode.id, 
          nodeType: currentNode.type,
          error: errorMessage 
        },
        status: "failure"
      });
    }

    // If the node processing was successful and returned a next node
    if (result.success && result.nextNodeId) {
      // Update the execution context
      context.previousNodeIds.push(context.currentNodeId);
      context.currentNodeId = result.nextNodeId;
      context.lastUpdatedAt = new Date();

      // Calculate total time
      context.metrics.totalTimeMs = context.lastUpdatedAt.getTime() - context.startedAt.getTime();

      // Persist the updated context
      this.persistExecutionContexts();

      // If the next node is an end node, mark the flow as completed
      const nextNode = flow.nodes.find(node => node.id === result.nextNodeId);
      if (nextNode && nextNode.type === "end") {
        context.status = "completed";
        context.completedAt = new Date();
        this.persistExecutionContexts();

        // Log flow completion
        await auditLogger.log({
          userId: context.userId,
          action: "flow_completed",
          resource: "conversation_flow",
          details: { 
            flowId: context.flowId, 
            sessionId: context.sessionId,
            metrics: context.metrics 
          },
          status: "success"
        });
      }
    }

    return result;
  }

  /**
   * Update flow execution with new conversation context
   */
  async updateWithConversationContext(sessionId: string, conversationContext: ConversationContext): Promise<void> {
    const context = this.executionContexts.get(sessionId);
    if (!context) return;

    // Get the last user message
    const lastUserMessageIndex = conversationContext.history
      .map(h => h.role)
      .lastIndexOf("user");

    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = conversationContext.history[lastUserMessageIndex];

    // Update intent if available
    if (lastUserMessage.intent) {
      context.lastIntent = lastUserMessage.intent;
    }

    // Update emotion if available
    if (lastUserMessage.sentiment) {
      // Convert sentiment to emotion format (simplified)
      context.lastEmotion = {
        primary: {
          emotion: lastUserMessage.sentiment.score > 0 ? "joy" : 
                  lastUserMessage.sentiment.score < 0 ? "sadness" : "neutral",
          score: Math.abs(lastUserMessage.sentiment.score),
          confidence: 0.7
        },
        overall: {
          valence: lastUserMessage.sentiment.score,
          arousal: 0.5, // Default mid-level arousal
          dominance: 0.5 // Default mid-level dominance
        },
        details: []
      };
    }

    // Update entities
    if (lastUserMessage.entities) {
      lastUserMessage.entities.forEach(entity => {
        context.entities[entity.id] = entity;
      });
    }

    // Update the context
    context.lastUpdatedAt = new Date();
    this.persistExecutionContexts();
  }

  /**
   * Get the current execution context for a session
   */
  getExecutionContext(sessionId: string): FlowExecutionContext | undefined {
    return this.executionContexts.get(sessionId);
  }

  /**
   * End a flow execution
   */
  async endFlow(sessionId: string, status: "completed" | "failed" = "completed"): Promise<void> {
    const context = this.executionContexts.get(sessionId);
    if (!context) return;

    context.status = status;
    context.completedAt = new Date();
    context.metrics.totalTimeMs = context.completedAt.getTime() - context.startedAt.getTime();

    this.persistExecutionContexts();

    // Log flow end
    await auditLogger.log({
      userId: context.userId,
      action: "flow_ended",
      resource: "conversation_flow",
      details: { 
        flowId: context.flowId, 
        sessionId, 
        status,
        metrics: context.metrics 
      },
      status: status === "completed" ? "success" : "failure"
    });
  }

  /**
   * Process a start node
   */
  private async processStartNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    // Start nodes typically just transition to the next node
    const nextNodeId = this.determineNextNode(node, context);
    if (!nextNodeId) {
      return { success: false, error: "Start node has no valid transitions" };
    }

    return { success: true, nextNodeId };
  }

  /**
   * Process a message node
   */
  private async processMessageNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { messages, messageTemplate, messageVariables } = node.data;
    let message = "";

    if (messageTemplate) {
      // Use template with variables
      message = messageTemplate;
      if (messageVariables) {
        Object.entries(messageVariables).forEach(([key, value]) => {
          const variableValue = this.resolveVariable(value.toString(), context);
          message = message.replace(new RegExp(`{{${key}}}`, 'g'), variableValue);
        });
      }
    } else if (messages && messages.length > 0) {
      // Select a random message from the list
      const index = Math.floor(Math.random() * messages.length);
      message = messages[index];
    }

    const nextNodeId = this.determineNextNode(node, context);
    return { success: true, message, nextNodeId };
  }

  /**
   * Process a condition node
   */
  private async processConditionNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { condition, conditionVariables } = node.data;
    let conditionResult = false;

    if (condition) {
      try {
        // Prepare variables for condition evaluation
        const variables: Record<string, any> = {
          ...context.variables,
          input,
          entities: context.entities,
          lastIntent: context.lastIntent,
          lastEmotion: context.lastEmotion
        };

        // Add condition-specific variables
        if (conditionVariables) {
          Object.entries(conditionVariables).forEach(([key, value]) => {
            variables[key] = this.resolveVariable(value.toString(), context);
          });
        }

        // Evaluate the condition
        // In a real implementation, this would use a proper expression evaluator
        // This is a simplified version for demonstration purposes
        conditionResult = this.evaluateCondition(condition, variables);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return { success: false, error: `Error evaluating condition: ${errorMessage}` };
      }
    }

    // Store the condition result in the context variables
    context.variables._lastConditionResult = conditionResult;

    // Determine the next node based on the condition result
    const nextNodeId = this.determineNextNode(node, context);
    return { success: true, nextNodeId };
  }

  /**
   * Process an input node
   */
  private async processInputNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { inputPrompt, inputValidation, inputType, inputOptions } = node.data;

    // If input is provided, validate it
    if (input !== undefined) {
      // Validate input based on type and validation rules
      if (inputValidation) {
        try {
          const isValid = this.validateInput(input, inputType, inputValidation, inputOptions);
          if (!isValid) {
            return { 
              success: false, 
              message: `Invalid input. ${this.getValidationErrorMessage(inputType, inputOptions)}`,
              error: "Input validation failed" 
            };
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          return { success: false, error: `Error validating input: ${errorMessage}` };
        }
      }

      // Store the input in the context variables
      context.variables._lastInput = input;
      context.metrics.userInputs++;

      // Determine the next node
      const nextNodeId = this.determineNextNode(node, context);
      return { success: true, nextNodeId };
    }

    // If no input is provided, return the prompt
    return { 
      success: true, 
      message: inputPrompt || "Please provide input",
      // No nextNodeId means we're waiting for input
    };
  }

  /**
   * Process an action node
   */
  private async processActionNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { action, actionParams } = node.data;

    if (!action) {
      return { success: false, error: "Action node has no action defined" };
    }

    // Prepare action parameters
    const resolvedParams: Record<string, any> = {};
    if (actionParams) {
      Object.entries(actionParams).forEach(([key, value]) => {
        resolvedParams[key] = this.resolveVariable(value.toString(), context);
      });
    }

    // Update metrics
    context.metrics.actionsExecuted++;

    // Determine the next node
    const nextNodeId = this.determineNextNode(node, context);

    return { 
      success: true, 
      action, 
      actionParams: resolvedParams,
      nextNodeId 
    };
  }

  /**
   * Process a decision node
   */
  private async processDecisionNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { decisionVariable, decisionOptions } = node.data;

    if (!decisionVariable || !decisionOptions) {
      return { success: false, error: "Decision node missing required configuration" };
    }

    // Get the value of the decision variable
    const variableValue = this.resolveVariable(decisionVariable, context);

    // Find the matching option
    let matchedOption: string | null = null;
    for (const [option, value] of Object.entries(decisionOptions)) {
      if (variableValue === value) {
        matchedOption = option;
        break;
      }
    }

    // Store the decision result
    context.variables._lastDecision = matchedOption;

    // Determine the next node
    const nextNodeId = this.determineNextNode(node, context);
    return { success: true, nextNodeId };
  }

  /**
   * Process an emotion router node
   */
  private async processEmotionRouterNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { emotionThresholds, defaultEmotionRoute } = node.data;

    if (!context.lastEmotion) {
      // No emotion detected, use default route
      if (defaultEmotionRoute) {
        return { success: true, nextNodeId: defaultEmotionRoute };
      } else {
        return { success: false, error: "No emotion detected and no default route configured" };
      }
    }

    const primaryEmotion = context.lastEmotion.primary.emotion;
    const emotionScore = context.lastEmotion.primary.score;

    // Check if there's a threshold for this emotion
    if (emotionThresholds && emotionThresholds[primaryEmotion] !== undefined) {
      const threshold = emotionThresholds[primaryEmotion];
      
      // If the emotion score exceeds the threshold, use the emotion-specific transition
      if (emotionScore >= threshold) {
        // Find the transition for this emotion
        const transition = node.next.find(t => t.condition === primaryEmotion);
        if (transition) {
          return { success: true, nextNodeId: transition.targetNodeId };
        }
      }
    }

    // If no specific emotion route matched, use the default
    if (defaultEmotionRoute) {
      return { success: true, nextNodeId: defaultEmotionRoute };
    }

    // Determine the next node using standard logic
    const nextNodeId = this.determineNextNode(node, context);
    return { success: true, nextNodeId };
  }

  /**
   * Process an intent router node
   */
  private async processIntentRouterNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { intentConfidenceThreshold, defaultIntentRoute } = node.data;
    const threshold = intentConfidenceThreshold || 0.5; // Default threshold

    if (!context.lastIntent) {
      // No intent detected, use default route
      if (defaultIntentRoute) {
        return { success: true, nextNodeId: defaultIntentRoute };
      } else {
        return { success: false, error: "No intent detected and no default route configured" };
      }
    }

    const intentName = context.lastIntent.name;
    const intentConfidence = context.lastIntent.confidence;

    // If the intent confidence exceeds the threshold, use the intent-specific transition
    if (intentConfidence >= threshold) {
      // Find the transition for this intent
      const transition = node.next.find(t => t.condition === intentName);
      if (transition) {
        return { success: true, nextNodeId: transition.targetNodeId };
      }
    }

    // If no specific intent route matched, use the default
    if (defaultIntentRoute) {
      return { success: true, nextNodeId: defaultIntentRoute };
    }

    // Determine the next node using standard logic
    const nextNodeId = this.determineNextNode(node, context);
    return { success: true, nextNodeId };
  }

  /**
   * Process an entity collector node
   */
  private async processEntityCollectorNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { requiredEntities, entityPrompts, entityConfirmation } = node.data;

    if (!requiredEntities || requiredEntities.length === 0) {
      return { success: false, error: "Entity collector node has no required entities defined" };
    }

    // Check which required entities are missing
    const missingEntities = requiredEntities.filter(entityType => {
      return !Object.values(context.entities).some(entity => entity.type === entityType);
    });

    // If all required entities are collected
    if (missingEntities.length === 0) {
      // If confirmation is required, ask for confirmation
      if (entityConfirmation && !context.variables._entityConfirmation) {
        // Build confirmation message
        let confirmationMessage = "I have collected the following information:\n";
        requiredEntities.forEach(entityType => {
          const entity = Object.values(context.entities).find(e => e.type === entityType);
          if (entity) {
            confirmationMessage += `- ${entityType}: ${entity.value}\n`;
          }
        });
        confirmationMessage += "\nIs this information correct?";

        // If input is provided, treat it as confirmation
        if (input !== undefined) {
          // Simple yes/no detection
          const confirmation = typeof input === 'string' 
            ? input.toLowerCase().includes('yes') || input.toLowerCase().includes('correct')
            : Boolean(input);
          
          context.variables._entityConfirmation = confirmation;
          
          if (confirmation) {
            // Entities confirmed, proceed to next node
            const nextNodeId = this.determineNextNode(node, context);
            return { success: true, nextNodeId };
          } else {
            // Entities rejected, clear them and restart collection
            requiredEntities.forEach(entityType => {
              const entityToRemove = Object.values(context.entities).find(e => e.type === entityType);
              if (entityToRemove) {
                delete context.entities[entityToRemove.id];
              }
            });
            context.variables._entityConfirmation = undefined;
            
            // Ask for the first missing entity again
            const firstEntityType = requiredEntities[0];
            const prompt = entityPrompts && entityPrompts[firstEntityType] 
              ? entityPrompts[firstEntityType] 
              : `Please provide the ${firstEntityType}`;
            
            return { success: true, message: prompt };
          }
        }
        
        // No input, ask for confirmation
        return { success: true, message: confirmationMessage };
      }
      
      // All entities collected and confirmed (or confirmation not required)
      const nextNodeId = this.determineNextNode(node, context);
      return { success: true, nextNodeId };
    }

    // There are missing entities
    // If input is provided, try to extract the entity
    if (input !== undefined && typeof input === 'string' && input.trim() !== '') {
      // In a real implementation, this would use a proper entity extraction service
      // This is a simplified version for demonstration purposes
      const firstMissingEntity = missingEntities[0];
      
      // Create a simple entity from the input
      const newEntity: Entity = {
        id: `${firstMissingEntity}_${Date.now()}`,
        type: firstMissingEntity,
        value: input,
        confidence: 0.8,
        source: "user_input",
        timestamp: new Date()
      };
      
      // Add the entity to the context
      context.entities[newEntity.id] = newEntity;
      
      // Check if there are still missing entities
      const remainingEntities = requiredEntities.filter(entityType => {
        return !Object.values(context.entities).some(entity => entity.type === entityType);
      });
      
      if (remainingEntities.length > 0) {
        // Ask for the next missing entity
        const nextEntityType = remainingEntities[0];
        const prompt = entityPrompts && entityPrompts[nextEntityType] 
          ? entityPrompts[nextEntityType] 
          : `Please provide the ${nextEntityType}`;
        
        return { success: true, message: prompt };
      } else {
        // All entities collected, check if confirmation is needed
        if (entityConfirmation) {
          // Build confirmation message
          let confirmationMessage = "I have collected the following information:\n";
          requiredEntities.forEach(entityType => {
            const entity = Object.values(context.entities).find(e => e.type === entityType);
            if (entity) {
              confirmationMessage += `- ${entityType}: ${entity.value}\n`;
            }
          });
          confirmationMessage += "\nIs this information correct?";
          
          return { success: true, message: confirmationMessage };
        } else {
          // No confirmation needed, proceed to next node
          const nextNodeId = this.determineNextNode(node, context);
          return { success: true, nextNodeId };
        }
      }
    }
    
    // No input provided, ask for the first missing entity
    const firstMissingEntity = missingEntities[0];
    const prompt = entityPrompts && entityPrompts[firstMissingEntity] 
      ? entityPrompts[firstMissingEntity] 
      : `Please provide the ${firstMissingEntity}`;
    
    return { success: true, message: prompt };
  }

  /**
   * Process an external service node
   */
  private async processExternalServiceNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    const { serviceUrl, serviceMethod, serviceHeaders, serviceBody, serviceResponseMapping } = node.data;

    if (!serviceUrl) {
      return { success: false, error: "External service node has no URL defined" };
    }

    try {
      // Prepare request parameters
      const method = serviceMethod || "GET";
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      
      // Add custom headers
      if (serviceHeaders) {
        Object.entries(serviceHeaders).forEach(([key, value]) => {
          headers[key] = this.resolveVariable(value.toString(), context);
        });
      }
      
      // Prepare request body
      let body: string | undefined;
      if (serviceBody && (method === "POST" || method === "PUT")) {
        if (typeof serviceBody === "string") {
          body = this.resolveVariable(serviceBody, context);
        } else {
          const resolvedBody: Record<string, any> = {};
          Object.entries(serviceBody).forEach(([key, value]) => {
            resolvedBody[key] = this.resolveVariable(value.toString(), context);
          });
          body = JSON.stringify(resolvedBody);
        }
      }
      
      // In a real implementation, this would make an actual HTTP request
      // This is a simplified version for demonstration purposes
      console.log(`[External Service] ${method} ${serviceUrl}`, { headers, body });
      
      // Simulate a response
      const response = {
        status: 200,
        data: {
          success: true,
          message: "Service call successful",
          timestamp: new Date().toISOString(),
          requestId: Math.random().toString(36).substring(2, 15)
        }
      };
      
      // Map response to context variables
      if (serviceResponseMapping && response.data) {
        Object.entries(serviceResponseMapping).forEach(([contextVar, responsePath]) => {
          const value = this.getNestedProperty(response.data, responsePath.toString());
          if (value !== undefined) {
            context.variables[contextVar] = value;
          }
        });
      }
      
      // Store the full response in the context
      context.variables._lastServiceResponse = response.data;
      
      // Determine the next node
      const nextNodeId = this.determineNextNode(node, context);
      return { success: true, nextNodeId, output: response.data };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: `External service error: ${errorMessage}` };
    }
  }

  /**
   * Process an end node
   */
  private async processEndNode(node: FlowNode, context: FlowExecutionContext, input?: any): Promise<FlowExecutionResult> {
    // End nodes typically just mark the flow as completed
    context.status = "completed";
    context.completedAt = new Date();
    context.metrics.totalTimeMs = context.completedAt.getTime() - context.startedAt.getTime();
    
    // Log flow completion
    await auditLogger.log({
      userId: context.userId,
      action: "flow_completed",
      resource: "conversation_flow",
      details: { 
        flowId: context.flowId, 
        sessionId: context.sessionId,
        metrics: context.metrics 
      },
      status: "success"
    });
    
    return { success: true, message: node.data.messages?.[0] || "Conversation completed" };
  }

  /**
   * Determine the next node based on transitions
   */
  private determineNextNode(node: FlowNode, context: FlowExecutionContext): string | undefined {
    if (!node.next || node.next.length === 0) {
      return undefined;
    }

    // Sort transitions by priority (higher first)
    const sortedTransitions = [...node.next].sort((a, b) => {
      const priorityA = a.priority !== undefined ? a.priority : 0;
      const priorityB = b.priority !== undefined ? b.priority : 0;
      return priorityB - priorityA;
    });

    // Find the first transition that matches the condition
    for (const transition of sortedTransitions) {
      if (!transition.condition) {
        // Unconditional transition
        return transition.targetNodeId;
      }

      // Evaluate the condition
      try {
        const variables: Record<string, any> = {
          ...context.variables,
          entities: context.entities,
          lastIntent: context.lastIntent,
          lastEmotion: context.lastEmotion
        };

        const conditionResult = this.evaluateCondition(transition.condition, variables);
        if (conditionResult) {
          return transition.targetNodeId;
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Error evaluating transition condition: ${errorMessage}`);
        // Continue to the next transition
      }
    }

    // If no condition matched, use the first transition as default
    return sortedTransitions[0]?.targetNodeId;
  }

  /**
   * Evaluate a condition expression
   */
  private evaluateCondition(condition: string, variables: Record<string, any>): boolean {
    // In a real implementation, this would use a proper expression evaluator
    // This is a simplified version for demonstration purposes
    
    // Handle simple equality conditions
    if (condition.includes("==")) {
      const [left, right] = condition.split("==").map(part => part.trim());
      const leftValue = this.getVariableValue(left, variables);
      const rightValue = this.getVariableValue(right, variables);
      return leftValue == rightValue;
    }
    
    // Handle simple inequality conditions
    if (condition.includes("!=")) {
      const [left, right] = condition.split("!=").map(part => part.trim());
      const leftValue = this.getVariableValue(left, variables);
      const rightValue = this.getVariableValue(right, variables);
      return leftValue != rightValue;
    }
    
    // Handle greater than conditions
    if (condition.includes(">")) {
      const [left, right] = condition.split(">").map(part => part.trim());
      const leftValue = this.getVariableValue(left, variables);
      const rightValue = this.getVariableValue(right, variables);
      return leftValue > rightValue;
    }
    
    // Handle less than conditions
    if (condition.includes("<")) {
      const [left, right] = condition.split("<").map(part => part.trim());
      const leftValue = this.getVariableValue(left, variables);
      const rightValue = this.getVariableValue(right, variables);
      return leftValue < rightValue;
    }
    
    // Handle simple existence checks
    if (condition.startsWith("exists(") && condition.endsWith(")")) {
      const variableName = condition.substring(7, condition.length - 1).trim();
      const value = this.getVariableValue(variableName, variables);
      return value !== undefined && value !== null;
    }
    
    // Handle simple boolean variables
    const value = this.getVariableValue(condition, variables);
    return Boolean(value);
  }

  /**
   * Get a variable value from the variables object
   */
  private getVariableValue(expression: string, variables: Record<string, any>): any {
    // Handle string literals
    if (expression.startsWith('"') && expression.endsWith('"')) {
      return expression.substring(1, expression.length - 1);
    }
    
    // Handle number literals
    if (/^-?\d+(\.\d+)?$/.test(expression)) {
      return parseFloat(expression);
    }
    
    // Handle boolean literals
    if (expression === "true") return true;
    if (expression === "false") return false;
    
    // Handle nested properties
    if (expression.includes(".")) {
      return this.getNestedProperty(variables, expression);
    }
    
    // Handle simple variables
    return variables[expression];
  }

  /**
   * Get a nested property from an object using dot notation
   */
  private getNestedProperty(obj: any, path: string): any {
    const parts = path.split(".");
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }

  /**
   * Resolve a variable reference in a string
   */
  private resolveVariable(value: string, context: FlowExecutionContext): any {
    // Check if the value is a variable reference
    if (value.startsWith("${") && value.endsWith("}")) {
      const variableName = value.substring(2, value.length - 1);
      return this.getNestedProperty(context.variables, variableName);
    }
    
    // Check for interpolation
    if (value.includes("${") && value.includes("}")) {
      return value.replace(/\${([^}]+)}/g, (match, variableName) => {
        const variableValue = this.getNestedProperty(context.variables, variableName);
        return variableValue !== undefined ? String(variableValue) : match;
      });
    }
    
    return value;
  }

  /**
   * Validate input based on type and validation rules
   */
  private validateInput(input: any, inputType?: string, validation?: string, options?: string[]): boolean {
    if (!input) return false;
    
    switch (inputType) {
      case "text":
        return typeof input === "string" && input.trim().length > 0;
      case "number":
        return !isNaN(Number(input));
      case "date":
        return !isNaN(Date.parse(input));
      case "time":
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(input);
      case "selection":
        return options ? options.includes(input) : true;
      case "confirmation":
        return input === true || input === false;
      default:
        return true;
    }
  }

  /**
   * Get validation error message
   */
  private getValidationErrorMessage(inputType?: string, options?: string[]): string {
    switch (inputType) {
      case "text":
        return "Please enter a valid text";
      case "number":
        return "Please enter a valid number";
      case "date":
        return "Please enter a valid date";
      case "time":
        return "Please enter a valid time (HH:MM)";
      case "selection":
        return options ? `Please select one of: ${options.join(", ")}` : "Please make a selection";
      case "confirmation":
        return "Please confirm or deny";
      default:
        return "Invalid input";
    }
  }

  /**
   * Validate flow structure
   */
  private validateFlow(flow: ConversationFlow): void {
    if (!flow.id) throw new Error("Flow ID is required");
    if (!flow.name) throw new Error("Flow name is required");
    if (!flow.startNodeId) throw new Error("Start node ID is required");
    if (!flow.nodes || flow.nodes.length === 0) throw new Error("Flow must have at least one node");

    // Validate start node exists and is of type "start"
    const startNode = flow.nodes.find(node => node.id === flow.startNodeId);
    if (!startNode) throw new Error(`Start node with ID ${flow.startNodeId} not found`);
    if (startNode.type !== "start") throw new Error(`Node with ID ${flow.startNodeId} is not a start node`);

    // Validate all nodes
    flow.nodes.forEach(node => {
      if (!node.id) throw new Error("Node ID is required");
      if (!node.type) throw new Error("Node type is required");
      if (!node.name) throw new Error("Node name is required");
      if (!node.data) throw new Error("Node data is required");
    });
  }

  /**
   * Persist execution contexts to storage
   */
  private persistExecutionContexts(): void {
    if (typeof window !== "undefined") {
      try {
        const contexts = Array.from(this.executionContexts.values());
        localStorage.setItem(this.storageKey, JSON.stringify(contexts));
      } catch (error) {
        console.error("Failed to persist execution contexts:", error);
      }
    }
  }
}

export const flowManager = new FlowManager();
