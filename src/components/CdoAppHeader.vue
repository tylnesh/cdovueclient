<script setup lang="ts"></script>

<template>
  <nav class="navbar bg-dark justify-content-center m-3">
    <div class="container">
      <router-link to="/" class="navbar-brand" href="#">
        <img class="logo" src="../assets/logo.svg" />
      </router-link>
      <router-link to="/login" class="nav-item">
        <button class="btn btn-secondary ms-2 mb-2">Login form</button>
      </router-link>
      <router-link to="/dealers" class="nav-item">
        <button class="btn btn-secondary ms-2 mb-2">Dealers</button>
      </router-link>
      <router-link to="/printers" class="nav-item">
        <button class="btn btn-secondary ms-2 mb-2">Printers</button>
      </router-link>
      <router-link to="/models" class="nav-item">
        <button class="btn btn-secondary ms-2 mb-2">Models</button>
      </router-link>
      <router-link to="/payments" class="nav-item">
        <button class="btn btn-secondary ms-2 mb-2">Payment types</button>
      </router-link>
      <router-link to="/statuses" class="nav-item">
        <button class="btn btn-secondary ms-2 mb-2">Statuses</button>
      </router-link>
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
