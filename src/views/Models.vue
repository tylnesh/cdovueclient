<script setup lang="ts">
import { ref, onMounted, Ref, watch, computed } from "vue";
import { refreshTable, sendToBackend, debounce } from "../middleware";
import { left } from "@popperjs/core/lib/enums";

import CreateRowModal from "../components/CreateRowModal.vue";
import EditRowModal from "../components/EditRowModal.vue";
import DeleteRowModal from "../components/DeleteRowModal.vue";

const rows: Ref<Array<{ id: number; manufacturer: string; model: string }>> = ref([]);
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
    name: "manufacturer",
    required: true,
    align: left,
    label: "Manufacturer",
    field: "manufacturer",
    sortable: true,
  },
  {
    name: "model",
    required: true,
    align: left,
    label: "Model",
    field: "model",
    sortable: true,
  },
  {
    name: "yearFrom",
    required: true,
    align: left,
    label: "From ",
    field: "yearFrom",
    sortable: true,
  },
  {
    name: "yearTo",
    required: true,
    align: left,
    label: "- To (Year)",
    field: "yearTo",
    sortable: true,
  },
  // {
  //   name: "createdAt",
  //   align: left,
  //   label: "Date of creation",
  //   field: "createdAt",
  //   sortable: true,
  // },
  // {
  //   name: "updatedAt",
  //   align: left,
  //   label: "Last updated",
  //   field: "updatedAt",
  //   sortable: true,
  // },
];

const inputForm = ref([
  {
    name: "manufacturer",
    label: "Manufacturer",
    field: "manufacturer",
  },
  {
    name: "model",
    label: "Model",
    field: "model",
  },
  {
    name: "yearFrom",
    label: "From:",
    field: "yearFrom",
  },
  {
    name: "yearTo",
    label: "To:",
    field: "yearTo",
  },
]);

const selected = ref([]);
const searchInput = ref("");

const createIsOpen = ref(false);
const editIsOpen = ref(false);
const deleteIsOpen = ref(false);

const retrieveUrl = ref("http://localhost:8080/api/model");
const createUrl = ref("http://localhost:8080/api/model/post");
const updateUrl = ref("http://localhost:8080/api/model/update");
const deleteUrl = ref("http://localhost:8080/api/model/delete");
const searchUrl = ref("http://localhost:8080/api/model/search");

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
  Object.assign(formBody, { manufacturer: searchInput.value });
  Object.assign(formBody, { model: searchInput.value });
  Object.assign(formBody, { yearFrom: parseInt(searchInput.value) });
  Object.assign(formBody, { yearTo: parseInt(searchInput.value) });

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
      <h3>New model</h3>
    </CreateRowModal>

    <EditRowModal
      :open="editIsOpen"
      @close="editIsOpen = !editIsOpen"
      :submitUrl="updateUrl"
      :inputForm="inputForm"
      :selected="selected"
    >
      <h3>Edit model(s)</h3>
    </EditRowModal>

    <DeleteRowModal
      :open="deleteIsOpen"
      @close="deleteIsOpen = !deleteIsOpen"
      :submitUrl="deleteUrl"
      :selected="selected"
    >
      <h3>Delete model(s)</h3>
    </DeleteRowModal>

    <div class="q-pa-md bg-light">
      <q-table
        title="Models"
        :rows="rows"
        :columns="columns"
        row-key="model"
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
