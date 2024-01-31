import { generateUniqueAlphanumericOTP } from "@/utils/generateOtp";
import { getUserByEmail } from "./user";
import { UserOtpType } from "@prisma/client";
import sendEmail from "./sendEmail";
import cron from "node-cron";
import { db } from "@/db";



export async function resetPasswordService({ email, req }: { email: string, }) {
  const userData = await getUserByEmail(email);
  if (!userData) {
    return { error: "User not found:" };
  }
  const userId = userData.id;
  const otp = generateUniqueAlphanumericOTP(4);
  const type =  UserOtpType.RESET_TOKEN
  const otpRes = await generateOrUpdateOtp(userId, otp, type)
  if (userId) {
        const resetLink = `/reset-password/${userId}/${otp}/change-password/?userId=${userId}&token=${otp}`;
        console.log("Reset link:", resetLink);
        const msg = {
            to: userData.email,
            subject: 'You have requested a password reset',
            templateId: process.env.RESETPASSWORD_EMAIL_TEMP_ID,
            dynamicTemplateData: {
                resetLink: resetLink
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

      return {message: "Successfully done"}
      
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
      console.log("Expired tokens cleaned up successfully.");
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
      throw new Error("Error cleaning up expired tokens.");
    }
  };
  
  // Schedule cron job for cleanup
  cron.schedule("* * * * *", cleanupExpiredTokens);


  export const generateOrUpdateOtp = async (userId: string, otp: string, type: string) => {
    try {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    
        const existingUserOtp = await db.userOtp.findUnique({
          where: { userId },
        });
    
        if (existingUserOtp) {
          const updatedUserOtp = await db.userOtp.update({
            where: { userId },
            data: { otp, type, expirationTime },
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