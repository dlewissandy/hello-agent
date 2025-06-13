import { tool } from '@openai/agents';
import { z } from 'zod';



export const greet_tool = tool({
  name: 'greetings',
  description: 'Generate a friendly greeting',
  parameters: z.object({ city: z.string() }),
  execute: async (input) => {
    return `Ahoy, ${input.name}!`;
  },
});

export const get_username_tool = tool({
  name: 'get_username',
  description: 'Get the name of the current user',
  parameters: z.object({}),
  execute: async (input) => {
    return `Ana Sillis`;
  },
});

export const get_favorite_color_tool = tool({
  name: 'get_favorite_color',
  description: 'Get the favorite color given a users name',
  parameters: z.object({ username: z.string() }),
  execute: async (input) => {
    if (input.username === 'Ana Sillis') {
      return `peurigloss`;
    }
    return `UNKNOWN USER`;
  },
});