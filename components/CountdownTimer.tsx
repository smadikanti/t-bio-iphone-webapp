import React, { useState, useEffect } from 'react';

function CountdownTimer() {
  const [time, setTime] = useState({ minutes: 6, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (time.minutes === 0 && time.seconds === 0) {
        clearInterval(interval);
      } else {
        if (time.seconds === 0) {
          setTime({ minutes: time.minutes - 1, seconds: 59 });
        } else {
          setTime({ ...time, seconds: time.seconds - 1 });
        }
      }
    }, 1000); // 1 second in milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  // Define inline styles for styling based on the remaining time
  const timerStyles = {
    width: '60px', // Adjust width for seconds
    height: '40px',
    backgroundColor: time.minutes === 0 && time.seconds <= 10 ? 'red' : 'black',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    borderRadius: '5px',
  };

  return (
    <div style={timerStyles}>
      {`${time.minutes < 10 ? `0${time.minutes}` : time.minutes}:${time.seconds < 10 ? `0${time.seconds}` : time.seconds}`}
    </div>
  );
}

export default CountdownTimer;
