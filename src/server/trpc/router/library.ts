import { protectedProcedure, router } from "../trpc";

export const libraryRouter = router({
  getMyLibrary: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.library.findMany({
      where: {
        userId: "cldedmn3m0000wnf1vnm3pzho", //ctx.session.user.id,
      },
    });
  }),
});
