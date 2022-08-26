<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAccessToken } from "../global";
const email = ref("");
const pass = ref("");

const aT = ref("buzz off");

aT.value = getAccessToken();

onMounted(() => console.log(getAccessToken()));
</script>

<template>
  <h1 class="text-light">Dealers</h1>
  <h2 class="text-light">{{ aT }}</h2>
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
