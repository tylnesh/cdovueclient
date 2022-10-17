let $accessToken:string;
let $refreshToken:string;

import { Ref } from "vue";
import { router } from "./main";


const getAccessToken = () => {
  return $accessToken;
};

const setAccessToken = (newAccessToken:string) => {
  $accessToken = newAccessToken;
};

const getRefreshToken = () => {
  return $refreshToken;
};

const setRefreshToken = (newRefreshToken:string) => {
  $refreshToken = newRefreshToken;
};


const refreshTokens = async () => {
  const request = await fetch("http://localhost:8080/api/token/refresh", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getRefreshToken(),
    },
  });

  const data = await request.json();
  if (data.error_message === undefined) {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
      } else {
        router.push({ path: "/login" });
      }
};

const sendToBackend = async (url:string, method:string, formBody:string) => {
  await fetch(url, {
    method: method,
    headers: {
      Authorization: "Bearer " + getAccessToken(),
      "Content-Type": "application/json",
    },
    body: formBody,
  });
};



const refreshTable = async (retrieveUrl:string) => {
  const request = await fetch(retrieveUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  if (request.status == 403) {
    await refreshTokens();
    return await refreshTable(retrieveUrl);
  } else {
    const json = await request.json();
    return await json["content"];
  }
};


export {
  setAccessToken, getAccessToken, 
  setRefreshToken, getRefreshToken, 
  refreshTokens, sendToBackend,
  refreshTable
};