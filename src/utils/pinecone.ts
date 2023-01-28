import { PineconeClient } from "pinecone-client";

export type Metadata = {
  name: string;
  url: string;
  id: string;
};

export const pinecone = new PineconeClient<Metadata>({
  apiKey: process.env.PINECONE_API_KEY,
  baseUrl: process.env.PINECONE_BASE_URL,
});
