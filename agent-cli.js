import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug log to check if the API key is loaded correctly
console.log("API Key loaded:", process.env.OPENAI_API_KEY ? "Yes (key hidden for security)" : "No");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runSync(assistant_id, thread_id) {
  // Validate the assistant_id
  if (!thread_id || typeof thread_id !== 'string' || !thread_id.startsWith('thread_')) {
    throw new Error(`Invalid thread_id: ${thread_id}`);
  }
  
  // Create a run with explicit parameters
  console.log(`Creating run with thread_id: ${thread_id} and assistant_id: ${assistant_id}`);
  const run = await openai.beta.threads.runs.create(thread_id, {
    assistant_id: assistant_id
  });
  
  while (true) {
    // Check the status of the run
    const status = await openai.beta.threads.runs.retrieve(run.id, {
      thread_id: thread_id
    });
    // if done, exit the loop
    if (status.status === 'completed') break;
    // if something bad happened, throw an error
    if (['failed', 'expired', 'cancelled'].includes(status.status)) {
      throw new Error(`Run ${status.status}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
}

async function main() {
  const userInput = process.argv.slice(2).join(' ').trim();
  if (!userInput) {
    console.error('Usage: node agent-cli.js <message>');
    process.exit(1);
  }

  // Create the assistant/agent
  const assistant = await openai.beta.assistants.create({
    name: "CLI Assistant",
    instructions: "Respond concisely to user input.",
    model: "gpt-4o",
    tools: []
  });
  const thread = await openai.beta.threads.create();

  // Create the user message
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userInput
  });
  
  // Run the agent synchronously
  await runSync(assistant.id, thread.id);

  // Dereference the message from the agent by searching the
  // messages list for the assistant's reply.   If this is a long
  // conversation, you might want to find the first message from
  // the assistant from the end of the lsit.
  const messages = await openai.beta.threads.messages.list(thread.id);
  const reply = messages.data.find(m => m.role === 'assistant');
  console.log(reply.content[0].text.value);
}

main().catch(console.error);