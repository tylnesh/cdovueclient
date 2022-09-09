<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../global";

import { router } from "../main";

import DataTable from "datatables.net-vue3";
import Select from "datatables.net-select";

DataTable.use(Select);

let counter = 0;
let dt: any;
const table = ref();

const data: string[] = [];
const columns = [
  {
    data: "a",
    title: "First",
  },
  {
    data: "b",
    title: "Second",
  },
  {
    data: "c",
    title: "Third",
  },
];

for (let i = 0; i < 5; i++) {
  add();
}

function add() {
  data.value.push({
    a: "A-" + counter,
    b: "B-" + counter,
    c: "C-" + counter,
  });

  counter += 1;
}

function remove() {
  dt.rows({ selected: true }).every(function () {
    let idx = data.value.indexOf(this.data());
    data.value.splice(idx, 1);
  });
}

const aT = ref("buzz off");

aT.value = getAccessToken();
//onMounted(() => console.log(getAccessToken()));

onMounted(() => {
  dt = table.value.dt();

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

  <button @click="add">Add new row</button><br />
  <button @click="update">Update selected rows</button><br />
  <button @click="remove">Delete selected rows</button>

  <DataTable
    class="display"
    :columns="columns"
    :data="data"
    :options="{ select: true }"
    ref="table"
  />

  <button @click="refreshTable()">Refresh Button</button>
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
