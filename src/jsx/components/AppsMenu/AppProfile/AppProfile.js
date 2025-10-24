import React, { useState, useEffect } from "react";
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
  Shield,
  AlertCircle
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5008/";

const Profile = () => {
  const [userData, setUserData] = useState({
    id: "",
    full_name: "Mitchell C. Shay",
    email: "hello@mitchellshay.com",
    mobile_number: "+1 (123) 456-7890",
    altPhone: "+1 (987) 654-3210",
    dob: "1990-05-15",
    bloodGroup: "O+",
    address: "123 Main Street, New York, NY 10001"
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({ ...userData });
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get current user ID from token or context (you might need to adjust this)
  const getCurrentUserId = () => {
    // This should be replaced with your actual user ID retrieval logic
    // For example, from localStorage, context, or Redux store
    const token = localStorage.getItem('authtoken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        setMessage({ type: 'error', text: 'User not authenticated' });
        return;
      }

      const token = localStorage.getItem('authtoken');
      const response = await fetch(`${API_BASE_URL}authRoutes/getby/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          const user = result.data;
          setUserData(prev => ({
            ...prev,
            id: user.id,
            full_name: user.full_name || prev.full_name,
            email: user.email || prev.email,
            mobile_number: user.mobile_number || prev.mobile_number
          }));
          setTempData(prev => ({
            ...prev,
            id: user.id,
            full_name: user.full_name || prev.full_name,
            email: user.email || prev.email,
            mobile_number: user.mobile_number || prev.mobile_number
          }));
        }
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage({ type: 'error', text: 'Failed to load user data' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const token = localStorage.getItem('authtoken');
      const updateData = {
        full_name: userData.full_name,
        email: userData.email,
        mobile_number: userData.mobile_number
        // Add other fields as needed based on your API
      };

      const response = await fetch(`${API_BASE_URL}authRoutes/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      return result.data;

    } catch (error) {
      console.error('Update error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = async () => {
    if (editMode) {
      try {
        const updatedUser = await updateProfile(tempData);
        setUserData({ ...tempData });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
        
      } catch (error) {
        // Error is already handled in updateProfile
        return; // Don't exit edit mode if update failed
      }
    } else {
      setTempData({ ...userData });
    }
    setEditMode(!editMode);
  };

  const cancelEdit = () => {
    setTempData({ ...userData });
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const contactItems = [
    { icon: Mail, label: "Email", name: "email", type: "email" },
    { icon: Phone, label: "Phone", name: "mobile_number", type: "tel" },
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
      accentColor: '#cb2d3e',
      success: '#10b981',
      error: '#ef4444'
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
      accentColor: '#ef473a',
      success: '#10b981',
      error: '#ef4444'
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
            disabled={loading}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: editMode ? currentTheme.success : 'rgba(255, 255, 255, 0.9)',
              color: editMode ? 'white' : '#cb2d3e',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? (
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : editMode ? (
              <Save size={16} />
            ) : (
              <Edit3 size={16} />
            )}
            {editMode ? (loading ? 'Saving...' : 'Save') : 'Edit'}
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
              {userData.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {editMode ? (
                <input
                  name="full_name"
                  value={tempData.full_name}
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
                }}>{userData.full_name}</h1>
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

        {/* Message Alert */}
        {message.text && (
          <div style={{
            padding: '1rem 2.5rem',
            backgroundColor: message.type === 'error' ? currentTheme.error : currentTheme.success,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={16} />
            {message.text}
          </div>
        )}

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
              onClick={cancelEdit}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: `1px solid ${currentTheme.inputBorder}`,
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                backgroundColor: currentTheme.inputBg,
                color: currentTheme.textSecondary,
                opacity: loading ? 0.7 : 1
              }}
            >
              <X size={16} />
              Cancel
            </button>
            <button
              onClick={toggleEditMode}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                background: 'linear-gradient(135deg, #cb2d3e, #ef473a)',
                color: 'white',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <Check size={16} />
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;