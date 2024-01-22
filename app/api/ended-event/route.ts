// import { NextRequest, NextResponse } from 'next/server';
// import { DynamoDB } from 'aws-sdk';
// import { v4 as uuidv4 } from 'uuid'; // Import the UUID generator


// interface EventData {
//   eventId: string;
//   tokenId: string; // Updated to include tokenId
//   companyId: string; // Updated to include companyId
//   candidateName: string; // Added candidateName
//   startTime: string;
// }

//   // define current time stamp
//   const currentTimestamp = new Date().toISOString();


// const dynamoDB = new DynamoDB.DocumentClient({
//   region: 'us-east-1',
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// // const eventId = uuidv4(); // Generate a new UUID

// export async function POST(req: Request) {
//   const body = await req.json();
//   const eventData: EventData = body;

//   const params = {
//     TableName: 'aiproxy-company-based-billed-duration-events', // Replace with your DynamoDB table name
//     Item: {
//     // generate event id each session, but, trash event id after the session, create a new one.
//       eventId: eventData.eventId,
//       tokenId: eventData.tokenId, // Updated to use tokenId from the request
//       companyId: "eventData.companyId", // Updated to use companyId from the request
//       candidateName: eventData.candidateName, // Added candidateName from the request
//       endTime: currentTimestamp,
//       startTime: ""
//     },
//   };

//   try {
//     await dynamoDB.put(params).promise();
//     return NextResponse.json({ message: 'Started event data added successfully' });
//   } catch (error) {
//     console.error('Error adding started event data to DynamoDB:', error);
//     return NextResponse.json({ error: 'Error adding started event data to DynamoDB' });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { DynamoDB } from 'aws-sdk';

interface EventData {
  eventId: string;
  tokenId: string; // Updated to include tokenId
  companyId: string; // Updated to include companyId
  candidateName: string; // Added candidateName
}

// Create a DynamoDB DocumentClient instance
const dynamoDB = new DynamoDB.DocumentClient({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const eventData: EventData = body;
  const eventId = eventData.eventId; // Get the eventId from the request body

  console.log(`"looking for eventId: ${eventId}"`)

  const params = {
    TableName: 'aiproxy-company-based-billed-duration-events', // Replace with your DynamoDB table name
    Key: {
      eventId: eventId, // Specify the eventId you want to retrieve
      companyId: eventData.companyId
    },
  };

  try {
    console.log("making a call to get start time record")
    const result = await dynamoDB.get(params).promise();
    console.log("got data from ddb about starttime record")

    if (result.Item) {
      // Record with the specified eventId was found
      const eventData = result.Item;
      eventData.endTime = new Date().toISOString();
      // BILLED MINUTES CALCULATION


            // Parse the timestamps into Date objects
      const startDate = new Date(eventData.startTime);
      const endDate = new Date(eventData.endTime);

      // Calculate the time difference in milliseconds
      const timeDifference = Number(endDate) - Number(startDate);

      // Convert milliseconds to minutes and round it to an integer
      const billedMinutes = Math.ceil(timeDifference / (1000 * 60));


      // Update the endTime field with the current timestamp

      eventData.billedMinutes = billedMinutes;

      // Now, you can update the existing record in DynamoDB
      await dynamoDB.put({
        TableName: 'aiproxy-company-based-billed-duration-events', // Replace with your DynamoDB table name
        Item: eventData,
      }).promise();

      return NextResponse.json({ message: 'Updated event data endTime successfully' });
    } else {
      // Record with the specified eventId was not found
      return NextResponse.json({ error: 'Event data not found with the provided eventId' });
    }
  } catch (error) {
    console.error('Error updating event data in DynamoDB:', error);
    return NextResponse.json({ error: 'Error updating event data in DynamoDB' });
  }
}
