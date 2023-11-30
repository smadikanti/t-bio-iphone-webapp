"use client"
import React, { useState, useRef, useEffect } from 'react';
import { IntroPage } from '../../../components/interview/IntroPage';
import { InterviewPage } from '../../../components/interview/InterviewPage';
import { NoAccessPage } from '../../../components/interview/NoAccessPage';
import { getDataForTokenId } from '../../util/TokenDBUtil';
import { set } from 'react-hook-form';

export default function ProtectedPage({ params }: any) {
    const [hasAcceptedToken, setHasAcceptedToken] = useState(false);
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [intervieweeData, setIntervieweeData] = useState({} as any);

    const handleStartInterview = () => {
        setIsInterviewStarted(true);
    };

    const renderInterviewPage = (isInterviewStarted: boolean) => {
        if (isInterviewStarted) {
            return <InterviewPage params={params} intervieweeData={intervieweeData}/>;
        } else {
            return <IntroPage onStartInterview={handleStartInterview} />;
        }
    }

    useEffect(() => {
        const checkToken = async () => {
            console.log("fetching data for token id: " + params.token_id);
            const result = await getDataForTokenId(params.token_id);
            setIntervieweeData(result);
            if (result) {
                setHasAcceptedToken(true);
            } else {
                setHasAcceptedToken(false);
            }
        };

        checkToken();
    }, [params.token_id]);

    return (
        <div>
            {hasAcceptedToken ? renderInterviewPage(isInterviewStarted) : <NoAccessPage />}
        </div>
    );
}