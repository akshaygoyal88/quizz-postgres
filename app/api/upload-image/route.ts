// pages/api/upload-image.ts
import { db } from "@/db";
import { returnResponse } from "@/utils/generateOtp";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";

const client_s3 = new S3({
  region: process.env.AWS_REGION || "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

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
      const formData = await req.formData();
      console.log(formData, "formDataformData");
      const file = formData.get("file");

      console.log(req.body, "req.bodyreq.body", file);
      if (!file) {
        return NextResponse.json(
          { error: "No files received." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replaceAll(" ", "_");
      console.log(filename);
      // Decode base64 image data
      const chunks = [];

      // Collect chunks of the stream
      for await (const chunk of req.body) {
        chunks.push(chunk);
      }

      const fileKey = `${Date.now()}-image.jpg`;
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      };

      try {
        // Upload the object to S3
        const uploadResponse = await client_s3.upload(fileParams).promise();
        console.log("Upload successful:", uploadResponse);

        // Now, you can use the S3 URL or generate a pre-signed URL if needed
        const url = client_s3.getSignedUrl("getObject", {
          Bucket: process.env.BUCKET_NAME,
          Key: fileKey,
          Expires: 60 * 60 * 24 * 7, // URL expiration time
        });

        console.log("Pre-signed URL:", url);
        return returnResponse(
          {
            message: "Image uploaded successfully",
            url: uploadResponse.Location,
          },
          201,
          "application/json"
        );
      } catch (error) {
        console.error("Error uploading to S3:", error);
      }

      return returnResponse(
        { message: "Image uploaded successfully", url: "urrl" },
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
