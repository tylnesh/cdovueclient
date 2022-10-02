<script setup lang="ts">
import { ref, onMounted, Ref } from "vue";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../global";

import { router } from "../main";

import CreateRowModal from "../components/CreateRowModal.vue";
import { left } from "@popperjs/core/lib/enums";

const rows: Ref<Array<{ id: number; dealer: string; slug: string }>> = ref([]);
const columns = [
  {
    name: "dealer",
    required: true,
    align: left,
    label: "Dealer name",
    field: "dealer",
    sortable: true
  },
  { name: "slug", 
    align: left, 
    label: "Dealer slug", 
    field: "slug", 
    sortable: true 
  },
  {

    name: "createdAt",
    align: left,
    label: "Date of creation",
    field: "createdAt",
    sortable: true
  },
  {
    name: "updateAt",
    align: left,
    label: "Last updated",
    field: "updatedAt",
    sortable: true
  }
];

const selected = ref([]);

const isOpen = ref(false);

const submitUrl = ref("https://localhost:8080/api/dealer/post");

const inputForm = ref([{
    name: "dealer",
    label: "Dealer name",
    field: "dealer",
  },
  { name: "slug", 
    label: "Dealer slug", 
    field: "slug", 
  }])

onMounted(async () => {
  await refreshTable();
});

async function refreshTable() {
  const request = await fetch("http://localhost:8080/api/dealer", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
    },
  });
  if (request.status == 403) {
    refreshTokens();
    refreshTable();
  } else {
    let json = await request.json();
    rows.value = await json["content"];
  }
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
  <button class="btn btn-primary ms-2 mb-2" @click="refreshTable">Refresh Button</button>
  <button class="btn btn-primary ms-2 mb-2" @click="isOpen = true">New</button>
  <!-- <button class="btn btn-primary ms-2 mb-2" @click="editRow">Edit</button>
  <button class="btn btn-primary ms-2 mb-2" @click="deleteRow">Delete</button> -->

  <CreateRowModal :open="isOpen" @close="isOpen = !isOpen" :submitUrl="submitUrl" :inputForm = "inputForm">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut sunt ducimus eveniet
      dolor dolorem nam ut voluptas, officiis ipsa itaque aperiam quos voluptatibus a.
      Quae temporibus quam incidunt ad illum.
    </p>
  </CreateRowModal>

  <q-table
    title="Dealers"
    :rows="rows" 
    :columns="columns"
    row-key="dealer"
    selection="multiple"
    v-model:selected="selected"
  ></q-table>
  <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
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
