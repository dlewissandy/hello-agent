import { Agent, run, tool } from '@openai/agents';
import * as dotenv from 'dotenv';
import { greet_tool, get_username_tool, get_favorite_color_tool} from './tools.js';

// Load environment variables
dotenv.config();

// Define the Agent
const agent = new Agent({
  name: "CLI Agent",
  instructions: "Respond concisely to user input.",
  model: "gpt-4o-mini",
  tools: [greet_tool, get_username_tool, get_favorite_color_tool],
})


async function main() {
  // READ THE COMMAND LINE ARGUMENTS
  const userInput = process.argv.slice(2).join(' ').trim();
  if (!userInput) {
    console.error('Usage: node agent-cli.js <message>');
    process.exit(1);
  }

  // INVOKE THE AGENT
  const result = await run(agent, userInput);

  // PRINT THE RESULT
  console.log(result.finalOutput);
}
  

main().catch(console.error);