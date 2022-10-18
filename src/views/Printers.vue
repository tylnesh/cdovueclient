<script setup lang="ts">
import { ref, onMounted, Ref, watch } from "vue";
import { refreshTable } from "../middleware";
import { left } from "@popperjs/core/lib/enums";

import CreateRowModal from "../components/CreateRowModal.vue";
import EditRowModal from "../components/EditRowModal.vue";
import DeleteRowModal from "../components/DeleteRowModal.vue";

const rows: Ref<Array<{ id: number; printer: string }>> = ref([]);

const columns = [
  {
    name: "printer",
    required: true,
    align: left,
    label: "Printer name",
    field: "printer",
    sortable: true,
  },
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

const inputForm = ref([
  {
    name: "printer",
    label: "Printer name",
    field: "printer",
  },
]);

const selected = ref([]);

const createIsOpen = ref(false);
const editIsOpen = ref(false);
const deleteIsOpen = ref(false);

const retrieveUrl = ref("http://localhost:8080/api/printer/");
const createUrl = ref("http://localhost:8080/api/printer/post");
const updateUrl = ref("http://localhost:8080/api/printer/update");
const deleteUrl = ref("http://localhost:8080/api/printer/delete");

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
      <h3>New printer</h3>
    </CreateRowModal>

    <EditRowModal
      :open="editIsOpen"
      @close="editIsOpen = !editIsOpen"
      :submitUrl="updateUrl"
      :inputForm="inputForm"
      :selected="selected"
    >
      <h3>Edit printer(s)</h3>
    </EditRowModal>

    <DeleteRowModal
      :open="deleteIsOpen"
      @close="deleteIsOpen = !deleteIsOpen"
      :submitUrl="deleteUrl"
      :selected="selected"
    >
      <h3>Delete printer(s)</h3>
    </DeleteRowModal>

    <q-table
      title="Printers"
      :rows="rows"
      :columns="columns"
      row-key="printer"
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
