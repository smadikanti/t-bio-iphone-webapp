// Import necessary modules and components

export function IntroPage({ onStartInterview, intervieweeData }: any) {
    // Function to handle starting the interview
    const handleStartInterview = () => {
        if (onStartInterview) {
            onStartInterview();
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                {/* Greeting with interviewee's first name */}
                <h1 className="text-4xl font-bold mb-4">TOKEN ID: {intervieweeData.tokenId}</h1>
                <h1 className="text-4xl font-bold mb-4">{intervieweeData.firstName}!</h1>


{/* CHECKING IF RESUME IS REDNERED FROM S3 */}
                <h1 className="text-4xl font-bold mb-4">RESUME IS SHOWN HERE: {intervieweeData.resumeFromS3}!</h1>

                {/* Welcome message */}
                <h1 className="text-4xl font-bold mb-4">Welcome to the VensaTek AI Assist</h1>
                {/* Instruction for the user */}
                <p className="mb-6">Click below to start your interview.</p>

                {/* Button to start the interview */}
                <button
                    onClick={handleStartInterview}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Start Interview
                </button>
            </div>
        </div>
    );
}
