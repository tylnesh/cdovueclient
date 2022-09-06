<script setup lang="ts">
import { ref, computed, onMounted } from "vue";



const props = defineProps({
  columns: {type: Array<{dataKey:string, name:string, align:string, formatValue(value:any)
  }>, default: [{}]},
  rows: {type: Array, default: [{}]},
  perPage: {type: Number, default: 1},
});

const formatRow = ref(props.rows);
const currentIndex = ref(0);
const sort = ref('Asc');
const currentPage = ref(0);



const numberPages = computed(() => props.rows.length / props.perPage);
const rowFilters = computed(() => formatRow.value.slice(currentIndex.value, currentIndex.value + props.perPage));

function sortBy(property:string) {
  if(sort.value === "Asc") {
    formatRow.value.sort((a:any,b:any) => (a[property] < b[property] ? -1 : 1));
    sort.value = "Desc";
  } else {
    formatRow.value.sort((a:any,b:any) => (a[property] > b[property] ? -1 : 1));
    sort.value = "Asc"
  }
}

function onPageChange(page:number) {
  currentPage.value = page;
  currentIndex.value = page * props.perPage - props.perPage
}

onMounted(() => {

  for (let i = 0; i < formatRow.value.length; i++){
    for (let j = 0; j < props.columns.length; j++){
      try {
        formatRow.value[i][props.columns[j]["dataKey"]] = props.columns[j].formatValue(formatRow.value[i][props.columns[j]["dataKey"]])
      } catch (ex) {
        console.log("'formatValue' method is not present in data key:", props.columns[j]["dataKey"]);
        continue;
      }
    }
  }
  onPageChange(1);

})
</script>

<template>
  <div class="ma-5">
    <div class="container gray">
      <div class="card pa-3">
        <table class="table">
          <thead>
            <tr>
              <th class="text-left" v-for="column in columns" :key="column.dataKey">
                <button @click="sortBy(column.dataKey)"></button>
                <span>
                  <h2>{{ column.name }}</h2>
                </span>
                <i class="bi bi-funnel-fill"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rowFilters"></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
