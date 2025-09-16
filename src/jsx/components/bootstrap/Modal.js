import React, { useState } from "react";
import { 
  X, Star, Heart, CheckCircle, AlertTriangle, Camera, Share2, Download, 
  Trash2, Sparkles, Zap, Bell, Maximize, Menu, User 
} from "lucide-react";
import "../../../../src/css/UniqueModals.css"; // We'll create this CSS file

const UniqueModals = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const openModal = (modalType) => {
    setIsAnimating(true);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => setActiveModal(null), 300);
  };

  // Glassmorphism Modal
  const GlassmorphismModal = () => (
    <div className={`thaniya-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-modal ${isAnimating ? 'thaniya-modal-visible' : ''}`}>
        <button 
          onClick={closeModal} 
          className="thaniya-close-button"
        >
          <X size={24} />
        </button>
        <div className="thaniya-modal-content">
          <div className="thaniya-modal-icon">
            <Star className="thaniya-star-icon" size={48} />
          </div>
          <h2 className="thaniya-modal-title">
            Glassmorphism Modal
          </h2>
          <p className="thaniya-modal-description">
            This modal uses glassmorphism design with backdrop blur and transparency effects.
          </p>
          <div className="thaniya-button-group">
            <button className="thaniya-secondary-button">
              Cancel
            </button>
            <button className="thaniya-primary-button">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Slide-in Card Modal
  const SlideCardModal = () => (
    <div className={`thaniya-slide-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-slide-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-slide-modal ${isAnimating ? 'thaniya-slide-modal-visible' : ''}`}>
        <div className="thaniya-slide-content">
          <div className="thaniya-slide-header">
            <h2 className="thaniya-slide-title">Profile Settings</h2>
            <button 
              onClick={closeModal} 
              className="thaniya-slide-close-button"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="thaniya-slide-body">
            <div className="thaniya-profile-card">
              <div className="thaniya-profile-avatar">
                <User className="thaniya-user-icon" size={24} />
              </div>
              <div>
                <h3 className="thaniya-profile-name">John Doe</h3>
                <p className="thaniya-profile-email">john.doe@example.com</p>
              </div>
            </div>
            
            <div className="thaniya-options-list">
              {[
                { icon: Heart, label: 'Favorites', color: '#ef4444' },
                { icon: Share2, label: 'Share Profile', color: '#3b82f6' },
                { icon: Download, label: 'Export Data', color: '#10b981' }
              ].map((item, index) => (
                <div key={index} className="thaniya-option-item">
                  <div className="thaniya-option-content">
                    <item.icon style={{ color: item.color }} size={20} />
                    <span>{item.label}</span>
                  </div>
                  <span className="thaniya-option-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="thaniya-save-button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // Notification Toast Modal
  const NotificationModal = () => (
    <div className={`thaniya-notification ${isAnimating ? 'thaniya-notification-visible' : ''}`}>
      <div className="thaniya-notification-card">
        <div className="thaniya-notification-content">
          <CheckCircle className="thaniya-check-icon" size={24} />
          <div className="thaniya-notification-text">
            <h3 className="thaniya-notification-title">Success!</h3>
            <p className="thaniya-notification-message">
              Your changes have been saved successfully.
            </p>
            <div className="thaniya-notification-actions">
              <button 
                onClick={closeModal} 
                className="thaniya-dismiss-button"
              >
                Dismiss
              </button>
              <button className="thaniya-view-button">
                View Details
              </button>
            </div>
          </div>
          <button 
            onClick={closeModal} 
            className="thaniya-notification-close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Fullscreen Overlay Modal
  const FullscreenModal = () => (
    <div className={`thaniya-fullscreen ${isAnimating ? 'thaniya-fullscreen-visible' : ''}`}>
      <div className="thaniya-fullscreen-backdrop"></div>
      <div className="thaniya-fullscreen-content">
        <button 
          onClick={closeModal} 
          className="thaniya-fullscreen-close"
        >
          <X size={32} />
        </button>
        
        <div className={`thaniya-fullscreen-main ${isAnimating ? 'thaniya-fullscreen-main-visible' : ''}`}>
          <div className="thaniya-fullscreen-icon-container">
            <AlertTriangle className="thaniya-alert-icon" size={64} />
          </div>
          <h1 className="thaniya-fullscreen-title">
            Are you sure?
          </h1>
          <p className="thaniya-fullscreen-message">
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </p>
          
          <div className="thaniya-fullscreen-buttons">
            <button 
              onClick={closeModal}
              className="thaniya-fullscreen-cancel"
            >
              Cancel
            </button>
            <button className="thaniya-fullscreen-delete">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Bottom Sheet Modal
  const BottomSheetModal = () => (
    <div className={`thaniya-bottomsheet-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
      <div className="thaniya-bottomsheet-backdrop" onClick={closeModal}></div>
      <div className={`thaniya-bottomsheet ${isAnimating ? 'thaniya-bottomsheet-visible' : ''}`}>
        <div className="thaniya-bottomsheet-content">
          <div className="thaniya-bottomsheet-handle"></div>
          <h2 className="thaniya-bottomsheet-title">
            Choose an Action
          </h2>
          
          <div className="thaniya-bottomsheet-grid">
            {[
              { icon: Camera, label: 'Camera', color: '#3b82f6', bg: '#dbeafe' },
              { icon: Download, label: 'Gallery', color: '#10b981', bg: '#d1fae5' },
              { icon: Share2, label: 'Share', color: '#a855f7', bg: '#f3e8ff' }
            ].map((item, index) => (
              <button key={index} className="thaniya-bottomsheet-option">
                <item.icon style={{ color: item.color }} size={32} />
                <span className="thaniya-option-label">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={closeModal}
            className="thaniya-bottomsheet-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const NormalModal = () => (
  <div className={`thaniya-normal-overlay ${isAnimating ? 'thaniya-overlay-visible' : ''}`}>
    <div className="thaniya-normal-backdrop" onClick={closeModal}></div>
    <div className={`thaniya-normal-modal ${isAnimating ? 'thaniya-normal-modal-visible' : ''}`}>
      <div className="thaniya-normal-header">
        <h2 className="thaniya-normal-title">Standard Modal</h2>
        <button 
          onClick={closeModal} 
          className="thaniya-normal-close"
        >
          <X size={20} />
        </button>
      </div>
      <div className="thaniya-normal-body">
        <p>This is a simple modal with basic styling and functionality.</p>
        <p>You can put any content here - forms, messages, or other components.</p>
      </div>
      <div className="thaniya-normal-footer">
        <button 
          onClick={closeModal}
          className="thaniya-normal-secondary"
        >
          Cancel
        </button>
        <button className="thaniya-normal-primary">
          Confirm
        </button>
      </div>
    </div>
  </div>
);

  const modalData = [
    {
      id: 'glassmorphism',
      title: 'Glassmorphism Modal',
      description: 'Beautiful glass effect with backdrop blur and transparency',
      icon: Sparkles,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      tag: 'Premium',
      tagColor: '#a855f7'
    },
    {
      id: 'slideCard',
      title: 'Slide-in Card',
      description: 'Slides in from the right with smooth animations',
      icon: Zap,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      tag: 'Popular',
      tagColor: '#ec4899'
    },
    {
      id: 'notification',
      title: 'Notification Toast',
      description: 'Toast-style notification that slides from the top',
      icon: Bell,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      tag: 'New',
      tagColor: '#3b82f6'
    },
    {
      id: 'fullscreen',
      title: 'Fullscreen Overlay',
      description: 'Immersive fullscreen experience with gradient background',
      icon: Maximize,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      tag: 'Featured',
      tagColor: '#f59e0b'
    },
    {
      id: 'bottomSheet',
      title: 'Bottom Sheet',
      description: 'Mobile-style bottom sheet with smooth slide animation',
      icon: Menu,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      tag: 'Mobile',
      tagColor: '#14b8a6'
    },
    {
  id: 'normal',
  title: 'Standard Modal',
  description: 'A clean, simple modal with basic functionality',
  icon: CheckCircle,
  gradient: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
  tag: 'Basic',
  tagColor: '#6b7280'
},

  ];

  const modals = {
    glassmorphism: <GlassmorphismModal />,
    slideCard: <SlideCardModal />,
    notification: <NotificationModal />,
    fullscreen: <FullscreenModal />,
    bottomSheet: <BottomSheetModal />,
    normal: <NormalModal />,

  };

  return (
    <div className="thaniya-container">
      {/* Animated Background Elements */}
      <div className="thaniya-background-elements">
        <div className="thaniya-bg-circle thaniya-bg-circle-1"></div>
        <div className="thaniya-bg-circle thaniya-bg-circle-2"></div>
        <div className="thaniya-bg-circle thaniya-bg-circle-3"></div>
      </div>
      
      <div className="thaniya-content">
        {/* Hero Section */}
        <div className="thaniya-hero">
          <h1 className="thaniya-hero-title">
            Modal{' '}
          </h1>
          <div className="thaniya-features">
            {[
              { icon: Sparkles, label: 'Premium Effects' },
              { icon: Zap, label: 'Smooth Animations' },
              { icon: Star, label: 'Modern Design' }
            ].map((item, index) => (
              <div key={index} className="thaniya-feature-item">
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Cards Grid */}
        <div className="thaniya-modal-grid">
          {modalData.map((modal) => (
            <div
              key={modal.id}
              className={`thaniya-modal-card ${hoveredCard === modal.id ? 'thaniya-modal-card-hover' : ''}`}
              onMouseEnter={() => setHoveredCard(modal.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => openModal(modal.id)}
            >
              {/* Tag */}
              <div className="thaniya-modal-tag" style={{ backgroundColor: modal.tagColor }}>
                {modal.tag}
              </div>
              
              {/* Icon Background */}
              <div 
                className={`thaniya-modal-icon-container ${hoveredCard === modal.id ? 'thaniya-modal-icon-hover' : ''}`}
                style={{ background: modal.gradient }}
              >
                <modal.icon className="thaniya-modal-card-icon" size={32} />
              </div>

              {/* Content */}
              <div className="thaniya-modal-card-content">
                <h3 className="thaniya-modal-card-title">
                  {modal.title}
                </h3>
                <p className="thaniya-modal-card-description">
                  {modal.description}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(modal.id);
                }}
                className={`thaniya-modal-button ${hoveredCard === modal.id ? 'thaniya-modal-button-hover' : ''}`}
                style={{ background: modal.gradient }}
              >
                Experience Modal
                <span className={`thaniya-button-arrow ${hoveredCard === modal.id ? 'thaniya-button-arrow-hover' : ''}`}>
                  →
                </span>
              </button>
            </div>
          ))}
        </div>

      </div>

      {activeModal && modals[activeModal]}
    </div>
  );
};

export default UniqueModals;