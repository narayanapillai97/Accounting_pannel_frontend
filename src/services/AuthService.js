import axios from 'axios';
import swal from "sweetalert";
import { loginConfirmedAction, Logout } from '../store/actions/AuthActions';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5008';

export function signUp(email, password, userData = {}) {
  return axios.post(`${API_BASE_URL}/authroutes/signup`, { // Changed from login to signup
    email,
    password,
    ...userData
  }).then((response) => {
    console.log('✅ Signup successful:', response.data);
    return {
      data: {
        email: response.data.user.email,
        idToken: response.data.token,
        localId: response.data.user.id,
        expiresIn: response.data.expiresIn || 3600, // Use server value or default to seconds
        refreshToken: response.data.refreshToken,
        role: response.data.user.role,
      },
    };
  });
}

export function login(email, password) {
  return axios.post(`${API_BASE_URL}/authroutes/login`, {
    email,
    password
  }).then((response) => {
    console.log('✅ Login successful:', response.data);
    console.log('⏰ Token expires in:', response.data.expiresIn, 'seconds');
    localStorage.setItem("authtoken",response.data.token);
    
    return {
      data: {
        email: response.data.user.email,
        idToken: response.data.token,
        localId: response.data.user.id,
        expiresIn: response.data.expiresIn || 3600, // Use server value or default to seconds
        refreshToken: response.data.refreshToken,
        role: response.data.user.role,
      },
    };
  });
}

export function formatError(error) {
  console.error('❌ Auth Error:', error);
  
  if (error.response?.data?.message) {
    const message = error.response.data.message;
    
    // Show SweetAlert for different error types
    switch (message.toLowerCase()) {
      case 'invalid email or password':
      case 'email not found':
        swal("Oops", "Invalid email or password", "error", { button: "Try Again!" });
        break;
      case 'email already exists':
        swal("Oops", "Email already exists", "error");
        break;
      case 'user disabled':
        swal("Account Disabled", "Your account has been disabled", "error");
        break;
      default:
        swal("Error", message, "error");
    }
    
    return message;
  }
  
  if (error.message) {
    swal("Error", error.message, "error");
    return error.message;
  }
  
  swal("Error", "Authentication failed", "error");
  return "Authentication failed";
}

export function saveTokenInLocalStorage(tokenDetails) {
  // Convert seconds to milliseconds for JavaScript Date object
  const expireDate = new Date().getTime() + (tokenDetails.expiresIn * 1000);
  tokenDetails.expireDate = new Date(expireDate);
  
  console.log('💾 Saving token to localStorage:');
  console.log('⏰ Expires in:', tokenDetails.expiresIn, 'seconds');
  console.log('📅 Expire date:', tokenDetails.expireDate);
  console.log('⏰ Current time:', new Date().toISOString());
  
  localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
  console.log('⏰ Setting logout timer for:', timer, 'ms');
  setTimeout(() => {
    console.log('⏰ Logout timer expired - logging out');
    dispatch(Logout(navigate));
  }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
  const tokenDetailsString = localStorage.getItem('userDetails');
  
  if (!tokenDetailsString) {
    console.log('❌ No token found in localStorage');
    dispatch(Logout(navigate));
    return;
  }

  try {
    const tokenDetails = JSON.parse(tokenDetailsString);
    console.log('🔍 Auto-login check:');
    console.log('📅 Token expire date:', tokenDetails.expireDate);
    console.log('⏰ Current time:', new Date().toISOString());
    
    // const expireDate = new Date(tokenDetails.expireDate);
    const todaysDate = new Date();

    // if (todaysDate > expireDate) {
    //   console.log('❌ Token expired - logging out');
    //   dispatch(Logout(navigate));
    //   return;
    // }
    
    console.log('✅ Token valid - auto-login');
    dispatch(loginConfirmedAction(tokenDetails));
    
    // const timer = expireDate.getTime() - todaysDate.getTime();
    // runLogoutTimer(dispatch, timer, navigate);
    
  } catch (error) {
    console.error('❌ Error parsing token:', error);
    dispatch(Logout(navigate));
  }
}

// Debug function to check token status
export function debugToken() {
  const tokenDetailsString = localStorage.getItem('userDetails');
  if (!tokenDetailsString) {
    console.log('❌ No token found in localStorage');
    return;
  }

  try {
    const tokenDetails = JSON.parse(tokenDetailsString);
    console.log('🔍 Token Debug Info:');
    console.log('📧 Email:', tokenDetails.email);
    console.log('👤 Role:', tokenDetails.role);
    console.log('⏰ expiresIn:', tokenDetails.expiresIn, 'seconds');
    console.log('📅 expireDate:', tokenDetails.expireDate);
    console.log('⏰ Current time:', new Date().toISOString());
    
    const expireDate = new Date(tokenDetails.expireDate);
    const currentDate = new Date();
    const isExpired = currentDate > expireDate;
    const timeUntilExpiration = expireDate.getTime() - currentDate.getTime();
    
    console.log('❓ Is token expired?', isExpired);
    console.log('⏱️ Time until expiration:', Math.floor(timeUntilExpiration / 1000), 'seconds');
    console.log('🔑 Token (first 50 chars):', tokenDetails.idToken?.substring(0, 50) + '...');
    
  } catch (error) {
    console.error('❌ Error debugging token:', error);
  }
}