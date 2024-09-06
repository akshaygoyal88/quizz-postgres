import { generateUniqueAlphanumericOTP } from "@/utils/generateOtp";
import { getUserByEmail } from "./user";
import { UserOtpType } from "@prisma/client";
import sendEmail from "./sendEmail";
import cron from "node-cron";
import { db } from "@/db";
import validator from "validator";
import { hash } from "bcrypt";

export async function resetPasswordService({ email, req }: { email: string }) {
  const userData = await getUserByEmail(email);
  if (!userData) {
    return { error: "User not found:" };
  }
  const userId = userData.id;
  const otp = generateUniqueAlphanumericOTP(4);
  const type = UserOtpType.RESET_TOKEN;
  const otpRes = await generateOrUpdateOtp(userId, otp, type);
  if (userId) {
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${userId}/${otp}/change-password/?userId=${userId}&token=${otp}`;
    const msg = {
      to: userData.email,
      subject: "You have requested a password reset",
      templateId: process.env.RESETPASSWORD_EMAIL_TEMP_ID,
      dynamicTemplateData: {
        resetLink: resetLink,
      },
    };
    try {
      await sendEmail(msg);
    } catch (error) {
      if (error.response && error.response.body) {
        console.log("SendGrid API Response:", error.response.body);
      }
    }
  }

  return { message: "Successfully done" };
}

export const cleanupExpiredTokens = async () => {
  try {
    const currentDateTime = new Date();
    await db.userOtp.deleteMany({
      where: {
        expirationTime: {
          lt: currentDateTime,
        },
      },
    });
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    throw new Error("Error cleaning up expired tokens.");
  }
};

export const generateOrUpdateOtp = async (
  userId: string,
  otp: string,
  type: UserOtpType
) => {
  try {
    const created_at = new Date();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);

    const existingUserOtp = await db.userOtp.findUnique({
      where: { userId },
    });

    if (existingUserOtp) {
      const updatedUserOtp = await db.userOtp.update({
        where: { userId },
        data: { otp, type, expirationTime, createdAt: created_at },
      });

      return updatedUserOtp;
    } else {
      const newUserOtp = await db.userOtp.create({
        data: { userId, otp, type, expirationTime },
      });

      return newUserOtp;
    }
  } catch (error) {
    console.error("Error inserting/updating data:", error);
    throw new Error("Could not insert/update Reset Token otp details.");
  }
};

export async function changeUserPassword({
  newPassword,
  confirmPassword,
  userId,
  token,
}: {
  newPassword: string;
  confirmPassword: string;
  userId: string;
  token: string;
}) {
  if (!newPassword || !confirmPassword) {
    return { error: "*Missing required" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Password does not match." };
  }

  const otpRecord = await db.userOtp.findFirst({
    where: {
      userId,
      otp: token,
      type: "RESET_TOKEN",
    },
  });

  if (!otpRecord || isTokenExpired(otpRecord.createdAt)) {
    return { error: "Token expired" };
  }

  if (validator.isStrongPassword(confirmPassword)) {
    const hashedPassword = await hash(confirmPassword, 10);
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    const id = otpRecord?.id;
    await db.userOtp.delete({
      where: { id },
    });

    return { message: "Password successfully updated." };
  } else {
    const weakPasswordError =
      "Password must include lower & upper case,special characters, and a number..";
    return { error: weakPasswordError };
  }
}

function isTokenExpired(createdAt: Date) {
  const currentTime = new Date();
  const expiryTime = 10 * 60 * 1000;
  return createdAt.getTime() + expiryTime < currentTime.getTime();
}
