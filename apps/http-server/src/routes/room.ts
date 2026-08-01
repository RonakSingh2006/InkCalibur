import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { Auth } from "../middlewares/auth";
import { RoomSchema, JoinRoomSchema } from "@repo/common/schema";
import { prisma } from "@repo/db/client";
import { isMonthQuery, monthStart, monthEnd } from "../utils/search";

const router:Router = Router();

// Create Room
router.post("/room", Auth, async (req: Request, res: Response) => {
  const result = RoomSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Incorrect Input",
      error: result.error,
    });
  }

  const userId = req.userId;
  if (!userId) {
    return res.status(403).send({ message: "Unauthorized" });
  }
  const { name, visibility, password } = result.data;

  try {
    const valid = await prisma.room.findFirst({
      where: {
        slug: name,
        adminId: userId,
      },
    });

    if (valid) {
      return res.status(409).send({ message: "Room Already exists" });
    }

    const inviteCode = nanoid(12);

    const hashedPassword = visibility === "PRIVATE" && password
      ? await bcrypt.hash(password, 10)
      : null;

    const room = await prisma.room.create({
      data: {
        slug: name,
        adminId: userId,
        visibility,
        password: hashedPassword,
        inviteCode,
      },
    });

    res.send({
      message: "Room Created",
      roomId: room.id,
      inviteCode: room.inviteCode,
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

// Get all rooms for admin
router.get("/rooms", Auth, async (req: Request, res: Response) => {
  const adminId = req.userId;

  try {
    const rooms = await prisma.room.findMany({
      where: {
        adminId,
      },
    });

    res.send({
      rooms,
      message: "Sucessfully got data",
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

// Search rooms
router.get("/rooms/search", Auth, async (req: Request, res: Response) => {
  const query = (req.query.q as string) || "";
  const adminId = req.userId;

  try {
    const where: any = { adminId };

    if (query) {
      const orConditions: any[] = [
        { slug: { contains: query, mode: "insensitive" } },
      ];

      // Year search
      if (query.match(/^\d{4}$/)) {
        orConditions.push({
          createdAt: {
            gte: new Date(`${query}-01-01T00:00:00.000Z`),
            lt: new Date(`${Number(query) + 1}-01-01T00:00:00.000Z`),
          },
        });
      }

      // Month search
      if (isMonthQuery(query)) {
        orConditions.push({
          createdAt: {
            gte: monthStart(query),
            lt: monthEnd(query),
          },
        });
      }

      // Date search (YYYY-MM-DD)
      if (query.match(/^\d{4}-\d{2}-\d{2}$/)) {
        orConditions.push({
          createdAt: {
            gte: new Date(`${query}T00:00:00.000Z`),
            lt: new Date(`${query}T23:59:59.999Z`),
          },
        });
      }

      where.OR = orConditions;
    }

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.send({ rooms });
  } catch (error) {
    res.status(403).send({ message: "DB failure", error });
  }
});

// Get room info by invite code (for join page)
router.get("/room/invite/:inviteCode", async (req: Request, res: Response) => {
  const inviteCode = req.params.inviteCode;

  try {
    const room = await prisma.room.findFirst({
      where: { inviteCode },
    });

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.send({
      slug: room.slug,
      visibility: room.visibility,
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

// Join room by invite code
router.post("/join", async (req: Request, res: Response) => {
  const result = JoinRoomSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).send({
      message: "Incorrect Input",
      error: result.error,
    });
  }

  const { inviteCode, password } = result.data;

  try {
    const room = await prisma.room.findFirst({
      where: { inviteCode },
    });

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

    // If room is private
    if (room.visibility === "PRIVATE") {
      if (!password) {
        return res.status(403).send({ message: "Password required" });
      }

      const valid = await bcrypt.compare(password, room.password || "");
      if (!valid) {
        return res.status(403).send({ message: "Invalid room password" });
      }
    }

    res.send({
      message: "Room joined",
      roomId: room.id,
      slug: room.slug,
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

// Get roomId by invite code
router.get("/roomId/:inviteCode", async (req, res) => {
  const inviteCode = req.params.inviteCode;

  try {
    const room = await prisma.room.findFirst({
      where: { inviteCode },
    });

    if (!room) {
      return res.status(404).send({ message: "Room Does not exsists" });
    }

    res.send({
      roomId: room.id,
      inviteCode: room.inviteCode,
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

// Check user authentication
router.get("/me", Auth, (req, res) => {
  res.send({
    message: "Authenticated",
  });
});

// Delete room
router.delete("/room/:slug", Auth, async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const userId = req.userId;

  if (!slug || !userId) {
    return res.status(403).send({ message: "Unauthorized" });
  }

  try {
    await prisma.room.delete({
      where: {
        slug_adminId: {
          slug,
          adminId: userId,
        },
      },
    });

    res.send({
      message: "Sucesss",
    });
  } catch (error) {
    res.status(403).send({
      message: "DB failure",
      error,
    });
  }
});

export default router;