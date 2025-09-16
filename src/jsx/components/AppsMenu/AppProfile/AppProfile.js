import React, { useState } from "react";
import { 
  Edit3, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Droplets,
  X,
  Check,
  Sun,
  Moon,
  MapPin,
  Shield
} from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "Mitchell C. Shay",
    email: "hello@mitchellshay.com",
    phone: "+1 (123) 456-7890",
    altPhone: "+1 (987) 654-3210",
    dob: "1990-05-15",
    bloodGroup: "O+",
    address: "123 Main Street, New York, NY 10001"
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...userData });
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEditMode = () => {
    if (editMode) {
      setUserData({ ...tempData });
    } else {
      setTempData({ ...userData });
    }
    setEditMode(!editMode);
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const contactItems = [
    { icon: Mail, label: "Email", name: "email", type: "email" },
    { icon: Phone, label: "Phone", name: "phone", type: "tel" },
    { icon: Phone, label: "Alternative Phone", name: "altPhone", type: "tel" },
    { icon: Calendar, label: "Date of Birth", name: "dob", type: "date" },
    { icon: Droplets, label: "Blood Group", name: "bloodGroup", type: "text" },
    { icon: MapPin, label: "Address", name: "address", type: "text" }
  ];

  // Theme styles with red color scheme
  const themes = {
    light: {
      background: '#f8f9fa',
      cardBg: 'white',
      cardBorder: '#e9ecef',
      contactCardBg: '#f8f9fa',
      contactCardBorder: '#e9ecef',
      textPrimary: '#212529',
      textSecondary: '#6c757d',
      inputBg: 'white',
      inputBorder: '#ced4da',
      footerBg: '#f8f9fa',
      footerBorder: '#e9ecef',
      headerBg: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
      iconBg: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
      accentColor: '#cb2d3e'
    },
    dark: {
      background: '#0f1419',
      cardBg: '#1a1f2e',
      cardBorder: '#2d3748',
      contactCardBg: '#2d3748',
      contactCardBorder: '#4a5568',
      textPrimary: '#e2e8f0',
      textSecondary: '#a0aec0',
      inputBg: '#1a1f2e',
      inputBorder: '#4a5568',
      footerBg: '#2d3748',
      footerBorder: '#4a5568',
      headerBg: 'linear-gradient(135deg, #8a1c26, #c0392b)',
      iconBg: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
      accentColor: '#ef473a'
    }
  };

  const currentTheme = isDarkTheme ? themes.dark : themes.light;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentTheme.background,
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        backgroundColor: currentTheme.cardBg,
        borderRadius: '20px',
        boxShadow: isDarkTheme ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: `1px solid ${currentTheme.cardBorder}`,
        transition: 'all 0.3s ease'
      }}>
        {/* Header Section */}
        <div style={{
          background: currentTheme.headerBg,
          color: 'white',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              padding: '0.5rem',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#cb2d3e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '45px',
              height: '45px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Edit Button */}
          <button 
            onClick={toggleEditMode}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: editMode ? '#10b981' : 'rgba(255, 255, 255, 0.9)',
              color: editMode ? 'white' : '#cb2d3e',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {editMode ? <Save size={16} /> : <Edit3 size={16} />}
            {editMode ? 'Save' : 'Edit'}
          </button>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            {/* User Initials Avatar */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1.5rem',
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {editMode ? (
                <input
                  name="name"
                  value={tempData.name}
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    maxWidth: '400px',
                    padding: '0.75rem',
                    textAlign: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    border: 'none',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.7)',
                    borderRadius: 0,
                    backgroundColor: 'transparent',
                    color: 'white',
                    outline: 'none',
                    margin: '0 auto'
                  }}
                  placeholder="Full Name"
                />
              ) : (
                <h1 style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  margin: '0 0 0.5rem 0',
                  color: 'white'
                }}>{userData.name}</h1>
              )}
            </div>
            
            {/* Security Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              fontSize: '0.9rem',
              marginTop: '0.5rem'
            }}>
              <Shield size={16} />
              Verified Account
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2.5rem' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: currentTheme.accentColor,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <User size={20} />
            Personal Details
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  backgroundColor: currentTheme.contactCardBg,
                  borderRadius: '12px',
                  border: `1px solid ${currentTheme.contactCardBorder}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: currentTheme.iconBg,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: currentTheme.textSecondary,
                      marginBottom: '0.5rem'
                    }}>
                      {item.label}
                    </div>
                    {editMode ? (
                      <input
                        type={item.type}
                        name={item.name}
                        value={tempData[item.name]}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: `1px solid ${currentTheme.inputBorder}`,
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          backgroundColor: currentTheme.inputBg,
                          color: currentTheme.textPrimary
                        }}
                        placeholder={item.label}
                      />
                    ) : (
                      <div style={{
                        fontSize: '1rem',
                        color: currentTheme.textPrimary,
                        fontWeight: '500',
                        wordBreak: 'break-word'
                      }}>
                        {userData[item.name]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {editMode && (
          <div style={{
            backgroundColor: currentTheme.footerBg,
            padding: '1.5rem 2.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            borderTop: `1px solid ${currentTheme.footerBorder}`,
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={() => {
                setEditMode(false);
                setTempData({ ...userData });
              }}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.inputBorder}`,
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                backgroundColor: currentTheme.inputBg,
                color: currentTheme.textSecondary
              }}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={toggleEditMode}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                background: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
                color: 'white'
              }}
            >
              <Check size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;