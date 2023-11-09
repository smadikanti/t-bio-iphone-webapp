import React from 'react';
import { doStream } from './RevAI.js';

function RevViewHelper({ }) {

  const buttonStyles = {
    borderRadius: '20px', // Adjust the border-radius to control roundness
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Use rgba for faded red color
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)', // Add box shadow
  };

  return (
    <div>
      {/* <p>Rev.ai Browser Streaming Example</p> */}
      {/* <button id="streamButton" onClick={doStream}> */}
      <button id="streamButton" onClick={() => doStream()} style={buttonStyles}>
        Start Interview
      </button>
      <p id="status"></p>
      <table id="messages"></table>
    </div>
    // <></>
  );
}

export default RevViewHelper;