"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback = null,
}: InterviewCardProps & { feedback?: Feedback | null }) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  // Random cover image state
  const [coverImage, setCoverImage] = useState("/covers/default.jpg");

  useEffect(() => {
    setCoverImage(getRandomInterviewCover());
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl border border-[#484D4F] bg-gradient-to-br from-[#1A1C20] to-[#08090D] p-6 shadow-md hover:shadow-lg transition">
      {/* Badge top-right absolute */}
      <div className="absolute z-10 top-4 right-4">
        <Badge
          variant="outline"
          className="text-gray-300 bg-gray-900 border-gray-700"
        >
          {normalizedType}
        </Badge>
      </div>

      <div className="flex flex-col justify-between h-full gap-4">
        {/* Cover image smaller and aligned left */}
        <div className="flex justify-start">
          <Image
            src={coverImage}
            alt="Interview cover"
            width={64}
            height={64}
            className="object-cover rounded-full"
          />
        </div>

        {/* Header row with role only (badge moved outside) */}
        <div>
          <h3 className="text-lg font-semibold text-white capitalize">
            {role} Interview
          </h3>
        </div>

        {/* Date and score row */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Image src="/calendar.svg" width={16} height={16} alt="calendar" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/star.svg" width={16} height={16} alt="star" />
            <span>
              {feedback?.totalScore ? `${feedback.totalScore}/100` : "--/100"}
            </span>
          </div>
        </div>

        {/* Description text */}
        <p className="text-sm text-gray-400">
          {feedback?.finalAssessment ||
            "You haven't taken the interview yet. Take it now to improve your skills."}
        </p>

        {/* Footer with tech icons and button */}
        <div className="flex items-center justify-between mt-2">
          <DisplayTechIcons techStack={techstack} />
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-gray-800"
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}/take` // link to take interview
              }
            >
              {feedback ? "Check Feedback" : "Take Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
