import express from "express";
import cors from "cors";
import {
  prisma
} from "@repo/db";

const app = express();
app.use(cors());



app.post('/project', async (req, res) => {
  const { prompt } = req.body;
  //@ts-ignore
  const userId = req.userId;
  const description: string = prompt.split("\n")[0];
  const project = await prisma.project.create({
    data: {
      description,
      userId,
      prompts: {
        create: {
          content: prompt,
        }
      }
    },
  });

  res.json({
    projectId: project.id
  })
})
