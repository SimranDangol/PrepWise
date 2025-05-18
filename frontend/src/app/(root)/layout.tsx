"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser } from "@/redux/store/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearUser());
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-20 py-4 border-b border-[#1a1a1a]">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 text-xl font-semibold cursor-pointer">
            <Image
              src="/logo.svg"
              alt="logo"
              height={38}
              width={38}
              className="mr-1"
            />
            <span className="ml-1">PrepWise</span>
          </div>
        </Link>

        {/* Avatar + Popover */}
        {user?.email && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-10 h-10 p-0 rounded-full">
                <Avatar>
                  <AvatarImage
                    src={user.image || "/default-avatar.png"}
                    alt="User"
                  />
                  <AvatarFallback className="bg-[#2a2a2a] text-white">
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              align="end"
            >
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  {user.fullName || user.email}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {user.email}
                </div>
                <Button
                  variant="destructive"
                  className="flex items-center w-full gap-2 mt-3"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </header>

      {/* Main content */}
      <main className="px-4 sm:px-6 md:px-10">{children}</main>
    </div>
  );
};

export default RootLayout;
