import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse, nanoid } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, intervieweeData } = await req.json();

  console.log("Time of request: " + new Date().toISOString());
  console.log("interview tokenId" + intervieweeData.tokenId);
  console.log("interviewee email" + intervieweeData.email);
  
  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      const title =messages[0].content.substring(0, 100)
      const createdAt = Date.now()
      const id = nanoid();
      const path = `/chat/${id}`
      const payload = {
        tokenId: intervieweeData.tokenId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      console.log("response payload: " + JSON.stringify(payload, null, 2));
    }
  })
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
