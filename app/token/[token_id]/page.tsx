"use client"
import React, { useState, useRef, useEffect } from 'react';
import { IntroPage } from '../../../components/interview/IntroPage';
import { InterviewPage } from '../../../components/interview/InterviewPage';
import { NoAccessPage } from '../../../components/interview/NoAccessPage';
import { getDataForTokenId, putStartedEventDataForTokenId, getResumeInText, getJdInText } from '../../util/TokenDBUtil';
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
            return <IntroPage onStartInterview={handleStartInterview} intervieweeData={intervieweeData}/>;
        }
    }

    useEffect(() => {
        const checkToken = async () => {
            console.log("fetching data for token id: " + params.token_id);
            const result = await getDataForTokenId(params.token_id);
            
            console.log(`"smad: log 1: printing params.token_id: ${params.token_id}"`)
            const resumeInTextFromS3 = await getResumeInText(params.token_id);
            console.log(`"smad log final: resume is on the page: ${resumeInTextFromS3}"`)

            const jdInTextFromS3 = await getJdInText(params.token_id);
            console.log(`"smad log final: JD is on the page: ${jdInTextFromS3}"`)
            // setIntervieweeData(result);
            // intervieweeData.resumeFromS3 = resumeInTextFromS3;

            setIntervieweeData({
                ...result,
                resumeFromS3: resumeInTextFromS3,
                jdFromS3: jdInTextFromS3
            });
              

            // TODOSMAD: set resume here as well
            // TODOSMAD: set jd here as well

            if (result) {
                setHasAcceptedToken(true);
                // check if the allowed duration is still valid
                // TODOSMAD: create entry in event tracking table with tokenId, companyId, candidateName, startTime
                console.log("Attempting to log start event in the db")
                const putEventForTheUserSessionInDb = await putStartedEventDataForTokenId(params.token_id, result.firstName, result.startTime);
                console.log("Start event logging complete")
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