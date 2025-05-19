import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { google } from "@ai-sdk/google";
import { prisma } from "../utils/prisma";
import { ApiError } from "../utils/apiError";
import { generateText } from "ai";

// GET
export const getStatus = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: "Thank you!",
  });
};

const genAI = google("gemini-2.0-flash-001");

// Helper function to pick a random cover image
const getRandomInterviewCover = () => {
  const covers = [
    "https://source.unsplash.com/random/800x600?interview",
    "https://source.unsplash.com/random/800x600?career",
    "https://source.unsplash.com/random/800x600?job",
  ];
  return covers[Math.floor(Math.random() * covers.length)];
};

export const generateInterview = asyncHandler(
  async (req: Request, res: Response) => {
    const { type, role, level, techstack, amount, userId } = req.body as {
      type: string;
      role: string;
      level: string;
      techstack: string;
      amount: string;
      userId: string;
    };

    if (!type || !role || !level || !techstack || !amount || !userId) {
      throw new ApiError(400, "All fields are required");
    }

    try {
      const prompt = `Prepare questions for a job interview.
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      The focus between behavioural and technical questions should lean towards: ${type}.
      The amount of questions required is: ${amount}.
      Please return only the questions, without any additional text.
      The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      Return the questions formatted like this:
      ["Question 1", "Question 2", "Question 3"]`;

      const { text: questions } = await generateText({
        model: genAI,
        prompt,
      });

      const parsedQuestions: string[] = JSON.parse(questions);

      const interview = await prisma.interview.create({
        data: {
          role,
          type,
          level,
          techstack: techstack.split(",").map((t: string) => t.trim()),
          questions: parsedQuestions,
          userId,
          finalized: true,
          coverImage: getRandomInterviewCover(),
          createdAt: new Date(),
        },
      });

      return res.status(201).json({
        success: true,
        interview,
      });
    } catch (error) {
      console.error("Error generating interview:", error);
      throw new ApiError(500, "Failed to generate interview questions");
    }
  }
);
