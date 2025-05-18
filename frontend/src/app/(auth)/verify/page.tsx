"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/shared/FormField";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

const verificationSchema = z.object({
  verificationCode: z
    .string()
    .regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const VerifyPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail");
    if (!storedEmail) {
      toast.error("No email found. Please register first.");
      setTimeout(() => {
        router.push("/register");
      }, 1000);
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async (data: VerificationFormData) => {
    if (!email) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/verify-email", {
        email,
        verificationCode: data.verificationCode.trim(),
      });

      toast.success("Email verified successfully!");
      sessionStorage.removeItem("userEmail");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Verification failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || resendCooldown > 0) return;

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/resend-verification", {
        email,
      });
      toast.success("Verification code sent successfully");
      setResendCooldown(60);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to resend verification code"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] rounded-xl border border-[#08090D] bg-[#1A1C20]/80 backdrop-blur-md shadow-md">
      <div className="p-6 sm:p-8">
        {/* Logo & Heading */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-xl font-semibold text-white">PrepWise</h2>
          </div>
          <h3 className="text-lg font-medium text-center text-white">
            Verify your email
          </h3>
          <p className="text-sm text-center text-gray-400">
            We sent a 6-digit verification code to{" "}
            <span className="text-white">{email}</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="verificationCode"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              type="text"
            />

            <Button
              className="w-full bg-[#7B61FF] text-white hover:bg-[#6B52E0]"
              type="submit"
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || isLoading}
              className={`text-[#7B61FF] font-medium hover:text-[#6B52E0] ${
                resendCooldown > 0 || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend Code"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
