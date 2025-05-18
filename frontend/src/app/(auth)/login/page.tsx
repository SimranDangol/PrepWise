"use client";

import AuthForm from "@/components/shared/AuthForm";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      router.replace("/");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthForm type="login" />;
};

export default LoginPage;
