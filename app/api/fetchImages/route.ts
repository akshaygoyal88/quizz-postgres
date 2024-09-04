import S3 from "aws-sdk/clients/s3";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client_s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    });

    const bucket = {
      // Bucket: process.env.BUCKET_NAME,
      Bucket: "sdfdsfdsgfdhfdh",
    };
    return "";
    return new Promise((resolve, reject) => {
      client_s3.listObjectsV2(bucket, (err, data) => {
        if (err) {
          console.error("Error fetching images from S3:", err);
          reject({ error: "Error fetching images from S3" });
          return;
        }

        const images =
          data.Contents?.map((object) => ({
            title: object.Key,
            value: `https://${bucket.Bucket}.s3.amazonaws.com/${object.Key}`,
          })) || [];
        resolve(NextResponse.json(images));
      });
    });
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    return NextResponse.json(
      { error: "Error fetching images from S3" },
      { status: 500 }
    );
  }
}
