<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../global";

import { router } from "../main";
import DataTable from "../components/DataTable.vue";
const email = ref("");
const pass = ref("");

const aT = ref("buzz off");

//aT.value = getAccessToken();
//onMounted(() => console.log(getAccessToken()));

onMounted(() => {
  fetch("http://localhost:8080/api/dealer", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error_message === undefined) {
        aT.value = data.content[0].dealer;
      } else {
        refreshTokens();
        refreshTable();
      }
    });
});

function refreshTable() {
  fetch("http://localhost:8080/api/dealer", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error_message === undefined) {
        aT.value = data.content[0].dealer;
      } else {
        refreshTokens();
        refreshTable();
      }
    });
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
</script>

<template>
  <h1 class="text-light">Dealers</h1>
  <h2 class="text-light">{{ aT }}</h2>
  <button @click="refreshTable()">Refresh Button</button>
  <DataTable> </DataTable>
</template>

<style scoped>
.center {
  text-align: center;
}
form {
  display: inline-block;
  width: 30em;
}

.left-align {
  text-align: left;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
