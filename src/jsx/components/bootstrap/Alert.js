import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

// Enhanced Toast Alert Component
const ToastAlert = ({ 
  show, 
  variant, 
  message, 
  duration = 4000, 
  onClose, 
  position = "bottom-right",
  icon,
  title,
  closeButton = true,
  autoClose = true
}) => {
  useEffect(() => {
    if (!show || !autoClose) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose, autoClose]);

  if (!show) return null;

  const positionStyles = {
    'top-left': { top: 20, left: 20, right: 'auto', bottom: 'auto' },
    'top-center': { top: 20, left: '50%', right: 'auto', bottom: 'auto', transform: 'translateX(-50%)' },
    'top-right': { top: 20, right: 20, left: 'auto', bottom: 'auto' },
    'bottom-left': { bottom: 20, left: 20, right: 'auto', top: 'auto' },
    'bottom-center': { bottom: 20, left: '50%', right: 'auto', top: 'auto', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: 20, right: 20, left: 'auto', top: 'auto' }
  };

  const variantIcons = {
    primary: 'mdi-information-outline',
    success: 'mdi-check-circle-outline',
    warning: 'mdi-alert-outline',
    danger: 'mdi-alert-circle-outline',
    info: 'mdi-bell-outline',
    light: 'mdi-lightbulb-on-outline',
    dark: 'mdi-moon-waning-crescent'
  };

  return (
    <div 
      className={`toast-alert alert-${variant}`} 
      style={positionStyles[position]}
      role="alert"
      aria-live="assertive"
    >
      {icon && <i className={`toast-icon mdi ${icon}`} />}
      {!icon && variantIcons[variant] && <i className={`toast-icon mdi ${variantIcons[variant]}`} />}
      
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      
      {closeButton && (
        <button onClick={onClose} className="btn-close" aria-label="Close">
          <i className="mdi mdi-close" aria-hidden="true"></i>
        </button>
      )}
      
      <style>{`
        .toast-alert {
          position: fixed;
          background-color: #333;
          color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: flex-start;
          gap: 12px;
          animation: fadein 0.3s;
          z-index: 1050;
          max-width: 350px;
          min-width: 250px;
          transition: all 0.3s ease;
        }
        
        .toast-alert.alert-primary { 
          background-color: #007bff;
          border-left: 4px solid #0056b3;
        }
        .toast-alert.alert-success { 
          background-color: #28a745;
          border-left: 4px solid #1e7e34;
        }
        .toast-alert.alert-warning { 
          background-color: #ffc107;
          color: #212529;
          border-left: 4px solid #d39e00;
        }
        .toast-alert.alert-info {
          background-color: #17a2b8;
          border-left: 4px solid #117a8b;
        }
        .toast-alert.alert-danger { 
          background-color: #dc3545;
          border-left: 4px solid #bd2130;
        }
        .toast-alert.alert-light { 
          background-color: #f8f9fa;
          color: #212529;
          border-left: 4px solid #dae0e5;
        }
        .toast-alert.alert-dark { 
          background-color: #343a40;
          border-left: 4px solid #1d2124;
        }
        
        .toast-content {
          flex: 1;
        }
        .toast-title {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 1.05rem;
        }
        .toast-message {
          font-size: 0.95rem;
          line-height: 1.4;
        }
        
        .toast-icon {
          font-size: 1.5rem;
          margin-top: 2px;
        }
        
        .btn-close {
          background: none;
          border: none;
          color: inherit;
          opacity: 0.8;
          cursor: pointer;
          padding: 0;
          margin-left: 8px;
          font-size: 1.2rem;
          line-height: 1;
        }
        .btn-close:hover {
          opacity: 1;
        }
        
        @keyframes fadein {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 576px) {
          .toast-alert {
            max-width: calc(100% - 40px);
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Banner Alert Component
const BannerAlert = ({ 
  variant, 
  message, 
  buttonText, 
  onButtonClick, 
  onClose,
  title,
  icon
}) => (
  <div className={`banner-alert banner-${variant}`}>
    <div className="banner-content">
      {icon && <i className={`banner-icon mdi ${icon}`} />}
      <div className="banner-text">
        {title && <div className="banner-title">{title}</div>}
        <span className="banner-message">{message}</span>
      </div>
      <div className="buttons">
        {buttonText && (
          <Button 
            variant={variant === 'light' ? 'secondary' : 'light'} 
            size="sm" 
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
        <button onClick={onClose} className="btn-close" aria-label="Close">×</button>
      </div>
    </div>
    <style>{`
      .banner-alert {
        width: 100%;
        padding: 0.75rem 1rem;
        color: white;
        display: flex;
        justify-content: center;
        font-weight: 500;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        position: relative;
        margin-bottom: 1rem;
      }
      
      .banner-primary { background-color: #007bff; }
      .banner-success { background-color: #28a745; }
      .banner-info { background-color: #17a2b8; }
      .banner-warning { background-color: #ffc107; color: #212529; }
      .banner-danger { background-color: #dc3545; }
      .banner-light { background-color: #f8f9fa; color: #212529; }
      .banner-dark { background-color: #343a40; }
      
      .banner-content {
        max-width: 1140px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      
      .banner-text {
        flex: 1;
      }
      
      .banner-title {
        font-weight: 600;
        font-size: 1.05rem;
        margin-bottom: 2px;
      }
      
      .banner-message {
        font-size: 0.95rem;
      }
      
      .banner-icon {
        font-size: 1.5rem;
      }
      
      .buttons {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .buttons button.btn-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 22px;
        cursor: pointer;
        line-height: 1;
        opacity: 0.8;
      }
      
      .buttons button.btn-close:hover {
        opacity: 1;
      }
    `}</style>
  </div>
);

// Enhanced Icon-Only Alert Component
const IconOnlyAlert = ({ 
  variant, 
  icon, 
  tooltip,
  pulse = false,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: { width: 32, height: 32, fontSize: 16 },
    medium: { width: 40, height: 40, fontSize: 20 },
    large: { width: 48, height: 48, fontSize: 24 }
  };

  return (
    <div 
      className={`icon-only-alert icon-${variant} ${pulse ? 'pulse-effect' : ''}`} 
      title={tooltip} 
      aria-label={tooltip} 
      role="img" 
      tabIndex={0}
      style={sizeClasses[size]}
    >
      <i className={`mdi ${icon}`} aria-hidden="true"></i>
      <style>{`
        .icon-only-alert {
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: default;
          color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          margin: 5px;
          transition: all 0.2s ease;
        }
        
        .icon-primary { background-color: #007bff; }
        .icon-success { background-color: #28a745; }
        .icon-info { background-color: #17a2b8; }
        .icon-warning { background-color: #ffc107; color: #212529; }
        .icon-danger { background-color: #dc3545; }
        .icon-light { background-color: #f8f9fa; color: #212529; }
        .icon-dark { background-color: #343a40; }
        
        .icon-only-alert:focus {
          outline: 2px solid #666;
          outline-offset: 2px;
        }
        
        .icon-only-alert:hover {
          transform: scale(1.05);
        }
        
        .pulse-effect {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
        }
      `}</style>
    </div>
  );
};

// Enhanced Progress Alert Component
const ProgressAlert = ({ 
  variant, 
  message, 
  progress, 
  title,
  striped = false,
  animated = false
}) => (
  <div className={`progress-alert alert-${variant}`}>
    <div className="progress-header">
      {title && <div className="progress-title">{title}</div>}
      <div className="progress-percentage">{progress}%</div>
    </div>
    <div className="progress-message">{message}</div>
    <div 
      className={`progress-bar-bg ${striped ? 'progress-bar-striped' : ''} ${animated ? 'progress-bar-animated' : ''}`} 
      aria-valuemin="0" 
      aria-valuemax="100" 
      aria-valuenow={progress} 
      role="progressbar"
    >
      <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
    </div>
    <style>{`
      .progress-alert {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        background-color: #f8f9fa;
        max-width: 400px;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #444;
        border: 1px solid #dee2e6;
      }
      
      .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
      }
      
      .progress-title {
        font-weight: 600;
      }
      
      .progress-percentage {
        font-weight: 600;
        color: #6c757d;
      }
      
      .progress-message {
        margin-bottom: 8px;
        font-size: 0.9rem;
        color: #6c757d;
      }
      
      .progress-bar-bg {
        height: 8px;
        background: #e9ecef;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .progress-bar-fill {
        height: 8px;
        width: 0;
        border-radius: 8px 0 0 8px;
        transition: width 0.35s ease;
      }
      
      .alert-primary .progress-bar-fill { background-color: #007bff; }
      .alert-success .progress-bar-fill { background-color: #28a745; }
      .alert-warning .progress-bar-fill { background-color: #ffc107; }
      .alert-danger .progress-bar-fill { background-color: #dc3545; }
      .alert-info .progress-bar-fill { background-color: #17a2b8; }
      .alert-light .progress-bar-fill { background-color: #f8f9fa; }
      .alert-dark .progress-bar-fill { background-color: #343a40; }
      
      .progress-bar-striped .progress-bar-fill {
        background-image: linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        );
        background-size: 1rem 1rem;
      }
      
      .progress-bar-animated .progress-bar-fill {
        animation: progress-bar-stripes 1s linear infinite;
      }
      
      @keyframes progress-bar-stripes {
        from { background-position: 1rem 0; }
        to { background-position: 0 0; }
      }
    `}</style>
  </div>
);

const UiAlertVariants = () => {
  // Toast Alerts State
  const [toasts, setToasts] = useState([
    { id: 1, show: false, variant: 'success', message: 'Action completed successfully!', position: 'bottom-right' },
    { id: 2, show: false, variant: 'danger', message: 'Error occurred while processing!', position: 'top-right' },
    { id: 3, show: false, variant: 'warning', message: 'Warning: This action cannot be undone!', position: 'top-center' },
    { id: 4, show: false, variant: 'info', message: 'New feature available!', position: 'bottom-left', title: 'Update' },
    { id: 5, show: false, variant: 'light', message: 'Did you know? You can drag these items.', position: 'bottom-center', icon: 'mdi-lightbulb-on' },
    { id: 6, show: false, variant: 'dark', message: 'System maintenance scheduled tonight.', position: 'top-left', autoClose: false }
  ]);

  // Banner Alert State
  const [bannerVisible, setBannerVisible] = useState(true);
  const [bannerConfirmed, setBannerConfirmed] = useState(false);

  // Progress Alert State
  const [progress, setProgress] = useState(0);

  // Show/hide toasts
  const showToast = (id) => {
    setToasts(toasts.map(t => t.id === id ? { ...t, show: true } : t));
  };

  const hideToast = (id) => {
    setToasts(toasts.map(t => t.id === id ? { ...t, show: false } : t));
  };

  // Simulate progress
  useEffect(() => {
    if (progress >= 100) return;
    const timer = setTimeout(() => setProgress(p => Math.min(100, p + 10)), 800);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <>
      <PageTitle motherMenu="UI Elements" activeMenu="Different Alerts" />
      
      <Row>
        {/* Toast Alerts */}
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Enhanced Toast Alerts</Card.Title>
              <Card.Subtitle className="text-muted">Multiple positions and styles</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <Row>
                {toasts.map(toast => (
                  <Col md={4} className="mb-3" key={toast.id}>
                    <Button 
                      variant={toast.variant} 
                      onClick={() => showToast(toast.id)}
                      disabled={toast.show}
                      block
                    >
                      Show {toast.variant} toast ({toast.position})
                    </Button>
                  </Col>
                ))}
              </Row>
              
              {toasts.map(toast => (
                <ToastAlert
                  key={toast.id}
                  show={toast.show}
                  variant={toast.variant}
                  message={toast.message}
                  position={toast.position}
                  onClose={() => hideToast(toast.id)}
                  duration={toast.duration || 4000}
                  icon={toast.icon}
                  title={toast.title}
                  autoClose={toast.autoClose !== false}
                />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Banner Alert */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Banner Alert</Card.Title>
              <Card.Subtitle className="text-muted">Full width alert with CTA</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              {bannerVisible ? (
                <BannerAlert
                  variant="info"
                  title="System Notification"
                  message="New version available. Please update for the best experience."
                  buttonText={bannerConfirmed ? "Updated" : "Update Now"}
                  onButtonClick={() => setBannerConfirmed(true)}
                  onClose={() => setBannerVisible(false)}
                  icon="mdi-alert-circle-outline"
                />
              ) : (
                <Button 
                  variant="info" 
                  onClick={() => {
                    setBannerVisible(true);
                    setBannerConfirmed(false);
                  }}
                >
                  Show Banner Alert
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Icon-Only Alerts */}
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Icon-Only Alerts</Card.Title>
              <Card.Subtitle className="text-muted">Minimal alerts with tooltips</Card.Subtitle>
            </Card.Header>
            <Card.Body style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <IconOnlyAlert variant="primary" icon="mdi-information" tooltip="Information" />
              <IconOnlyAlert variant="success" icon="mdi-check-circle" tooltip="Success" pulse />
              <IconOnlyAlert variant="warning" icon="mdi-alert" tooltip="Warning" size="large" />
              <IconOnlyAlert variant="danger" icon="mdi-alert-circle" tooltip="Danger" pulse />
              <IconOnlyAlert variant="info" icon="mdi-bell" tooltip="Notification" />
              <IconOnlyAlert variant="light" icon="mdi-lightbulb" tooltip="Idea" size="small" />
              <IconOnlyAlert variant="dark" icon="mdi-shield" tooltip="Security" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Progress Alerts */}
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Progress Alerts</Card.Title>
              <Card.Subtitle className="text-muted">Indicates progress of a task</Card.Subtitle>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <ProgressAlert 
                    variant="primary" 
                    title="File Upload" 
                    message="Uploading your files..." 
                    progress={progress} 
                    striped
                    animated
                  />
                </Col>
                <Col md={4}>
                  <ProgressAlert 
                    variant="success" 
                    title="Backup" 
                    message="Database backup in progress..." 
                    progress={progress >= 100 ? 100 : progress} 
                  />
                </Col>
                <Col md={4}>
                  <ProgressAlert 
                    variant="danger" 
                    title="Error Recovery" 
                    message="Attempting to recover corrupted files..." 
                    progress={progress % 100} 
                    striped
                  />
                </Col>
              </Row>
              <Button 
                variant="secondary" 
                onClick={() => setProgress(0)} 
                className="mt-3"
                disabled={progress < 100}
              >
                Reset Progress
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UiAlertVariants;