import {
    formatError,
    login,
    runLogoutTimer,
    saveTokenInLocalStorage,
    signUp,
    debugToken // Add debug function
} from '../../services/AuthService';

export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

export function signupAction(email, password, navigate, userData = {}) {
    return (dispatch) => {
        console.log('🚀 Starting signup action...');
        dispatch(loadingToggleAction(true));
        
        signUp(email, password, userData)
        .then((response) => {
            console.log('✅ Signup successful, saving token...');
            saveTokenInLocalStorage(response.data);
            
            // Convert seconds to milliseconds for timer
            const timer = response.data.expiresIn * 1000;
            runLogoutTimer(dispatch, timer, navigate);
            
            dispatch(confirmedSignupAction(response.data));
            dispatch(loadingToggleAction(false));
            navigate('/dashboard');
        })
        .catch((error) => {
            console.error('❌ Signup failed:', error);
            const errorMessage = formatError(error);
            dispatch(signupFailedAction(errorMessage));
            dispatch(loadingToggleAction(false));
        });
    };
}

export function Logout(navigate) {
    console.log('🚪 Logging out...');
    localStorage.removeItem('userDetails');
    if (navigate) {
        navigate('/login');
    }
    
    return {
        type: LOGOUT_ACTION,
    };
}

export function loginAction(email, password, navigate) {
    return (dispatch) => {
        console.log('🚀 Starting login action...');
        dispatch(loadingToggleAction(true));
        
        login(email, password)
        .then((response) => {
            console.log('✅ Login successful, saving token...',response.data);
            saveTokenInLocalStorage(response.data);
            
            // Convert seconds to milliseconds for timer
            const timer = response.data.expiresIn * 1000;
            runLogoutTimer(dispatch, timer, navigate);
            
            dispatch(loginConfirmedAction(response.data));
            dispatch(loadingToggleAction(false));
            
            // Debug token before navigation
            debugToken();
            
            navigate('/dashboard');
        })
        .catch((error) => {
            console.error('❌ Login failed:', error);
            const errorMessage = formatError(error);
            dispatch(loginFailedAction(errorMessage));
            dispatch(loadingToggleAction(false));
        });
    };
}

export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

export function loginConfirmedAction(data) {
    console.log('✅ Login confirmed action:', data);
    return {
        type: LOGIN_CONFIRMED_ACTION,
        payload: data,
    };
}

export function confirmedSignupAction(payload) {
    return {
        type: SIGNUP_CONFIRMED_ACTION,
        payload,
    };
}

export function signupFailedAction(message) {
    return {
        type: SIGNUP_FAILED_ACTION,
        payload: message,
    };
}

export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}

// Add debug action
export function debugTokenAction() {
    return () => {
        debugToken();
    };
}