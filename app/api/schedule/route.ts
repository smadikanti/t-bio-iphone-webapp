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
  const body = await req.json();
  const tokenData: any = body;

  const params = {
    TableName: 'aiproxydatastore1',
    Key: {
      tokenId: tokenData.tokenId,
    },
  };

  try {
    const data = await dynamoDB.get(params).promise();
    if (data.Item) {
      return NextResponse.json(data.Item);
    } else {
      return NextResponse.json({ error: 'No record found for the provided tokenId' });
    }
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    return NextResponse.json({ error: 'Error fetching data from DynamoDB' });
  }
}