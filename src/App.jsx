import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "./App.css";

const imageCount = 5;
const images = Array.from({ length: imageCount }, (_, i) => `/images/${i + 1}.jpg`);
const interval = 500; // 2 images/sec

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const timerRef = useRef(null);
  const imageIntervalRef = useRef(null);
  const qrTimeoutRefs = useRef([]);

  const stopAll = () => {
    clearInterval(timerRef.current);
    clearInterval(imageIntervalRef.current);
    qrTimeoutRefs.current.forEach((t) => clearTimeout(t));
    qrTimeoutRefs.current = [];
    setRunning(false);
    setShowQR(false);
  };

  const startSequence = () => {
    stopAll();

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setQrValue(`jeycavbhakanadiyaz${hh}${mm}`);

    setRunning(true);
    setElapsedTime(0);
    setCurrentIndex(0);

    imageIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= 30) stopAll();
        return newTime;
      });
    }, 1000);

    const flashCount = 3;
    const minDelay = 3000;
    const maxDelay = 27000;
    const minGap = 3000;

    const delays = [];
    while (delays.length < flashCount) {
      const candidate = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      if (delays.every((t) => Math.abs(t - candidate) >= minGap)) {
        delays.push(candidate);
      }
    }

    delays.sort((a, b) => a - b);

    delays.forEach((delay) => {
      const timeoutId = setTimeout(() => {
        setShowQR(true);
        setTimeout(() => setShowQR(false), 500);
      }, delay);
      qrTimeoutRefs.current.push(timeoutId);
    });
  };

  useEffect(() => {
    return stopAll;
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2>QR Code</h2>

      {/* Outer container */}
      <div
        style={{
          width: '80vmin',
          height: '80vmin',
          maxWidth: '90vw',
          margin: '0 auto',
          border: '8px solid white',
          borderRadius: '16px',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Inner square wrapper to normalize size */}
        <div
          style={{
            width: '90%',
            height: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showQR ? (
            <QRCodeSVG
              value={qrValue}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              includeMargin={false}
            />
          ) : (
            <img
              src={images[currentIndex]}
              alt="cycling"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain', // match QR behavior
              }}
            />
          )}
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '1.5rem' }}>
        Elapsed Time: {elapsedTime}s
      </div>

      <div style={{ marginTop: '20px' }}>
        {running ? (
          <button
            onClick={startSequence}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Reset Now
          </button>
        ) : (
          <button
            onClick={startSequence}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            ▶️ Start Again
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
