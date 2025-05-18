import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendResetPasswordEmail, sendVerificationEmail } from "../utils/mailer";
import { ApiError } from "../utils/apiError";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { uploadToCloudinary } from "../middlewares/upload";

//Access Token
const generateAccessToken = (userId: string): string => {
  // Validate environment variables
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // Type-safe expiresIn value
  const expiresIn = (process.env.JWT_EXPIRES_IN as string) || "1h";

  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn,
    } as jwt.SignOptions // Explicitly type the options
  );
};

const generateRefreshToken = (userId: string): string => {
  // Validate environment variables
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in environment variables"
    );
  }

  // Type-safe expiresIn value
  const refreshExpiresIn =
    (process.env.JWT_REFRESH_EXPIRES_IN as string) || "7d";

  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: refreshExpiresIn,
  } as jwt.SignOptions);
};

// REGISTER

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "Full name, email, and password are required");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const files = req.files as unknown as {
    [fieldname: string]: Express.Multer.File[];
  };

  const imageFile = files?.image?.[0];
  const resumeFile = files?.resume?.[0];

  let imageUrl: string | null = null;
  let resumeUrl: string | null = null;

  if (imageFile) {
    const uploadedImage = await uploadToCloudinary(
      imageFile.path,
      "user-images"
    );
    imageUrl = uploadedImage.secure_url;
  }

  if (resumeFile) {
    const uploadedResume = await uploadToCloudinary(
      resumeFile.path,
      "user-resumes"
    );
    resumeUrl = uploadedResume.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashedCode = await bcrypt.hash(verificationCode, 10);
  const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const lastVerificationSentAt = new Date();

  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      image: imageUrl,
      resume: resumeUrl,
      verificationCode: hashedCode,
      verificationExpiry,
      lastVerificationSentAt,
    },
  });

  await sendVerificationEmail(email, verificationCode);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        image: newUser.image,
        resume: newUser.resume,
        isVerified: newUser.isVerified,
      },
      "User registered successfully. Verification email sent."
    )
  );
});

// LOGIN
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  const { password: _, refreshToken: __, ...userWithoutSensitiveInfo } = user;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userWithoutSensitiveInfo,
        accessToken,
      },
      "Login successful"
    )
  );
});

// VERIFY EMAIL
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    throw new ApiError(400, "Email and verification code are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.verificationExpiry || user.verificationExpiry < new Date()) {
    throw new ApiError(400, "Verification code has expired");
  }

  const isCodeValid = await bcrypt.compare(
    verificationCode,
    user.verificationCode || ""
  );
  if (!isCodeValid) {
    throw new ApiError(400, "Invalid verification code");
  }

  await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      verificationCode: null,
      verificationExpiry: null,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Email successfully verified",
  });
});

// RESEND VERIFICATION CODE
export const resendVerificationCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "User is already verified");
    }

    const now = new Date();
    if (!user.lastVerificationSentAt) {
      throw new ApiError(400, "Verification code send time not found");
    }

    const timeDiff =
      (now.getTime() - new Date(user.lastVerificationSentAt).getTime()) / 1000;

    if (timeDiff < 60) {
      throw new ApiError(
        400,
        "Please wait before requesting a new verification code"
      );
    }

    const newVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedCode = await bcrypt.hash(newVerificationCode, 10);
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        verificationCode: hashedCode,
        verificationExpiry,
        lastVerificationSentAt: now,
      },
    });

    await sendVerificationEmail(email, newVerificationCode);

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  }
);

// REFRESH TOKEN
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { id: string };

      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
          refreshToken: refreshToken,
        },
      });

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      const newAccessToken = generateAccessToken(user.id);

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            accessToken: newAccessToken,
          },
          "Access token refreshed successfully"
        )
      );
    } catch (error) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }
  }
);

// LOGOUT
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

// GET CURRENT USER
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User details retrieved successfully"));
  }
);

//Forgot-password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry,
      },
    });

    await sendResetPasswordEmail(email, resetToken);

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password reset link sent to your email")
      );
  }
);

//Reset-password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ApiError(400, "Token and new password are required");
    }

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset successful"));
  }
);
