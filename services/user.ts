import { getServerSession } from "next-auth";
import { db } from "../db";
import { hash } from "bcrypt";
import { User, UserOtpType, UserRole } from "@prisma/client";
import { generateUniqueAlphanumericOTP } from "@/utils/generateOtp";
import sendEmail from "./sendEmail";

// export const userProjection = {
//   id: true,
//   email: true,
//   role: true,
//   isVerified: true,
//   first_name: true,
//   last_name: true,
//   isActive: true,
//   createdAt: true,
//   updatedAt: true,
//   profile_pic: true,
//   isProfileComplete: true
// };

export async function getUserData() {
  const session = await getServerSession();

  if (session && session.user) {
    const email = session.user.email;
    if (email) {
      return await db.user.findUnique({
        where: { email }
      });
    }
  }

  throw new Error("User data not found");
}

export async function getVerifiedUserByEmail({ email }: { email: string }) {
  return await db.user.findUnique({
    where: { email, isVerified: true }
  });
}

export async function registerUser({
  email,
  password,
  roleOfUser
}: {
  email: string;
  password: string;
  roleOfUser: UserRole;
}) {
  const hashedPassword = await hash(password, 10);
  const otp = generateUniqueAlphanumericOTP(4);
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10);
  const result =  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      role: roleOfUser,
      otps: {
        create: {
          otp,
          type: UserOtpType.REGISTRATION_OTP,
          expirationTime
        }
      }
    }
  });
  if(result){
    const msg = {
      to: result.email,
      subject: 'Verify Your Account',
      templateId: process.env.VERIFICATION_EMAIL_TEMP_ID,
      dynamicTemplateData: {
        new_user: 'user',
        otp
      }
    };
    try {
      await sendEmail(msg);
    } catch (error) {
      if (error.response && error.response.body) {
        console.log('SendGrid API Response:', error.response.body);
      }
    }
  }    
  return result;
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({
    where: { email }
  });
}

export async function getUserById(id: string) {
  return await db.user.findUnique({
    where: { id }
  });
}
