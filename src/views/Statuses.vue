<script setup lang="ts">
import { ref, onMounted, Ref, watch, computed } from "vue";
import { refreshTable, sendToBackend, debounce } from "../middleware";
import { left } from "@popperjs/core/lib/enums";

import CreateRowModal from "../components/CreateRowModal.vue";
import EditRowModal from "../components/EditRowModal.vue";
import DeleteRowModal from "../components/DeleteRowModal.vue";

const rows: Ref<Array<{ id: number }>> = ref([]);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 0,
  rowsPerPage: 10,
  rowsNumber: 10,
  pagesNumber: 0,
});

const columns = [
  {
    name: "status",
    required: true,
    align: left,
    label: "Status",
    field: "status",
    sortable: true,
  },
  {
    name: "color",
    required: true,
    align: left,
    label: "Color",
    field: "color",
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
    name: "status",
    label: "Status",
    field: "status",
  },
  {
    name: "color",
    label: "Color",
    field: "color",
    type: "color",
  },
]);

const selected = ref([]);
const searchInput = ref("");

const createIsOpen = ref(false);
const editIsOpen = ref(false);
const deleteIsOpen = ref(false);

const retrieveUrl = ref("http://localhost:8080/api/status");
const createUrl = ref("http://localhost:8080/api/status/post");
const updateUrl = ref("http://localhost:8080/api/status/update");
const deleteUrl = ref("http://localhost:8080/api/status/delete");
const searchUrl = ref("http://localhost:8080/api/status/search");

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
};

const sendSearchRequest = debounce(async () => {
  console.log("test of debounce");
  let formBody = {};
  Object.assign(formBody, { status: searchInput.value });
  Object.assign(formBody, { color: searchInput.value });

  const response = await sendToBackend(searchUrl.value, "POST", JSON.stringify(formBody));
  let responseText = await JSON.stringify(response);
  rows.value = JSON.parse(responseText)["searchResult"];
}, 500);

const goFirstPage = async () => {
  pagination.value.page = 0;
  refresh();
};
const goNextPage = async () => {
  pagination.value.page++;
  refresh();
};

const goPrevPage = async () => {
  pagination.value.page--;
  refresh();
};

const goLastPage = async () => {
  pagination.value.page = pagination.value.pagesNumber - 1;
  refresh();
};

const isFirstPage = computed(() => {
  return pagination.value.page == 0;
});
const isLastPage = computed(() => {
  return pagination.value.page == pagination.value.pagesNumber - 1;
});

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
  <div class="q-pa-sm">
    <div class="container">
      <div class="row">
        <div class="col-8">
          <button class="btn btn-secondary ms-2 mb-2" @click="refresh">Refresh</button>
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
          <input
            type="text"
            class="form-control"
            id="searchInput"
            placeholder="Search"
            v-model="searchInput"
            @keyup="sendSearchRequest"
            @submit="sendSearchRequest"
          />
        </div>
      </div>
    </div>

    <CreateRowModal
      :open="createIsOpen"
      @close="createIsOpen = !createIsOpen"
      :submitUrl="createUrl"
      :inputForm="inputForm"
    >
      <h3>New status</h3>
    </CreateRowModal>

    <EditRowModal
      :open="editIsOpen"
      @close="editIsOpen = !editIsOpen"
      :submitUrl="updateUrl"
      :inputForm="inputForm"
      :selected="selected"
    >
      <h3>Edit status</h3>
    </EditRowModal>

    <DeleteRowModal
      :open="deleteIsOpen"
      @close="deleteIsOpen = !deleteIsOpen"
      :submitUrl="deleteUrl"
      :selected="selected"
    >
      <h3>Delete status</h3>
    </DeleteRowModal>

    <div class="q-pa-md bg-light">
      <q-table
        title="Statuses"
        :rows="rows"
        :columns="columns"
        row-key="status"
        selection="multiple"
        v-model:selected="selected"
        v-model:pagination="pagination"
        hide-pagination
      />
      <div class="justify-center q-pa-md bg-light">
        <div class="d-flex flex-row">
          <label for="name" class="form-label m-2 fs-6">Rows per page: </label>
          <select
            class="form-select"
            v-model="pagination.rowsPerPage"
            aria-label="Default select example"
            @change="refresh"
          >
            <option value="5">5</option>
            <option selected value="10">10</option>
            <option value="20">20</option>
          </select>
          <q-btn
            v-if="pagination.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            :disable="isFirstPage"
            @click="goFirstPage"
          />

          <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            :disable="isFirstPage"
            @click="goPrevPage"
          />

          <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            :disable="isLastPage"
            @click="goNextPage"
          />

          <q-btn
            v-if="pagination.pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            :disable="isLastPage"
            @click="goLastPage"
          />
        </div>
      </div>
    </div>
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
