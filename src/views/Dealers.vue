<script setup lang="ts">
import { ref, onMounted, Ref, watch } from "vue";
import { getAccessToken, refreshTokens } from "../global";

import CreateRowModal from "../components/CreateRowModal.vue";
import { left } from "@popperjs/core/lib/enums";
import EditRowModal from "../components/EditRowModal.vue";

const rows: Ref<Array<{ id: number; dealer: string; slug: string }>> = ref([]);

const columns = [
  {
    name: "dealer",
    required: true,
    align: left,
    label: "Dealer name",
    field: "dealer",
    sortable: true,
  },
  { name: "slug", align: left, label: "Dealer slug", field: "slug", sortable: true },
  {
    name: "createdAt",
    align: left,
    label: "Date of creation",
    field: "createdAt",
    sortable: true,
  },
  {
    name: "updateAt",
    align: left,
    label: "Last updated",
    field: "updatedAt",
    sortable: true,
  },
];

const selected = ref([]);

const createIsOpen = ref(false);
const editIsOpen = ref(false);
const deleteIsOpen = ref(false);

const createUrl = ref("http://localhost:8080/api/dealer/post");
const editUrl = ref("http://localhost:8080/api/dealer/update");

const inputForm = ref([
  {
    name: "dealer",
    label: "Dealer name",
    field: "dealer",
  },
  {
    name: "slug",
    label: "Dealer slug",
    field: "slug",
  },
]);

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

watch(createIsOpen, async () => {
  await refreshTable();
});
</script>

<template>
  <button class="btn btn-secondary ms-2 mb-2" @click="refreshTable">Refresh</button>
  <button class="btn btn-primary ms-2 mb-2" @click="createIsOpen = true">New</button>
  <button class="btn btn-primary ms-2 mb-2" @click="editIsOpen = true">Edit</button>
  <button class="btn btn-primary ms-2 mb-2" @click="deleteIsOpen = true">Delete</button>
  <CreateRowModal
    :open="createIsOpen"
    @close="createIsOpen = !createIsOpen"
    :submitUrl="createUrl"
    :inputForm="inputForm"
  >
    <h3>New dealer</h3>
  </CreateRowModal>

  <EditRowModal
    :open="editIsOpen"
    @close="editIsOpen = !editIsOpen"
    :submitUrl="editUrl"
    :inputForm="inputForm"
    :selected="selected"
  >
    <h3>Edit dealer</h3>
  </EditRowModal>

  <DeleteRowModal> </DeleteRowModal>

  <q-table
    title="Dealers"
    :rows="rows"
    :columns="columns"
    row-key="dealer"
    selection="multiple"
    v-model:selected="selected"
  >
  </q-table>
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
