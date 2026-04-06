import OpenAI from 'openai';

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required to initialize OpenAIService.');
    }
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Create a chat completion.
   * @param messages Array of message objects in the format { role: 'user' | 'assistant' | 'system', content: string }.
   * @param model The OpenAI model to use, e.g., 'gpt-4'.
   * @param options Optional parameters like temperature, max_tokens, etc.
   */
  async createChatCompletion(
    messages: any,
    model: string = 'gpt-4',
    options: Partial<OpenAI.Chat.ChatCompletionCreateParams> = {}
  ): Promise<OpenAI.Chat.ChatCompletion> {
    try {
      const response:any = await this.client.chat.completions.create({
        messages,
        model,
        ...options,
      });
      return response;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }

  /**
   * Stream a chat completion response.
   * @param messages Array of message objects in the format { role: 'user' | 'assistant' | 'system', content: string }.
   * @param model The OpenAI model to use, e.g., 'gpt-4'.
   * @param onData Callback to handle streamed data chunks.
   */
  async streamChatCompletion(
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
    model: string = 'gpt-4',
    onData: (chunk: string) => void
  ): Promise<void> {
    try {
      const stream = await this.client.chat.completions.create({
        messages,
        model,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        onData(content);
      }
    } catch (error) {
      console.error('Error streaming chat completion:', error);
      throw error;
    }
  }

  
}
