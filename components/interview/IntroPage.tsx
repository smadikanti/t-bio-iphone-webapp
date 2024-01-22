// Import necessary modules and components
import { getDataForTokenId, putStartedEventDataForTokenId, getResumeInText, getJdInText } from '../../app/util/TokenDBUtil';


export function IntroPage({ onStartInterview, intervieweeData, currentEventId }: any) {
    // Function to handle starting the interview
    const handleStartInterview = () => {
        if (onStartInterview) {

            /// USER CLICKED START INTERVIEW BUTTON

            // LOG START TIME OF THE EVENT
      
            console.log("Attempting to log start event in the db")
            const putEventForTheUserSessionInDb = putStartedEventDataForTokenId(intervieweeData.tokenId, intervieweeData.CandidateName, intervieweeData.companyId, currentEventId);
            console.log("Start event logging complete")


            onStartInterview();
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                {/* Greeting with interviewee's first name */}
                {/* <h1 className="text-4xl font-bold mb-4">TOKEN ID: {intervieweeData.tokenId}</h1> */}
                <h1 className="text-4xl font-bold mb-4">Hello {intervieweeData.CandidateName}!</h1>


{/* CHECKING IF RESUME IS REDNERED FROM S3 */}
                <h1 className="text-4xl font-bold mb-4">RESUME IS SHOWN HERE: {intervieweeData.resumeFromS3}!</h1>

                <h1 className="text-4xl font-bold mb-4">JD IS SHOWN HERE: {intervieweeData.jdFromS3}!</h1>

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
