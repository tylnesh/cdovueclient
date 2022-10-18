<script setup lang="ts">
import { ref, onMounted, Ref, watch } from "vue";
import { refreshTable } from "../middleware";

import CreateRowModal from "../components/CreateRowModal.vue";
import { left } from "@popperjs/core/lib/enums";
import EditRowModal from "../components/EditRowModal.vue";
import DeleteRowModal from "../components/DeleteRowModal.vue";

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

const retrieveUrl = ref("http://localhost:8080/api/dealer/");
const createUrl = ref("http://localhost:8080/api/dealer/post");
const updateUrl = ref("http://localhost:8080/api/dealer/update");
const deleteUrl = ref("http://localhost:8080/api/dealer/delete");

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
  rows.value = await refreshTable(retrieveUrl.value);
});

const refresh = async () => {
  rows.value = await refreshTable(retrieveUrl.value);
};

watch(createIsOpen, async () => {
  if (!createIsOpen.value) {
    rows.value = await refreshTable(retrieveUrl.value);
  }
});
watch(editIsOpen, async () => {
  if (!editIsOpen.value) {
    rows.value = await refreshTable(retrieveUrl.value);
    selected.value = [];
  }
});
watch(deleteIsOpen, async () => {
  if (!deleteIsOpen.value) {
    rows.value = await refreshTable(retrieveUrl.value);
    selected.value = [];
  }
});
</script>

<template>
  <div class="main-div">
    <button class="btn btn-secondary ms-2 mb-2" @click="refresh">Refresh</button>
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
      :submitUrl="updateUrl"
      :inputForm="inputForm"
      :selected="selected"
    >
      <h3>Edit dealer(s)</h3>
    </EditRowModal>

    <DeleteRowModal
      :open="deleteIsOpen"
      @close="deleteIsOpen = !deleteIsOpen"
      :submitUrl="deleteUrl"
      :selected="selected"
    >
      <h3>Delete dealer(s)</h3>
    </DeleteRowModal>

    <q-table
      title="Dealers"
      :rows="rows"
      :columns="columns"
      row-key="dealer"
      selection="multiple"
      v-model:selected="selected"
    >
    </q-table>
  </div>
</template>

<style scoped lang="scss">
.main-div {
  overflow-x: hidden;
  overflow-y: auto;
}
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
