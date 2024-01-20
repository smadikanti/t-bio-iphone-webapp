// pages/api/resume-from-s3.js
import { S3 } from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
    //   const body = req.body;
    //   const tokenId = body.tokenId; // Assuming tokenId is sent in the request body
    const body = await req.json();
    const tokenData: any = body;
    const tokenId = tokenData.tokenId; // Access tokenId from the parsed JSON body
      console.log(`"Extracted token_id: ${tokenId}"`);

      const s3 = new S3(); // Specify your AWS region

      const bucketName = 'aiproxy-company-managed-jd-bucket'; // Your bucket name
      const key = `job_description/${tokenId}.txt`; // Filename in the bucket

      console.log("Bucket Name:", bucketName); // Log the bucket name
      console.log("FileName Name:", key); // Log the bucket name

      const params = {
        Bucket: bucketName,
        Key: key,
      };

      const data = await s3.getObject(params).promise();
      const fileContent = data.Body ? data.Body.toString('utf-8') : '';
      console.log(`"File content from S3: ${fileContent}"`);

      return NextResponse.json(fileContent);
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ error: 'Error fetching data from DynamoDB' });
    }
  } else {
    return NextResponse.json({ error: 'Error fetching data from DynamoDB' });
  }
}
