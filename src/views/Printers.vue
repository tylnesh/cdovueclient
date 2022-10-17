<script setup lang="ts">
import { ref } from "vue";

const rows: Ref<Array<{ id: number; printer: string }>> = ref([]);
</script>

<template></template>

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
