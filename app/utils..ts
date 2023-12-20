// utils.ts

export function generateUniqueAlphanumericOTP(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const otpLength = length || 4;
    const otps: Set<string> = new Set();
  
    while (true) {
      let newOTP = "";
  
      for (let i = 0; i < otpLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        newOTP += characters.charAt(randomIndex);
      }
  
      if (!otps.has(newOTP)) {
        otps.add(newOTP);
        return newOTP;
      }
    }
  }
  