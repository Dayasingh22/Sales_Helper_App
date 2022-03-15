const actions = {
  LOGIN_BEGIN: 'LOGIN_BEGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERR: 'LOGIN_ERR',

  LOGOUT_BEGIN: 'LOGOUT_BEGIN',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_ERR: 'LOGOUT_ERR',

  SIGNUP_BEGIN: 'SIGNUP_BEGIN',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_ERR: 'SIGNUP_ERR',

  VALIDATE_OTP: 'VALIDATE_OTP',
  VALIDATE_OTP_START: 'VALIDATE_OTP_START',
  VALIDATE_OTP_SUCCESS: 'VALIDATE_OTP_SUCCESS',
  VALIDATE_OTP_ERR: 'VALIDATE_OTP_ERR',

  AUTO_LOGIN: 'AUTO_LOGIN',
  CLEAR_AUTH_MSG: 'CLEAR_AUTH_MSG',

  SET_USER_AUTH_TOKEN: 'SET_USER_AUTH_TOKEN',
  RESET_USER_AUTH_TOKEN: 'RESET_USER_AUTH_TOKEN',

  TEMP_AUTH_INFO: 'TEMP_AUTH_INFO',

  loginBegin: () => {
    return {
      type: actions.LOGIN_BEGIN,
    };
  },

  loginSuccess: data => {
    return {
      type: actions.LOGIN_SUCCESS,
      data,
    };
  },

  loginErr: err => {
    return {
      type: actions.LOGIN_ERR,
      err,
    };
  },

  logoutBegin: () => {
    return {
      type: actions.LOGOUT_BEGIN,
    };
  },

  logoutSuccess: data => {
    return {
      type: actions.LOGOUT_SUCCESS,
      data,
    };
  },

  logoutErr: err => {
    return {
      type: actions.LOGOUT_ERR,
      err,
    };
  },

  signupBegin: () => {
    return {
      type: actions.SIGNUP_BEGIN
    }
  },

  signupSuccess: (data) => {
    return {
      type: actions.SIGNUP_SUCCESS,
      data
    }
  },
  signupError: (err) => {
    return {
      type: actions.SIGNUP_ERR,
      err
    }
  },

  validateOtp: (data) => {
    return {
      type: actions.VALIDATE_OTP,
      data
    }
  },

  validateOtpBegin: () => {
    return {
      type: actions.VALIDATE_OTP_START
    }
  },

  validateOtpSuccess: () => {
    return {
      type: actions.VALIDATE_OTP_SUCCESS
    }
  },

  validateOtpError: (err) => {
    return {
      type: actions.VALIDATE_OTP_ERR,
      err
    }
  },

  clearAuthMessage: () => {
    return {
      type: actions.CLEAR_AUTH_MSG
    }
  },

  autoLogin: (data) => {
    return {
      type: actions.AUTO_LOGIN,
      data
    }
  },

  setUserAuthToken: (token) => {
    return {
      type: actions.SET_USER_AUTH_TOKEN,
      token
    }
  },

  resetUserAuthToken: () => {
    return {
      type: actions.RESET_USER_AUTH_TOKEN
    }
  },

  tempAuthInfo: (username, password) => {
    console.log(`Doing temp auth ${username} ${password}`);
    return {
      type: actions.TEMP_AUTH_INFO,
      data: {username: username, password: password}
    }
  }
  
};

export default actions;
