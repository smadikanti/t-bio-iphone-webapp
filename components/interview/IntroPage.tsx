export function IntroPage({ onStartInterview }: any) {
    const handleStartInterview = () => {
        if (onStartInterview) {
            onStartInterview();
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to the iPhone Interview App</h1>
                <p className="mb-6">Get ready to start your interview process.</p>
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