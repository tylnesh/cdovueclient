let $accessToken:string;
let $refreshToken:string;

import { Ref, ref } from "vue";
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


// Returns Promise<any> because the formatting of the 
// rows/content varies depending on the specific table
const refreshTable = async (retrieveUrl:string):  Promise<any> => {
  const request = await fetch(retrieveUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  if (request.status == 403) {
    await refreshTokens();
    //return await refreshTable(retrieveUrl);
  } else {
    const json = await request.json();
    const rows: Ref<Array<{ id: number; dealer: string; slug: string }>> = ref([]);
    const pagination = ref({
      sortBy: "desc",
      descending: false,
      page: 0,
      rowsPerPage: 20,
      rowsNumber: 0,
    });



    pagination.value.page = await json["number"];
    pagination.value.rowsPerPage =  await json["size"];
    pagination.value.rowsNumber = await json["totalElements"];
    rows.value =  await json["content"];

    const serverData = ref({rows, pagination});
    return JSON.stringify(serverData.value);
  }
};


export {
  setAccessToken, getAccessToken, 
  setRefreshToken, getRefreshToken, 
  refreshTokens, sendToBackend,
  refreshTable
};