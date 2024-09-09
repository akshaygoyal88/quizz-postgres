import { NextRequest, NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";
import { db } from "@/db";
import { returnResponse } from "@/utils/generateOtp";

// Initialize S3 client
const client_s3 = new S3({
  region: process.env.AWS_REGION || "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

// Handle GET request
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email not provided" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return NextResponse.json({ user });
    } else {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle POST request
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file: any = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    const fileKey = `${Date.now()}-image.jpg`;
    const fileParams = {
      Bucket: process.env.BUCKET_NAME, // Ensure this environment variable is set
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    };

    try {
      // Upload the object to S3
      const uploadResponse = await client_s3.upload(fileParams).promise();
      const url = client_s3.getSignedUrl("getObject", {
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
        Expires: 60 * 60 * 24 * 7, // URL expiration time
      });

      return NextResponse.json({
        message: "Image uploaded successfully",
        url: uploadResponse.Location,
      });
    } catch (error) {
      console.error("Error uploading to S3:", error);
      return NextResponse.json(
        { error: "Error uploading to S3" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
