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

// export async function getResumeInText(tokenId: string): Promise<string | null> {
//   // Construct the URL with the tokenId as a query parameter
//   const url = new URL("/api/get-resume-from-s3", window.location.origin);
//   url.searchParams.append('tokenId', tokenId);
  
//   console.log("Constructed URL:", url.toString());

//   try {
//     const response = await fetch(url.toString(), {
//       method: "GET",
//       headers: { 'Content-Type': 'application/json' },
//     });

//     console.log("Fetch request made.");

//     if (response.status === 200) {
//       const resumeText = await response.text();
//       console.log("Resume text fetched:", resumeText);
//       return resumeText;
//     } else {
//       console.error("Error fetching resume in text:", response.status, response.statusText);
//       return null;
//     }
//   } catch (error) {
//     console.error("An error occurred while making the request:", error);
//     return null;
//   }
// }
export async function getResumeInText(tokenId: string) {
  try {
      const response = await fetch('/api/resume-from-s3', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ tokenId })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
  }
}







