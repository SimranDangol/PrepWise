"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { dummyInterviews } from "../../../constants";
import InterviewCard from "@/components/shared/InterviewCard";

const HomePage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user?.id) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user?.id) {
    return <p className="text-white">Redirecting...</p>;
  }

  return (
    <div className="min-h-screen px-6 py-12 text-white bg-[#0f0f0f]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#1e1e2f] to-[#121212] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="max-w-xl">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h1>
          <p className="mb-6 text-gray-300">
            Practice real interview questions & get instant feedback.
          </p>
          <Button
            asChild
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-full"
          >
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        {/* Robot Image */}
        <div className="relative w-[300px] h-[300px]">
          <Image
            src="/robot.png"
            alt="Robot Interview Assistant"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </section>

      {/* Interviews Section */}
      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">Your Interviews</h2>

        {dummyInterviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No interviews found. Start one now!</p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-semibold">Your Interviews</h2>

        {dummyInterviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dummyInterviews.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No interviews found. Start one now!</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;
