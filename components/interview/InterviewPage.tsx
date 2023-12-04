import React, { useState, useRef, useEffect } from 'react';
import CountdownTimer from '../CountdownTimer';
import RevViewHelper from '../RevViewHelper';
import DropDown, { VibeType } from '../DropDown';
import { doStream, transcriptBuffer } from '../RevAI';
import { useChat } from 'ai/react';

const MAX_TRANSCRIPT_TOKEN_LENGTH = 4000;
const DEFAULT_CHARACTERS_PER_TOKEN = 4;
const MAX_TRANSCRIPT_CHAR_LENGTH = MAX_TRANSCRIPT_TOKEN_LENGTH * DEFAULT_CHARACTERS_PER_TOKEN;

// Define the initial panel content
const panelContent = [
  "Of course. I'm currently working as a senior software engineer in the Digital Acquisition team at American Express. Our team is responsible for developing and maintaining the APIs that power the online application process for American Express credit cards. We work closely with our business partners in marketing and product management to ensure that the application process is smooth and user-friendly for our customers.",
  "Our team consists of 8 software engineers, a product manager, and a QA engineer. We work in an Agile environment and use Scrum as our development framework.",
  "Our clients are primarily the web and mobile applications that American Express offers to its customers. These applications allow customers to apply for credit cards online, view account information, and perform other banking tasks. In addition, we also have internal clients such as our risk management and compliance teams, who rely on our APIs to ensure that our online application process meets regulatory requirements.",
  "Sure, one simple business use-case is the ability to pre-fill the credit card application form with the customer's personal information. This saves our customers time and effort, and makes the application process more seamless. For example, if a customer has an American Express account and is already logged into our website, we can use our APIs to retrieve their personal information such as name, address, and social security number, and pre-fill the application form with that information. This simplifies the application process and makes it more convenient for the customer, which ultimately leads to a better customer experience."
];

export function InterviewPage({ params, intervieweeData }: any) {
    const [textSize, setTextSize] = useState('medium');
    const [currentPanel, setCurrentPanel] = useState(1);
    const [visiblePages, setVisiblePages] = useState<number[]>([]);
    const [hideContent, setHideContent] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [buttonPressCount, setButtonPressCount] = useState(0);
    const [generatedBiosArray, setGeneratedBiosArray] = useState([] as string[]);
  
    const [bio, setBio] = useState('');
    const [vibe, setVibe] = useState<VibeType>("Interview");
  
    const { input, setInput, handleSubmit, isLoading, messages, setMessages } = useChat({
      body: {
        vibe
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
      if (generatedBios !== '' && generatedBios) {
        oldBiosArray.push(generatedBios);
        console.log("oldBiosArray: ", oldBiosArray)
        setGeneratedBiosArray(oldBiosArray);
      }
      event.preventDefault();
      setMessages(getShortenedMessages(messages));

      handleSubmit(event);
   
      // scroll to the next panel
      if (contentRef.current) {
        const targetPanel = contentRef.current.children[buttonPressCount+1];
        if (targetPanel) {
            targetPanel.scrollIntoView({ behavior: 'smooth' });
        }
      }

      setButtonPressCount(buttonPressCount + 1);
      console.log("buttonPressCount: ", buttonPressCount);
    };
    
    const lastMessage = messages[messages.length - 1];
    const generatedBios = lastMessage?.role === 'assistant' ? lastMessage.content : '';
  
    useEffect(() => {
      const numPanels = panelContent.length;
      const pageSize = window.innerHeight;
      const totalHeight = numPanels * pageSize;
      const maxPages = Math.ceil(totalHeight / pageSize);
      const startPage = Math.max(currentPanel - 2, 1);
      const endPage = Math.min(startPage + 3, maxPages);
  
      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      setVisiblePages(pages);
    }, [currentPanel]);
 
    useEffect(() => {
      const updateTranscript = () => {
        console.log("updateTranscript called");
        setInput(transcriptBuffer);
      };
  
      const interval = setInterval(updateTranscript, 200);
  
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

      return panelContent.map((content, index) => (
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
    };
  
    const handlePanelChange = (newPanel: number) => {
      setCurrentPanel(newPanel);
  
      if (contentRef.current) {
        const pageSize = window.innerHeight;
        contentRef.current.scrollTop = (newPanel - 1) * pageSize;
      }
    };
  
    const generatePageNumbers = () => {
      const numPanels = panelContent.length;
      const maxPages = Math.ceil(numPanels / 3);
      const pages = [];
  
      for (let i = 1; i <= maxPages; i++) {
        pages.push(i);
      }
  
      return pages;
    };
  
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
            <div style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
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
  
            {/* Include the CountdownTimer component (top right) */}
            <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
              <CountdownTimer />
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
          
          {/* <button
            id="streamButton"
            onClick={() => {
              doStream();
              console.log('Interview started!'); // Add a console.log for debugging
            }}
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
            }}
          >
            Start Interview
          </button> */}
          <p id="status"></p>
          <table id="messages"></table>
        </div>
  
      </div>
    );
}