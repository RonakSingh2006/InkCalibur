import { Router, Request, Response } from "express";
import { prisma } from "@repo/db/client";

const router:Router = Router();

// Get Shapes
router.get("/shapes/:inviteCode", async (req, res) => {
  const inviteCode = req.params.inviteCode;

  try {
    const room = await prisma.room.findFirst({
      where: { inviteCode },
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