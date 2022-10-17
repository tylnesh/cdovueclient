<script setup lang="ts">
import CdoAppHeader from "./components/CdoAppHeader.vue";
</script>

<template>
  <CdoAppHeader></CdoAppHeader>
  <router-view></router-view>
</template>

<style scoped lang="scss">
#app {
  overflow-x: hidden;
  overflow-y: auto;
}
body {
  background-color: aqua;
  color: black;
  display: block;
  margin: 0 auto;
  text-align: center;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
</style>
