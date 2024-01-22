import { NextRequest, NextResponse } from 'next/server';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator


interface EventData {
  eventId: string;
  tokenId: string; // Updated to include tokenId
  companyId: string; // Updated to include companyId
  candidateName: string; // Added candidateName
}

  // define current time stamp
const currentTimestamp = new Date().toISOString();


const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const eventId = uuidv4(); // Generate a new UUID

export async function POST(req: Request) {
  const body = await req.json();
  const eventData: EventData = body;

  const params = {
    TableName: 'aiproxy-company-based-billed-duration-events', // Replace with your DynamoDB table name
    Item: {
    // generate event id each session, but, trash event id after the session, create a new one.
      eventId: eventId,
      tokenId: eventData.tokenId, // Updated to use tokenId from the request
      companyId: "eventData.companyId", // Updated to use companyId from the request
      candidateName: eventData.candidateName, // Added candidateName from the request
      startTime: currentTimestamp,
      endTime: ""
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return NextResponse.json({ message: 'Started event data added successfully' });
  } catch (error) {
    console.error('Error adding started event data to DynamoDB:', error);
    return NextResponse.json({ error: 'Error adding started event data to DynamoDB' });
  }
}
