<script setup lang="ts">
import { ref, onMounted, Ref, watch, computed } from "vue";
import { refreshTable } from "../middleware";
import { left } from "@popperjs/core/lib/enums";

import CreateRowModal from "../components/CreateRowModal.vue";
import EditRowModal from "../components/EditRowModal.vue";
import DeleteRowModal from "../components/DeleteRowModal.vue";

const rows: Ref<Array<{ id: number; dealer: string; slug: string }>> = ref([]);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const pagesNumber = computed(() => {
  return rows.value.length / pagination.value.rowsPerPage;
});

const columns = [
  {
    name: "dealer",
    required: true,
    align: left,
    label: "Dealer name",
    field: "dealer",
    sortable: true,
  },
  {
    name: "slug",
    align: left,
    label: "Dealer slug",
    field: "slug",
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

const selected = ref([]);
const filter = ref("");

const createIsOpen = ref(false);
const editIsOpen = ref(false);
const deleteIsOpen = ref(false);

const retrieveUrl = ref("http://localhost:8080/api/dealer");
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

const nextPage = async () => {
  pagination.value.page++;
  const jsonData = await JSON.parse(
    await refreshTable(
      retrieveUrl.value +
        "?page=" +
        pagination.value.page +
        "&size=" +
        pagination.value.rowsPerPage
    )
  );
  rows.value = jsonData["rows"];
  pagination.value = jsonData["pagination"];
};
onMounted(async () => {
  const jsonData = await JSON.parse(
    await refreshTable(retrieveUrl.value + "?size=" + pagination.value.rowsPerPage)
  );
  rows.value = jsonData["rows"];
  pagination.value = jsonData["pagination"];
});

const refresh = async () => {
  const jsonData = await JSON.parse(
    await refreshTable(
      retrieveUrl.value +
        "?page=" +
        pagination.value.page +
        "&size=" +
        pagination.value.rowsPerPage
    )
  );
  rows.value = jsonData["rows"];
  pagination.value = jsonData["pagination"];
  console.log(jsonData["pagination"]);
};

watch(createIsOpen, async () => {
  if (!createIsOpen.value) {
    refresh();
  }
});
watch(editIsOpen, async () => {
  if (!editIsOpen.value) {
    refresh();
    selected.value = [];
  }
});
watch(deleteIsOpen, async () => {
  if (!deleteIsOpen.value) {
    refresh();
    selected.value = [];
  }
});
</script>

<template>
  <div class="main-div">
    <div class="container">
      <div class="row">
        <div class="col-8">
          <button class="btn btn-secondary ms-2 mb-2" @click="refresh">Refresh</button>
          <button class="btn btn-secondary ms-2 mb-2" @click="nextPage">Next page</button>
          <button class="btn btn-primary ms-2 mb-2" @click="createIsOpen = true">
            New
          </button>
          <button class="btn btn-primary ms-2 mb-2" @click="editIsOpen = true">
            Edit
          </button>
          <button class="btn btn-primary ms-2 mb-2" @click="deleteIsOpen = true">
            Delete
          </button>
        </div>
        <div class="col-4">
          <input type="text" id="inputFormPart.name" v-model="filter" />
        </div>
      </div>
    </div>

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
      :filter="filter"
      v-model:pagination="pagination"
    >
      <template v-slot:pagination="scope">
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.firstPage"
        />

        <q-btn
          icon="chevron_left"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />

        <q-btn
          icon="chevron_right"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          color="grey-8"
          round
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.lastPage"
        />
      </template>
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
