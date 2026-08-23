import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import { s3Client } from "../config/s3.config";

/* =========================================================
   UPLOAD FILE
========================================================= */

export const uploadFileService = async (
  file: Express.Multer.File,
  folder: string = "uploads"
) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;

  if (!bucket || !region) {
    throw new Error("AWS S3 configuration is missing");
  }

  const extension = path.extname(file.originalname);

  const fileName = `${crypto.randomUUID()}${extension}`;

  const key = `${folder}/${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    key,
    fileName: file.originalname,
    fileSize: file.size,
    mimeType: file.mimetype,
    bucket,
    region,
  };
};

/* =========================================================
   GET SIGNED URL
========================================================= */

export const getSignedUrlService = async (
  key: string
) => {
  if (!key) {
    throw new Error("File key is required");
  }

  const bucket = process.env.AWS_S3_BUCKET;

  if (!bucket) {
    throw new Error("AWS S3 bucket is not configured");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(
    s3Client,
    command,
    {
      expiresIn: 3600,
    }
  );

  return signedUrl;
};

/* =========================================================
   DELETE FILE
========================================================= */

export const deleteFileService = async (
  key: string
) => {
  if (!key) {
    throw new Error("File key is required");
  }

  const bucket = process.env.AWS_S3_BUCKET;

  if (!bucket) {
    throw new Error("AWS S3 bucket is not configured");
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  return true;
};