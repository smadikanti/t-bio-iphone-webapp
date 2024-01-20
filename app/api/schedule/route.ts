import { NextRequest, NextResponse } from 'next/server';
import { DynamoDB } from 'aws-sdk';

interface TokenData {
  tokenId: string;
}

const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  console.log("Request received."); // Add a log for request received
  const body = await req.json();
  const tokenData: any = body;
  console.log("Received tokenData:", tokenData); // Log received tokenData

  const params = {
    // TableName: 'aiproxydatastore1',
    TableName: 'aiproxy-company-managed-token-store-2',
    Key: {
      tokenId: tokenData.tokenId,
      // companyId: "vensatek-995993" // Fix this line to correctly access tokenId
    },
  };

  console.log("prefix log for changing db"); // Log for changing DB

  try {
    console.log("attempting call to db")
    const data = await dynamoDB.get(params).promise();
    console.log("call to ddb succeeded")
    if (data.Item) {
      console.log("Data retrieved from DynamoDB:", data.Item); // Log retrieved data
      return NextResponse.json(data.Item);
    } else {
      console.log("No record found for the provided tokenId."); // Log when no record is found
      return NextResponse.json({ error: 'No record found for the provided tokenId' });
    }
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return NextResponse.json({ error: 'Error fetching data from DynamoDB' });
  }
}
