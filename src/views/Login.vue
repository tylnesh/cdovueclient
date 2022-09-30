<script setup lang="ts">
import { ref } from "vue";
import AppVue from "../App.vue";
import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
} from "../global";

import CreateRowModal from "../components/CreateRowModal.vue";

const email = ref("");
const pass = ref("");

async function submitLogin(e: Event) {
  e.preventDefault();

  let formBody: string[] = [];
  formBody.push(encodeURIComponent("username") + "=" + encodeURIComponent(email.value));
  formBody.push(encodeURIComponent("password") + "=" + encodeURIComponent(pass.value));
  let formBodyString = formBody.join("&");

  fetch("http://localhost:8080/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBodyString,
  })
    .then((response) => response.json())
    .then((data) => {
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
    })
    .then(() => console.log(getAccessToken()));
}

const isOpen = ref(false);
</script>

<template>
  <div class="center text-light mt-3">
    <h3>Login</h3>

    <button class="btn btn-primary ms-2 mb-2" @click="isOpen = true">New</button>

    <CreateRowModal :open="isOpen" @close="isOpen = !isOpen">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut sunt ducimus eveniet
        dolor dolorem nam ut voluptas, officiis ipsa itaque aperiam quos voluptatibus a.
        Quae temporibus quam incidunt ad illum.
      </p>
    </CreateRowModal>

    <form v-on:submit="submitLogin">
      <div class="mb-3 left-align">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="emailInput"
          v-model="email"
          aria-describedby="emailHelp"
        />
      </div>
      <div class="mb-3 left-align">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="passwordInput" v-model="pass" />
      </div>
      <div class="mb-3 form-check left-align">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <div class="left-align">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </div>
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
