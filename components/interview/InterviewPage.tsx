import React, { useState, useRef, useEffect } from 'react';
import CountdownTimer from '../CountdownTimer';
import RevViewHelper from '../RevViewHelper';
import DropDown, { VibeType } from '../DropDown';
import { transcriptBuffer } from '../RevAI';
import { useChat } from 'ai/react';

// Define the initial panel content
const panelContent = [
  "Of course. I'm currently working as a senior software engineer in the Digital Acquisition team at American Express. Our team is responsible for developing and maintaining the APIs that power the online application process for American Express credit cards. We work closely with our business partners in marketing and product management to ensure that the application process is smooth and user-friendly for our customers.",
  "Our team consists of 8 software engineers, a product manager, and a QA engineer. We work in an Agile environment and use Scrum as our development framework.",
  "Our clients are primarily the web and mobile applications that American Express offers to its customers. These applications allow customers to apply for credit cards online, view account information, and perform other banking tasks. In addition, we also have internal clients such as our risk management and compliance teams, who rely on our APIs to ensure that our online application process meets regulatory requirements.",
  "Sure, one simple business use-case is the ability to pre-fill the credit card application form with the customer's personal information. This saves our customers time and effort, and makes the application process more seamless. For example, if a customer has an American Express account and is already logged into our website, we can use our APIs to retrieve their personal information such as name, address, and social security number, and pre-fill the application form with that information. This simplifies the application process and makes it more convenient for the customer, which ultimately leads to a better customer experience."
];

export function InterviewPage({ params }: any) {
    const [localTranscript, setLocalTranscript] = useState(transcriptBuffer);
    const [textSize, setTextSize] = useState('medium');
    const [currentPanel, setCurrentPanel] = useState(1);
    const [visiblePages, setVisiblePages] = useState<number[]>([]);
    const [hideContent, setHideContent] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
  
    const [bio, setBio] = useState('');
    const [vibe, setVibe] = useState<VibeType>("Interview");
    const bioRef = useRef<null | HTMLDivElement>(null);
  
    const scrollToBios = () => {
      if (bioRef.current !== null) {
        bioRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    const { input, setInput, handleSubmit, isLoading, messages } = useChat({
      body: {
        vibe
      },
      onResponse() {
        scrollToBios();
      },
    });
    
    const onSubmit = (event: any) => {
      console.log("onSubmit called");
      console.log("localTranscript:", input);
      handleSubmit(event);
    };
    
    const lastMessage = messages[messages.length - 1];
    const generatedBios = lastMessage?.role === 'assistant' ? lastMessage.content : null;
  
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
  
      const interval = setInterval(updateTranscript, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    const handleTextSizeChange = (size: any) => {
      setTextSize(size);
    };
  
    const toggleContentVisibility = () => {
      setHideContent(!hideContent);
    };
  
    const renderPanels = () => {
      return panelContent.map((content, index) => (
        <div
          key={index}
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            scrollSnapAlign: 'start',
            backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#e9ecef',
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
            {generatedBios}
          </p>
  
  <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        {/* <Header /> */}
        <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
          <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
            {/* Generate your next Twitter bio using chatGPT */}
          </h1>
          {/* <p className="text-slate-500 mt-5">47,118 bios generated so far.</p> */}
  
  
          
          <form className="max-w-xl w-full" onSubmit={onSubmit}>
  
  
          {!isLoading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                type="submit"
              >
                Generate answer &rarr;
              </button>
            )}
            {isLoading && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled
              >
                <span className="loading">
                  <span style={{ backgroundColor: 'white' }} />
                  <span style={{ backgroundColor: 'white' }} />
                  <span style={{ backgroundColor: 'white' }} />
                </span>
              </button>
            )}
            <div className="flex mt-10 items-center space-x-3">
  
              {/* <p className="text-left font-medium">
                Copy your current bio{' '}
                <span className="text-slate-500">
                  (or write a few sentences about yourself)
                </span>
                .
              </p> */}
            </div>
            <div className="flex mb-5 items-center space-x-3">
              {/* <Image src="/2-black.png" width={30} height={30} alt="1 icon" /> */}
              {/* <p className="text-left font-medium">Select your vibe.</p> */}
            </div>
            <div className="block">
              {/* <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} /> */}
            </div>
          </form>
  
  
          
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
          {/* <output className="space-y-10 my-10">
            {generatedBios && (
              <>
                <div>
                  <h2
                    className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                    ref={bioRef}
                  >
                    Your generated bios
                  </h2>
                </div>
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                  {generatedBios
                    .substring(generatedBios.indexOf('1') + 3)
                    .split('2.')
                    .map((generatedBio) => {
                      return (
                        <div
                          className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedBio);
                            toast('Bio copied to clipboard', {
                              icon: '✂️',
                            });
                          }}
                          key={generatedBio}
                        >
                          <p>{generatedBio}</p>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </output> */}
        </main>
        {/* <Footer /> */}
      </div>
          
        </div>
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
            {/* Page numbers (bottom right) */}
            <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePanelChange(page)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: currentPanel === page ? 'black' : 'transparent',
                      color: currentPanel === page ? 'white' : 'black',
                      padding: '5px 10px',
                      borderRadius: '5px',
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
  
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