interface DbData {
tokenId: string;
firstName: string;
lastName: string;
email: string;
phoneNumber: string;
resume: string;
jobDescription: string;
durationInMinutes: number;
bufferInMinutes: number;
timezone: string;
date: string;
startTime: string;
createdTime: string;
}

export async function tokenIdExistsInDb(tokenId: string): Promise<boolean> {
const request = new Request("/api/schedule", {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tokenId }),
});
const response = await fetch(request);
return response.status === 200;
}

export async function getDataForTokenId(tokenId: string): Promise<DbData | null> {
const request = new Request("/api/schedule", {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tokenId }),
});
const response = await fetch(request);
console.log("response: " + JSON.stringify(response));
if (response.status === 200) {
  const data = await response.json();
  if (data.error) {
    console.error("Error fetching data from DynamoDB:", data.error);
    return null;
  }
  return data as DbData;
}
return null;
}

export async function putStartedEventDataForTokenId(tokenId: string, candidateName: string, startTime: string): Promise<boolean> {
  const requestData = {
    tokenId,
    candidateName,
    startTime,
  };

  const request = new Request("/api/started-event", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });

  try {
    const response = await fetch(request);

    if (response.status === 200) {
      return true; // Successfully added started event data
    } else {
      console.error("Error adding started event data:", response.statusText);
      return false; // Failed to add started event data
    }
  } catch (error) {
    console.error("An error occurred while making the request:", error);
    return false; // Failed to make the request
  }
}

export async function putEndedEventDataForTokenId(tokenId: string, candidateName: string): Promise<boolean> {
  const requestData = {
    tokenId,
    candidateName
  };

  const request = new Request("/api/ended-event", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });

  try {
    const response = await fetch(request);

    if (response.status === 200) {
      return true; // Successfully added started event data
    } else {
      console.error("Error adding started event data:", response.statusText);
      return false; // Failed to add started event data
    }
  } catch (error) {
    console.error("An error occurred while making the request:", error);
    return false; // Failed to make the request
  }
}



