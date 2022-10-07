let $accessToken:string;
let $refreshToken:string;

import { router } from "./main";


function getAccessToken() {
  return $accessToken;
}

function setAccessToken (newAccessToken:string) {
  $accessToken = newAccessToken;
}

function getRefreshToken() {
  return $refreshToken;
}

function setRefreshToken (newRefreshToken:string) {
  $refreshToken = newRefreshToken;
}


function refreshTokens() {
  fetch("http://localhost:8080/api/token/refresh", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getRefreshToken(),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error_message === undefined) {
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
      } else {
        router.push({ path: "/login" });
      }
    })
    .then(() => console.log(getAccessToken()));
}

export {
  setAccessToken, getAccessToken, setRefreshToken, getRefreshToken, refreshTokens
};