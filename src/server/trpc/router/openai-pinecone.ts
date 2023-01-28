import { ulid } from "ulid";
import { z } from "zod";
import { prisma } from "../../../server/db/client";
import { createEmbedding } from "../../../utils/openai";
import { pinecone } from "../../../utils/pinecone";
import { protectedProcedure, router } from "../trpc";
/*import { runner } from "../../ark_sample";

console.log("runner length", runner.length);
let didRun = false;

const syncAll = async () => {
  let k = 0;
  for await (const contents of runner) {
    const { prompt, completion } = contents;
    const id = ulid();
    try {
      const embedding = await createEmbedding(prompt + " " + completion);
      const vectorEmbedding = embedding.data[0]?.embedding ?? [];
      await pinecone.upsert({
        vectors: [
          {
            id,
            values: vectorEmbedding,
            metadata: {
              userId: "cldedmn3m0000wnf1vnm3pzho",
              text:
                completion.length > 700 ? completion.slice(0, 700) : completion,
              title: prompt,
            },
          },
        ],
      });

      await prisma.library.create({
        data: {
          title: prompt,
          description: completion,
          embeddingId: id,
          userId: "cldedmn3m0000wnf1vnm3pzho",
        },
      });
    } catch (e) {
      console.error(e);
    }
    console.log("done", k);
    k++;
  }
};

if (!didRun) {
  didRun = true;
  // syncAll();
}
*/
export const openAiPinecone = router({
  upsertEmbedding: protectedProcedure
    .input(z.object({ text: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { text, title } = input;
      const id = ulid();
      console.log(id, text);
      const embedding = await createEmbedding(text);
      const vectorEmbedding = embedding.data[0]?.embedding ?? [];
      console.log(embedding, vectorEmbedding);
      console.log(ctx.session.user.id, text, title);

      await pinecone.upsert({
        vectors: [
          {
            id,
            values: vectorEmbedding,
            metadata: {
              id: ctx.session.user.id,
              name: title,
              url: "",
            },
          },
        ],
      });

      /* await prisma.library.create({
        data: {
       
          description: text,
          embeddingId: id,
          userId: "cldedmn3m0000wnf1vnm3pzho", //ctx.session.user.id,
        },
      });*/

      return {
        test: input.text,
        user: ctx.session.user.email,
      };
    }),
  searchEmbedding: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const text = input.text;
      const embedding = await createEmbedding(text);
      const vectorEmbedding = embedding.data[0]?.embedding ?? [];
      const pineconeSearch = await pinecone.query({
        topK: 5,
        includeMetadata: true,
        vector: vectorEmbedding,
        filter: {},
        namespace: "legali",
      });

      const externalIds = pineconeSearch.matches.map((v) => v.metadata.id);

      const library = await prisma.library.findMany({
        where: {
          externalId: { in: externalIds },
        },
      });
      console.log(library);
      return {
        test: input.text,
        user: ctx.session.user.email,
        pineconeSearch,
        library,
        externalIds,
      };
    }),
});
