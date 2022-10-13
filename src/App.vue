<script setup lang="ts">
import CdoAppHeader from "./components/CdoAppHeader.vue";
</script>

<template>
  <CdoAppHeader></CdoAppHeader>
  <router-view></router-view>
</template>

<style scoped lang="scss">
body {
  background-color: aqua;
  color: black;
}
</style>
