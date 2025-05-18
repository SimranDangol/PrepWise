"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, Eye, EyeOff, Loader2 } from "lucide-react";
import FormField from "./FormField";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { setUser } from "@/redux/store/userSlice";
import { useDispatch } from "react-redux";

type FormType = "login" | "register";

const authFormSchema = (type: FormType) => {
  return z.object({
    fullName:
      type === "register"
        ? z.string().min(3, "Name must be at least 3 characters")
        : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    profilePicture: z.any().optional(),
    resume: z.any().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const isLogin = type === "login";
  const formSchema = authFormSchema(type);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedProfile, setUploadedProfile] = useState<File | null>(null);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const dispatch = useDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      profilePicture: undefined,
      resume: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isLogin) {
      await handleLogin(data);
    } else {
      await handleSignup(data);
    }
  };

  const handleLogin = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const userData = response.data.data.user;

      dispatch(setUser(userData));
      toast.success("Login successful");

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (!uploadedProfile) {
        toast.error("Profile picture is required");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", data.fullName || "");
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("image", uploadedProfile);
      if (uploadedResume) {
        formData.append("resume", uploadedResume);
      }

      const response = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registration successful");
      sessionStorage.setItem("userEmail", data.email);
      setTimeout(() => {
        router.push("/verify");
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const UploadField = ({
    label,
    type,
    name,
    value,
    onChange,
  }: {
    label: string;
    type: "image" | "pdf";
    name: string;
    value: File | null;
    onChange: (file: File | null) => void;
  }) => {
    return (
      <div className="space-y-2">
        <label className="text-sm text-gray-400">{label}</label>
        <label className="block w-full bg-[#252830] rounded-md cursor-pointer hover:border-[#444]">
          <div className="flex items-center justify-center px-4 py-2">
            <Upload size={16} className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-400 truncate max-w-[250px]">
              {value?.name ||
                `Upload ${
                  type === "image" ? "an image" : "a PDF file (optional)"
                }`}
            </span>
          </div>
          <input
            type="file"
            accept={type === "image" ? "image/*" : "application/pdf"}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onChange(file);
              form.setValue(name as any, file);
            }}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[420px] rounded-xl border border-[#08090D] bg-[#1A1C20]/80 backdrop-blur-md shadow-md">
      <div className="p-6 sm:p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-xl font-semibold text-white">PrepWise</h2>
          </div>
          <h3 className="text-sm text-center text-gray-400">
            Practice job interviews with AI
          </h3>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <FormField
                control={form.control}
                name="fullName"
                label="Full name"
                placeholder="Your name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@gmail.com"
              type="email"
            />

            {/* Password Field with Toggle */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-gray-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...form.register("password")}
                  placeholder="Enter your password"
                  className="w-full text-sm rounded-md border px-4 py-2 bg-transparent text-white placeholder-gray-400 outline-none border-[#252830] focus:border-[#e4e3e5]"
                />
                <div
                  className="absolute text-gray-400 -translate-y-1/2 cursor-pointer right-3 top-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {form.formState.errors.password.message as string}
                </p>
              )}
            </div>

            {/* Upload fields */}
            {!isLogin && (
              <>
                <UploadField
                  label="Profile picture"
                  type="image"
                  name="profilePicture"
                  value={uploadedProfile}
                  onChange={setUploadedProfile}
                />
                <UploadField
                  label="Resume (optional)"
                  type="pdf"
                  name="resume"
                  value={uploadedResume}
                  onChange={setUploadedResume}
                />
              </>
            )}

            {/* Forgot password link */}
            {isLogin && (
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-red-400">
                  Forgot Password?
                </Link>
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-[#7B61FF] text-white hover:bg-[#6B52E0] mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {isLogin ? "Signing In..." : "Creating account..."}
                  </span>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
        </Form>

        {/* Toggle link */}
        <p className="mt-4 text-sm text-center text-gray-400">
          {isLogin ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isLogin ? "/login" : "/register"}
            className="ml-1 text-[#7B61FF] font-medium hover:text-[#6B52E0]"
          >
            {!isLogin ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
