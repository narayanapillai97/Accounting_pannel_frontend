import React, { useState, useEffect } from 'react';
import '../../../../src/css/loader.css';

const RoundedLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const loaderData = [
    { variant: "s-primary", value: 75, label: "Primary Loader" },
    { variant: "s-success", value: 60, label: "Success Loader" },
    { variant: "s-warning", value: 85, label: "Warning Loader" },
    { variant: "s-danger", value: 40, label: "Danger Loader" },
    { variant: "s-info", value: 90, label: "Info Loader" },
    { variant: "s-purple", value: 65, label: "Purple Loader" }
  ];

  return (
    <div className="s-container">
      {/* <h1 className="s-title">Modern Rounded Loaders</h1> */}
      
      <div className="s-grid">
        {/* Circular Progress Loaders */}
        {loaderData.map((loader, index) => (
          <div key={index} className={`s-card ${loader.variant}`}>
            <h3 className="s-card-title">{loader.label}</h3>
            <div className="s-loader-wrapper">
              <div className="s-circular-loader">
                <svg width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="s-circular-track"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    className="s-circular-progress"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 52}`,
                      strokeDashoffset: `${2 * Math.PI * 52 * (1 - loader.value / 100)}`
                    }}
                  />
                </svg>
                <div className="s-circular-text">{loader.value}%</div>
              </div>
            </div>
            
            <div className="s-linear-loader">
              <div 
                className="s-linear-progress" 
                style={{ width: `${loader.value}%` }}
              ></div>
            </div>
            <div className="s-label">Linear Progress</div>
          </div>
        ))}

        {/* Animated Spinner */}
        <div className="s-card s-primary">
          <h3 className="s-card-title">Animated Spinner</h3>
          <div className="s-animated-loader">
            <div className="s-spinner"></div>
          </div>
          <div className="s-label">Loading...</div>
        </div>

        {/* Pulse Loader */}
        <div className="s-card s-success">
          <h3 className="s-card-title">Pulse Animation</h3>
          <div className="s-pulse-loader">
            <div className="s-pulse-dot"></div>
            <div className="s-pulse-dot"></div>
            <div className="s-pulse-dot"></div>
          </div>
          <div className="s-label">Processing...</div>
        </div>

        {/* Dynamic Progress */}
        <div className="s-card s-warning">
          <h3 className="s-card-title">Dynamic Progress</h3>
          <div className="s-loader-wrapper">
            <div className="s-circular-loader">
              <svg width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="s-circular-track"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  className="s-circular-progress"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 52}`,
                    strokeDashoffset: `${2 * Math.PI * 52 * (1 - progress / 100)}`
                  }}
                />
              </svg>
              <div className="s-circular-text">{progress}%</div>
            </div>
          </div>
          <div className="s-linear-loader">
            <div 
              className="s-linear-progress" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="s-label">Auto-updating</div>
        </div>
      </div>
    </div>
  );
};

export default RoundedLoader;