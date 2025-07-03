// import axios from 'axios';
// import { put } from 'redux-saga/effects';
// import config from '../config';
// import { Base64 } from 'js-base64';

// function* commonApi(value) {
//   try {
//     // Get token from localStorage or config
//     const token = localStorage.getItem(config.token) || config.token;

//     // Build authorization header
//     let authorization = '';
//     if (value.authorization === 'Basic') {
//       const credentials = `${value.body.email}:${value.body.password}`;
//       authorization = 'Basic ' + Base64.btoa(credentials);
//     } else if (value.authorization === 'Bearer' || value.authorization === true) {
//       authorization = `Bearer ${token}`;
//     }

//     // Check if body is FormData
//     const isFormData = value.body instanceof FormData;

//     // Configure headers
//     const headers = {
//       Accept: 'application/json',
//       ...(authorization && { Authorization: authorization }),
//       ...(!isFormData && { 'Content-Type': 'application/json' }),
//     };

//     // Axios request config
//     const axiosConfig = {
//       url: value.api,
//       method: value.method.toLowerCase(),
//       headers,
//       ...(value.body && !['get', 'head'].includes(value.method.toLowerCase()) && {
//         data: value.body,
//       }),
//       ...(value.method.toLowerCase() === 'get' && value.body && {
//         params: value.body,
//       }),
//     };

//     console.log('API Request:', axiosConfig);

//     // Perform API request
//     const response = yield axios(axiosConfig);
//     const data = response.data;

//     console.log('API Response:', data);

//     // Dispatch success action
//     if (value.successAction) {
//       yield put({
//         type: value.successAction.type,
//         payload: data,
//       });
//     }

//     return data;

//   } catch (error) {
//     let errorMessage = 'Unknown error';

//     if (error.response) {
//       errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText;
//     } else if (error.message) {
//       errorMessage = error.message;
//     }

//     console.error('API Error:', errorMessage);

//     // Dispatch fail action
//     if (value.failAction) {
//       yield put({
//         type: value.failAction.type,
//         payload: errorMessage,
//       });
//     }

//     throw new Error(errorMessage);
//   }
// }

// export default commonApi;


// -----------------------------------------------------------------------

import axios from 'axios';
import { put } from 'redux-saga/effects';
import config from '../config';
import { Base64 } from 'js-base64';

function* commonApi(value) {
  try {
    // Validate inputs
    if (!value.api || !value.method) {
      throw new Error('API URL and method are required');
    }

    // Get token from localStorage or config
    const token = localStorage.getItem(config.token) || config.token;

    // Build authorization header
    let authorization = '';
    if (value.authorization === 'Basic') {
      const { email, password } = value.body || {};
      if (!email || !password) {
        throw new Error('Missing Basic auth credentials');
      }
      authorization = 'Basic ' + Base64.btoa(`${email}:${password}`);
    } else if (value.authorization === 'Bearer' || value.authorization === true) {
      if (!token) {
        throw new Error('Bearer token is required');
      }
      authorization = `Bearer ${token}`;
    }

    // Check if body is FormData
    const isFormData = value.body instanceof FormData;

    // Configure headers
    const headers = {
      Accept: 'application/json',
      ...(authorization && { Authorization: authorization }),
      ...(!isFormData && { 'Content-Type': 'application/json' }),
    };

    // Axios request config
    const axiosConfig = {
      url: value.api,
      method: value.method.toLowerCase(),
      headers,
      ...(value.body && !['get', 'head'].includes(value.method.toLowerCase()) && {
        data: value.body,
      }),
      ...(value.method.toLowerCase() === 'get' && value.body && {
        params: value.body,
      }),
    };

    console.log('API Request:', {
      url: axiosConfig.url,
      method: axiosConfig.method,
      headers: axiosConfig.headers,
      bodyType: isFormData ? 'FormData' : 'JSON',
    });

    // Perform API request
    const response = yield axios(axiosConfig);
    const data = response.data;

    console.log('API Response:', data);

    // Dispatch success action
    if (value.successAction) {
      yield put({
        type: value.successAction.type,
        payload: data,
      });
    }

    return data;
  } catch (error) {
    let errorMessage = 'Unknown error';
    let statusCode = null;

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || error.response.data?.error || error.response.statusText;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('API Error:', { message: errorMessage, status: statusCode });

    // Dispatch fail action
    if (value.failAction) {
      yield put({
        type: value.failAction.type,
        payload: { message: errorMessage, status: statusCode },
      });
    }

    throw new Error(errorMessage);
  }
}

export default commonApi;