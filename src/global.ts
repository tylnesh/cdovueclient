let $accessToken:string;
let $refreshToken:string;

function getAccessToken() {
  return $accessToken
}

function setAccessToken (newAccessToken:string) {
  $accessToken = newAccessToken;
}

function getRefreshToken() {
  return $refreshToken
}

function setRefreshToken (newRefreshToken:string) {
  $refreshToken = newRefreshToken;
}

export {
  setAccessToken, getAccessToken, setRefreshToken, getRefreshToken
}