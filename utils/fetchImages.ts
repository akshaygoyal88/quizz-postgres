import S3 from "aws-sdk/clients/s3";

function fetchImagesFromS3() {
  return "";
  return new Promise((resolve, reject) => {
    const client_s3 = new S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
    });
    const params = {
      // Bucket: process.env.BUCKET_NAME,
      Bucket: "sdfdsfdsgfdhfdh",
    };

    client_s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.error("Error fetching images from S3:", err);
        reject({ error: "Error fetching images from S3" });
        return;
      }

      const images =
        data.Contents?.map((object) => ({
          title: object.Key,
          value: `https://${params.Bucket}.s3.amazonaws.com/${object.Key}`,
        })) || [];

      resolve(images);
    });
  });
}

export { fetchImagesFromS3 };
