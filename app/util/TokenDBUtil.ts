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