import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const singUrl = async (
  contentType: string,
  itemId: string,
  fileName: string
) => {
  const s3Client = new S3Client({ region: process.env.AWS_REGION });

  const key = `products/${itemId}/${fileName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  return signedUrl;
};

const service = { singUrl };

export default service;
