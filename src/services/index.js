import axios from 'axios';
import {API} from '../constants/api';

export const loginApi = (data) => {
  return axios.post(
    API.baseUrls[API.currentEnv] + API.authUrls.loginPath,
    data,
  );
};

export const getPostList = (token, url) => {
  return axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export const postApi = (token, data) => {
  return fetch(API.baseUrls[API.currentEnv] + API.authUrls.getPostList, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
};
