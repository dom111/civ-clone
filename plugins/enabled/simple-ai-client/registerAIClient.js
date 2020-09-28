import AIClientRegistry from '../core-ai-client/AIClientRegistry.js';
import SimpleAIClient from './SimpleAIClient.js';

AIClientRegistry.getInstance()
  .register(
    SimpleAIClient
  )
;