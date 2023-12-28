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

// export async function getUserData() {
//   const res = await fetch("/api/user/", {
//     method: "GET",
//   });
//   if (res.ok) {
//     const data = await res.json();
//     return data;
//   }
// }

// export async function getUserData(){
//   let userData;
//   try {
//     const res = await fetch("/api/user/", {
//       method: "GET",
//     });
//     if (res.ok) {
//       userData = await res.json();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export async function getUserByEmail(email) {
  console.log(email, "email in utils");
  try {
    const response = await fetch(`/api/getUserByEmail?email=${email}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user details");
  }
}
