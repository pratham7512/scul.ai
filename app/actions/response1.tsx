require("dotenv").config();
import { ConversationChain } from "langchain/chains";
import { ChatGroq } from "@langchain/groq";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";

const chat = new ChatGroq({
    modelName:"llama3-70b-8192",
    apiKey: "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"
 });

const chatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "create postgresql query for the given input instruction. Return only postgresql query nothing else only the postgreSQL syntax so that i can directly copy paste it don't put the quotes arround syntax also."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const chain = new ConversationChain({
  memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  prompt: chatPrompt,
  llm: chat,
});

export default async function groqResponse(input:string) {
  const response = await chain.call({ input: input });
  return response.response;
}
