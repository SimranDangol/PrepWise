import React from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 py-8">
      {children}
    </div>
  );
};

export default AuthLayout;