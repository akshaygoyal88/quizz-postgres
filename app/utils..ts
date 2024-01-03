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

interface ResponseData {
  [key: string]: any;
}

export function returnResponse(
  data: ResponseData,
  statusCode: number,
  contentType: string
): Response {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      "Content-Type": contentType,
    },
  });
}
