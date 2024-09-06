import { getServerSession } from "next-auth";
import { db } from "../db";
import { hash } from "bcrypt";
import { User, UserOtpType, UserRole } from "@prisma/client";
import { generateUniqueAlphanumericOTP } from "@/utils/generateOtp";
import sendEmail from "./sendEmail";
import { createNotification } from "./notification";

import { generateOrUpdateOtp } from "./resetPasswordService";
import validator from "validator";

export async function getUserData() {
  const session = await getServerSession();

  if (session && session.user) {
    const email = session.user.email;
    if (email) {
      return await db.user.findUnique({
        where: { email },
      });
    }
  }

  throw new Error("User data not found");
}

export async function getVerifiedUserByEmail({ email }: { email: string }) {
  return await db.user.findUnique({
    where: { email, isVerified: true },
    include: {
      Subscription: true,
    },
  });
}

export async function registerUser({
  email,
  password,
  roleOfUser,
  confirmPassword,
}: {
  email: string;
  password: string;
  roleOfUser: string;
  confirmPassword: string;
}) {
  if (!email || !password || !confirmPassword) {
    return { error: "Fill Required." };
  }
  const userExist = await getUserByEmail(email);

  if (userExist) {
    return { error: "User already exists." };
  } else {
    if (validator.isEmail(email)) {
      if (password === confirmPassword) {
        if (validator.isStrongPassword(password)) {
          const hashedPassword = await hash(password, 10);
          const otp = generateUniqueAlphanumericOTP(4);
          const expirationTime = new Date();
          expirationTime.setMinutes(expirationTime.getMinutes() + 10);
          const result = await db.user.create({
            data: {
              email,
              password: hashedPassword,
              role:
                roleOfUser === UserRole.ADMIN ? UserRole.ADMIN : UserRole.USER,
              otps: {
                create: {
                  otp,
                  type: UserOtpType.REGISTRATION_OTP,
                  expirationTime,
                },
              },
            },
          });
          if (result) {
            const msg = {
              to: result.email!,
              subject: "Verify Your Account",
              templateId: process.env.VERIFICATION_EMAIL_TEMP_ID || "",
              dynamicTemplateData: {
                new_user: "user",
                otp,
                verification_link: `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${result.email}`,
              },
              text: "",
            };
            try {
              await sendEmail(msg);
            } catch (error) {
              if (error && typeof error === "object") {
                console.error("An error occurred:", error);
              } else {
                console.error("An unexpected error occurred:", error);
              }
            }
          }
          return { userData: result };
        } else {
          return {
            error:
              "Password must be at least 8 characters./Include at least one lowercase letter./One uppercase letter, one number./One special character.",
          };
        }
      } else {
        return { error: "Password does not match." };
      }
    } else {
      return { error: "Email is not valid.", data: null };
    }
  }
}

export async function getUserByEmail(email: string) {
  const result = await db.user.findUnique({
    where: { email },
    include: {
      Subscription: true,
    },
  });
  return result;
}

export async function getUserById(id: string) {
  if (!id) {
    return { error: "Please provide user ID." };
  }
  const result = await db.user.findUnique({
    where: { id },
    include: {
      Subscription: true,
    },
  });
  if (!result) return { error: "User not found" };
  else return result;
}

export async function verifyUser({
  email,
  verificationCode,
}: {
  email?: string;
  verificationCode?: string;
}) {
  if (!email) {
    return { error: "Invalid email." };
  }
  if (!verificationCode || verificationCode.length < 4) {
    return { error: "Please fill correct code." };
  }
  const user = await db.user.findUnique({
    where: {
      email: email,
      otps: {
        some: {
          otp: verificationCode,
        },
      },
    },
  });
  if (user) {
    const res = await db.user.update({
      where: { email },
      data: {
        isVerified: true,
        isActive: true,
      },
    });
    if (res) {
      const deleteRes = await db.userOtp.delete({
        where: { userId: res.id },
      });
      if (deleteRes) {
        const msg = {
          to: res.email,
          subject: "Successfully verified",
          templateId: process.env.SUCCESSFULLY_VERIFIED_TEMP_ID,
          dynamicTemplateData: {
            user_name: res.email,
            contact_email: "abc@mail.com",
          },
        };
        const msg_2 = {
          to: res.email,
          subject: "Welcome Sign Up",
          templateId: process.env.SIGNUP_WELCOME_TEMP_ID,
          dynamicTemplateData: {
            user_email: res.email,
          },
        };
        try {
          await sendEmail(msg);
          await sendEmail(msg_2);
          await createNotification({
            userId: user.id,
            message:
              "This is to confirm that your account with [Your Platform Name] has been successfully verified.",
          });
          await createNotification({
            userId: user.id,
            message: "Welcome to [Your Platform Name].",
          });
        } catch (error) {
          if (error.response && error.response.body) {
            console.log("SendGrid API Response:", error.response.body);
          }
        }
      }
      return { message: "Successfully verified." };
    } else {
      return { error: "Failed to update user." };
    }
  } else {
    return { error: "Verification code is incorrect." };
  }
}

export async function resendVerficationCode(reqData: User) {
  const userId = reqData.id;
  const otp = generateUniqueAlphanumericOTP(4);
  const type = UserOtpType.REGISTRATION_OTP;
  const result = await generateOrUpdateOtp(userId, otp, type);
  if (result) {
    const msg = {
      to: reqData.email,
      subject: "Verify Your Account",
      templateId: process.env.VERIFICATION_EMAIL_TEMP_ID,
      dynamicTemplateData: {
        new_user: "user",
        otp: result.otp,
        verification_link: `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${reqData.email}`,
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
  return result;
}

export async function updateProfile(rawFormData: any) {
  const { id, ...data } = rawFormData;
  if (!id) return { error: { id: "Id is required" } };

  let result;
  result = await db.user.update({
    where: { id },
    data,
  });

  if (
    result &&
    result.mobile_number &&
    result.country &&
    result.state &&
    result.city &&
    result.pincode
  ) {
    result = await db.user.update({
      where: { id },
      data: {
        isProfileComplete: true,
      },
    });
  }
  return result;
}
