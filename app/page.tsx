"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TokenEntryPage() {
  const [tokenId, setTokenId] = useState('');
  const router = useRouter();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    router.push(`/token/${tokenId}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-md shadow-md">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">Please enter the Token ID associated with your interview which you received over email.</label>
            <input
              type="text"
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Token ID"
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
