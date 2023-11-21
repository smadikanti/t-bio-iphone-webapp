"use client"
import React, { useState, useRef, useEffect } from 'react';
import { IntroPage } from '../../../components/interview/IntroPage';
import { InterviewPage } from '../../../components/interview/InterviewPage';
import { NoAccessPage } from '../../../components/interview/NoAccessPage';

// TODO: Replace with call to DDB.
const acceptedTokens = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
];
async function isAcceptedToken(tokenId: string) {
    return acceptedTokens.includes(tokenId);
}

export default function ProtectedPage({ params }: any) {
    const [hasAcceptedToken, setHasAcceptedToken] = useState(false);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);

    const handleStartInterview = () => {
        setIsInterviewStarted(true);
    };

    const renderInterviewPage = (isInterviewStarted: boolean) => {
        if (isInterviewStarted) {
            return <InterviewPage params={params} />;
        } else {
            return <IntroPage onStartInterview={handleStartInterview} />;
        }
    }

    useEffect(() => {
        const checkToken = async () => {
            const result = await isAcceptedToken(params.token_id);
            setHasAcceptedToken(result);
        };

        checkToken();
    }, [params.token_id]);

    return (
        <div>
            {hasAcceptedToken ? renderInterviewPage(isInterviewStarted) : <NoAccessPage />}
        </div>
    );
}