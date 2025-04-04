import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import cors from "cors";
import { prisma } from "@repo/db";
import { auth } from "./middleware/auth-middleware";

const app = express();
app.use(cors());

app.get("/projects", auth, async (req, res, next) => {
  const userId = req.userId;

  const projects = await prisma.project.findMany({
    where: {
      userId,
    },
  });

  res.json({
    projects,
  });
});

app.post("/project", auth, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId!;
  const description: string = prompt.split("\n")[0];
  const project = await prisma.project.create({
    data: {
      description,
      userId,
      prompts: {
        create: {
          content: prompt,
        },
      },
    },
  });

  res.json({
    projectId: project.id,
  });
});

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route does not exists" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({ message: " Internal Server Error" });
});

app.listen(process.env.PORT!, () => {
  console.log("server started at port ", process.env.PORT!);
});
