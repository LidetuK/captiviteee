import { contextManager } from "../nlp/contextManager";
import { nlp } from "../nlp";
import { businessLogic } from "../business-logic";

export interface DialogState {
  currentNode: string;
  data: Record<string, any>;
  completed: boolean;
}

export interface DialogNode {
  id: string;
  message: string;
  expectedEntities?: string[];
  validation?: (input: string, entities: any) => boolean;
  next?: (input: string, entities: any) => string;
  action?: (input: string, entities: any) => Promise<any>;
}

export const dialogManager = {
  flows: new Map<string, Record<string, DialogNode>>(),

  registerFlow: (flowId: string, nodes: Record<string, DialogNode>) => {
    dialogManager.flows.set(flowId, nodes);
  },

  startDialog: async (sessionId: string, flowId: string): Promise<string> => {
    const flow = dialogManager.flows.get(flowId);
    if (!flow) throw new Error(`Flow ${flowId} not found`);

    const startNode = flow["start"];
    if (!startNode) throw new Error(`Start node not found in flow ${flowId}`);

    contextManager.updateContext(sessionId, {
      currentIntent: flowId,
      dialogState: { currentNode: "start", data: {}, completed: false },
    });

    return startNode.message;
  },

  handleInput: async (sessionId: string, input: string): Promise<string> => {
    const context = contextManager.getContext(sessionId);
    if (!context?.currentIntent || !context.dialogState) {
      return await dialogManager.handleFallback(input);
    }

    const flow = dialogManager.flows.get(context.currentIntent);
    if (!flow) return await dialogManager.handleFallback(input);

    const currentNode = flow[context.dialogState.currentNode as string];
    if (!currentNode) return await dialogManager.handleFallback(input);

    // Extract entities if needed
    let entities = {};
    if (currentNode.expectedEntities?.length) {
      entities = await nlp.extractEntities(input);
    }

    // Validate input
    if (currentNode.validation && !currentNode.validation(input, entities)) {
      return `I didn't understand that. ${currentNode.message}`;
    }

    // Execute node action
    if (currentNode.action) {
      await currentNode.action(input, entities);
    }

    // Update dialog state
    const nextNodeId = currentNode.next
      ? currentNode.next(input, entities)
      : null;
    if (nextNodeId) {
      const nextNode = flow[nextNodeId];
      if (nextNode) {
        context.dialogState.currentNode = nextNodeId;
        contextManager.updateContext(sessionId, context);
        return nextNode.message;
      }
    }

    // Dialog completed
    context.dialogState.completed = true;
    contextManager.updateContext(sessionId, context);
    return await dialogManager.handleCompletion(sessionId);
  },

  handleFallback: async (input: string): Promise<string> => {
    const intent = await nlp.classifyIntent(input);
    return await businessLogic.generateResponse(input, { intent });
  },

  handleCompletion: async (sessionId: string): Promise<string> => {
    const context = contextManager.getContext(sessionId);
    if (!context) return "Thank you for your time.";

    // Clear dialog state
    context.currentIntent = undefined;
    context.dialogState = undefined;
    contextManager.updateContext(sessionId, context);

    return "Is there anything else I can help you with?";
  },
};
