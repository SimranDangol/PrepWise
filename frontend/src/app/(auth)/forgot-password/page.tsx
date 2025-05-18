"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email: data.email });
      toast.success("Reset link sent to your email");
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-[#1A1C20]/80 p-6 rounded-xl shadow">
      <h2 className="text-lg text-white font-semibold mb-4">Forgot Password</h2>
      {success ? (
        <p className="text-green-400 text-sm">
          Reset link sent. Please check your email.
        </p>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              {...form.register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full text-sm rounded-md border px-4 py-2 bg-transparent text-white placeholder-gray-400 outline-none border-[#252830] focus:border-[#e4e3e5]"
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button className="w-full bg-[#7B61FF] hover:bg-[#6B52E0] text-white">
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
}
