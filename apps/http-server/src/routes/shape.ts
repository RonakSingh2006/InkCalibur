import { Router, Request, Response } from "express";
import { prisma } from "@repo/db/client";

const router:Router = Router();

// Get Shapes
router.get("/shapes/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    const room = await prisma.room.findFirst({
      where: { slug },
    });

    if (!room) {
      return res.status(404).send({ message: "Invalid room name" });
    }

    const shapes = await prisma.shape.findMany({
      where: {
        roomId: room.id,
      },
    });

    res.send({
      message: "Shapes loaded",
      shapes,
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

export default router;