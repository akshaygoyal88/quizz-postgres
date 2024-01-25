// pages/api/upload-image.ts
import { db } from "@/db";
import { returnResponse } from "@/utils/generateOtp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromBase64 } from "@aws-sdk/util-base64";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
// import S3 from "aws-sdk/clients/s3";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// const client_s3 = new S3({
//   region: process.env.AWS_REGION || "ap-south-1",
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   signatureVersion: "v4",
// });

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return returnResponse(
      { error: "Email not provided" },
      400,
      "application/json"
    );
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return returnResponse({ user }, 200, "application/json");
    } else {
      return returnResponse(
        { error: "User not found." },
        404,
        "application/json"
      );
    }
  } catch (error) {
    return returnResponse(
      { error: "Internal Server Error" },
      500,
      "application/json"
    );
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      const { file } = req.body;
      console.log(req.body, "req.bodyreq.body");

      // Decode base64 image data
      const chunks = [];

      // Collect chunks of the stream
      for await (const chunk of req.body) {
        chunks.push(chunk);
      }

      // Concatenate chunks to get the complete buffer
      const buffer = Buffer.concat(chunks);

      // Now, you can use the buffer as needed
      const imageBuffer = fromBase64(buffer.toString("base64"));

      //   // Set S3 upload parameters
      const s3Params = {
        Bucket: "codecaffiene",
        Key: `${Date.now()}-image.jpg`, // Customize the key as needed
        Body: imageBuffer,
        ContentType: "image/jpeg", // Adjust content type based on your image type
        ACL: "public-read", // Adjust permissions as needed
        Expires: 60 * 60 * 24 * 7,
      };

      //   // Upload image to S3
      await s3Client.send(new PutObjectCommand(s3Params));
      //   console.log(req.body.type, "req.body.typereq.body.type");
      //   const fileParams = {
      //     Bucket: process.env.BUCKET_NAME,
      //     Key: `${Date.now()}-image.jpg`,
      //     Body: imageBuffer,
      //     // Expires: 600,
      //     ContentType: "image/jpeg",
      //     Expires: 60 * 60 * 24 * 7,
      //   };
      //   await client_s3.putObject(new PutObjectCommand(fileParams)).promise();
      //   await client_s3.send(new PutObjectCommand(s3Params));

      //   const url = await client_s3.getSignedUrlPromise("putObject", fileParams);
      const s3Url = `https://codecaffiene.s3-ap-south-1.amazonaws.com/${s3Params.Key}`;

      return returnResponse(
        { message: "Image uploaded successfully", url: s3Url },
        201,
        "application/json"
      );
      //   return res
      //     .status(200)
      //     .json({ message: "Image uploaded successfully", s3Url });
    }
    return returnResponse(
      { error: "Method Not Allowed" },
      405,
      "application/json"
    );
    // return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("Error uploading image:", error);
    return returnResponse(
      { error: "Internal Server Error", message: error.message },
      500,
      "application/json"
    );
    // return res.status(500).json({ error: "Internal Server Error" });
  }
}
