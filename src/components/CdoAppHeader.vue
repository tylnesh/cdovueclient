<script setup lang="ts"></script>

<template>
  <nav class="navbar bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand" href="#">
        <img class="logo" src="../assets/logo.svg" />
        <span class="header-text">CDO Management Client</span>
      </router-link>
      <router-link to="/login" class="nav-item"> Login form </router-link>
      <router-link to="/dealers" class="nav-item"> Dealers </router-link>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.logo {
  height: 5em;
  padding: 0.5em;
  will-change: filter;
}

.header-text {
  padding: 1.5em;
  color: white;
  font-size: xx-large;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
