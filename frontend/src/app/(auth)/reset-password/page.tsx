"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  newPassword: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[0-9]/, "Include a number")
    .regex(/[^A-Za-z0-9]/, "Include a special character"),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!token) {
      toast.error("Missing token");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword: data.newPassword,
      });
      toast.success("Password reset successful");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-[#1A1C20]/80 p-6 rounded-xl shadow">
      <h2 className="text-lg text-white font-semibold mb-4">Reset Password</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <label className="text-sm text-gray-400">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...form.register("newPassword")}
            placeholder="Enter new password"
            className="w-full text-sm rounded-md border px-4 py-2 bg-transparent text-white placeholder-gray-400 outline-none border-[#252830] focus:border-[#e4e3e5] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-9 right-3 text-gray-400"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {form.formState.errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.newPassword.message}
            </p>
          )}
        </div>
        <Button
          className="w-full bg-[#7B61FF] hover:bg-[#6B52E0] text-white"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
