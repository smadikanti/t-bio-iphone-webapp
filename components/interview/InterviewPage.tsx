import React, { useState, useRef, useEffect } from 'react';
import RevViewHelper from '../RevViewHelper';
import { doStream, transcriptBuffer } from '../RevAI';
import { useChat } from 'ai/react';
import { putEndedEventDataForTokenId } from '../../app/util/TokenDBUtil';

const MAX_TRANSCRIPT_TOKEN_LENGTH = 4000;
const DEFAULT_CHARACTERS_PER_TOKEN = 4;
const MAX_TRANSCRIPT_CHAR_LENGTH = MAX_TRANSCRIPT_TOKEN_LENGTH * DEFAULT_CHARACTERS_PER_TOKEN;

export function InterviewPage({ params, intervieweeData }: any) {

  const [responseMode, setResponseMode] = useState('full'); // 'full' for full answers, 'bullet' for bullet points

  const handleResponseModeChange = (mode: string) => {
    setResponseMode(mode);
};

  const handlePageRefresh = async () => {
    console.log('Page is being refreshed');
    
    try {
      console.log("Attempting to log end event in the db");
      
      // Assuming putEndedEventDataForTokenId returns a Promise
      await putEndedEventDataForTokenId(params.token_id, "Jonathan");
      
      console.log("End event logging complete");
    } catch (error) {
      console.error("Error logging end event:", error);
    }
  
    alert('Page is being refreshed');
  };
  

  useEffect(() => {
      // Add an event listener to detect page refresh (beforeunload)
      window.addEventListener('beforeunload', handlePageRefresh);

      // Add an event listener to detect page unload (unload)
      window.addEventListener('unload', handlePageRefresh);

      // Clean up the event listeners when the component unmounts
      return () => {
          window.removeEventListener('beforeunload', handlePageRefresh);
          window.removeEventListener('unload', handlePageRefresh);
      };
  }, []); // Empty dependency array to ensure it's only added once







    const [textSize, setTextSize] = useState('medium');
    const [panelElements, setPanelElements] = useState([] as any[]);
    const [hideContent, setHideContent] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [buttonPressCount, setButtonPressCount] = useState(0);
    const [generatedBiosArray, setGeneratedBiosArray] = useState([] as string[]);
  
    const { input, setInput, handleSubmit, isLoading, messages, setMessages } = useChat({
      body: {
        intervieweeData
      }
    });

    const filterAllAssistantResponses = (messages: any) => {
      const filteredMessages = messages.filter((message: any) => message.role === 'user');
      return filteredMessages;
    }

    const getShortenedMessages = (messages: any) => {
      const filteredMessages = filterAllAssistantResponses(messages);

      let totalLength = 0;
      for (let i = 0; i < filteredMessages.length; i++) {
        totalLength += filteredMessages[i].content.length;
      }

      const resumeContext = `Pretend to be this interviewee and answer questions to pass the job interview.
        When giving answers, use the STAR method and be direct and concise. Use specific details
        and clear explanations to demonstrate the validity of your experience.
        Interviewee\'s resume: ` + intervieweeData.resume;
      const jobDescription = 'Current interview\s job description: ' + intervieweeData.jobDescription;

      // add resume and job description to the beginning of the transcript if they are not already there
      if (filteredMessages.length <= 1 || filteredMessages[0].content !== resumeContext) {
        filteredMessages.unshift({role: 'system', content: resumeContext});
      }
      if (filteredMessages.length <= 2 || filteredMessages[1].content !== jobDescription) {
        filteredMessages.splice(1, 0, {role: 'system', content: jobDescription});
      }

      if (totalLength <= MAX_TRANSCRIPT_CHAR_LENGTH) {
        return filteredMessages;
      }

      // shorten or remove messages until the total length is less than maxCharLength
      let removedCharLength = 0;
      for (let i = 2; i < filteredMessages.length; i++) {
        removedCharLength += filteredMessages[i].content.length;
        if (removedCharLength > MAX_TRANSCRIPT_CHAR_LENGTH) {
          // shorten this message by removing characters from the beginning
          const numCharsToRemove = removedCharLength - MAX_TRANSCRIPT_CHAR_LENGTH;
          const newContent = filteredMessages[i].content.substring(numCharsToRemove);
          filteredMessages[i].content = newContent;
          break;
        }
        else {
          // remove this message
          filteredMessages.splice(i, 1);
          i--;
        }
      }
      return filteredMessages;
    }
    
    const onSubmit = (event: any) => {
      // save the current message to the bios array
      const oldBiosArray = generatedBiosArray;
      if (generatedBios) {
        oldBiosArray.push(generatedBios);
        console.log("oldBiosArray: ", oldBiosArray)
        setGeneratedBiosArray(oldBiosArray);
      }
      event.preventDefault();
      setMessages(getShortenedMessages(messages));

      handleSubmit(event);
   
      // wait 200ms and scroll to next panel to make sure the state has been updated
      setTimeout(() => {
        if (contentRef.current) {
          const targetPanel = contentRef.current.getElementsByTagName('form')[buttonPressCount];
          console.log("forms: ", contentRef.current.getElementsByTagName('form'))
          console.log("targetPanel: ", targetPanel)
          if (targetPanel) {
              targetPanel.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 220);

      setButtonPressCount(buttonPressCount + 1);
      console.log("buttonPressCount: ", buttonPressCount);
    };
    
    const lastMessage = messages[messages.length - 1];
    const generatedBios = lastMessage?.role === 'assistant' ? lastMessage.content : '';
 
    useEffect(() => {
      const updateTranscript = () => {
        setInput(transcriptBuffer);
      };
  
      const interval = setInterval(updateTranscript, 50);
  
      return () => clearInterval(interval);
    }, []);
  
    const handleTextSizeChange = (size: any) => {
      setTextSize(size);
    };
  
    const toggleContentVisibility = () => {
      setHideContent(!hideContent);
    };
  
    const renderPanels = () => {
      const getPanelMessage = (index: number) => {
        if (index < generatedBiosArray.length) {
          return generatedBiosArray[index];
        }
        else if (index == generatedBiosArray.length) {
          return generatedBios;
        } else {
          return '';
        }
      }

      const generatedBiosArrayWithPadding = [...generatedBiosArray, '', '', '', ''];

      const foundPanels = generatedBiosArrayWithPadding.map((content, index) => (
          <form
            onSubmit={onSubmit}
            style={{
              display: 'flex', 
              flexDirection: 'column', 
              height: '100vh', 
              margin: 0, 
              padding: 0, 
            }}
          >
            <button
              key={index}
              type="submit"
              style={{
                flexGrow: 1, 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                scrollSnapAlign: 'start',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#e9ecef',
                border: 'none', 
                padding: 0, 
                width: '100%',
                minHeight: '100vh', 
              }}
            >
              <p
                style={{
                  maxWidth: '90%',
                  margin: '0 auto',
                  fontSize:
                    textSize === 'small' ? '16px' : textSize === 'large' ? '20px' : '18px',
                  lineHeight: '1.6',
                }}
              >
                {/* {content} */}
                {/* {transcriptBuffer} */}
                {getPanelMessage(index)}
              </p>
            </button>
          </form>
      ));

      return foundPanels;
    };

    useEffect(() => {
      const foundPanels = renderPanels();
      setPanelElements(foundPanels);
    }, [generatedBiosArray]);
  
    return (
      <div
        ref={contentRef}
        style={{ scrollSnapType: 'y mandatory', overflowY: 'scroll', height: '100vh' }}
      >
  
        {/* Branding element */}
        <div style={{ position: 'fixed', top: '20px', left: '20px', color: 'black', fontWeight: 'bold', fontSize: '16px' }}>
          AI Proxy
        </div>
  
        {renderPanels()}
        
  
        {/* Conditional rendering for buttons, page numbers, and timer */}
        {!hideContent && (
          <>
            {/* Text size buttons (bottom left) */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <button
                  onClick={() => handleTextSizeChange('small')}
                  style={{
                    marginRight: '10px',
                    backgroundColor: textSize === 'small' ? 'black' : 'transparent',
                    color: textSize === 'small' ? 'white' : 'black',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  S
                </button>
                <button
                  onClick={() => handleTextSizeChange('medium')}
                  style={{
                    marginRight: '10px',
                    backgroundColor: textSize === 'medium' ? 'black' : 'transparent',
                    color: textSize === 'medium' ? 'white' : 'black',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  M
                </button>
                <button
                  onClick={() => handleTextSizeChange('large')}
                  style={{
                    backgroundColor: textSize === 'large' ? 'black' : 'transparent',
                    color: textSize === 'large' ? 'white' : 'black',
                    padding: '5px 10px',
                    borderRadius: '5px',
                  }}
                >
                  L
                </button>
              </div>
            </div>


            {/* CONTENT OUTPUT MODIFICATION */}
  <div style={{ position: 'fixed', top: '20px', right: '20px' }}> {/* Adjust the position as needed */}
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <button
      onClick={() => handleResponseModeChange('bullet')}
      style={{
        marginLeft: '10px',
        backgroundColor: responseMode === 'bullet' ? 'black' : 'transparent',
        color: responseMode === 'bullet' ? 'white' : 'black',
        padding: '5px 10px',
        borderRadius: '5px',
      }}
    >
      Bullet Points
    </button>
    <button
      onClick={() => handleResponseModeChange('full')}
      style={{
        backgroundColor: responseMode === 'full' ? 'black' : 'transparent',
        color: responseMode === 'full' ? 'white' : 'black',
        padding: '5px 10px',
        borderRadius: '5px',
      }}
    >
      Full Answers
    </button>
  </div>
</div>

  
            {/* Include the CountdownTimer component (top right) */}
            <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
              {/* <CountdownTimer /> */}
            </div>
          </>
        )}
  
        {/* Hide/unhide button (bottom center) */}
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          <button onClick={toggleContentVisibility}>
            {hideContent ? 'Unhide' : 'Hide'}
          </button>
        </div>
  
        {/* Start Interview button */}
        <div style={{ position: 'fixed', bottom: '20px', left: '200px' }}>
        <RevViewHelper/>
          <p id="status"></p>
          <table id="messages"></table>
        </div>
  
      </div>
    );
}