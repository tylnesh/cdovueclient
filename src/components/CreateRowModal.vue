<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  
  
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  submitUrl: {
    type: String,
    required: true
  },
  inputForm: {
    type: Array,
    required:true
  }

});

function submitForm(e :Event) {
  // e.preventDefault();

  // let formBody: string[] = [];
  // formBody.push(encodeURIComponent("username") + "=" + encodeURIComponent(email.value));
  // formBody.push(encodeURIComponent("password") + "=" + encodeURIComponent(pass.value));
  // let formBodyString = formBody.join("&");

  // fetch("http://localhost:8080/api/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   body: formBodyString,
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     setAccessToken(data.access_token);
  //     setRefreshToken(data.refresh_token);
  //   })
  //   .then(() => console.log(getAccessToken()));
}


</script>
TODO: generate form from JSOM schema
<template>
  <div class="vue-modal" v-show="open">
    <div class="vue-modal-inner">
      <div id ="create-row-content" class="vue-modal-content">
        <slot />
        <form v-on:submit="submitForm">
      <!-- <div class="mb-3 left-align">
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
        <button class="btn btn-primary m-2" type="button" @click="submitForm">Submit</button> -->

        </form>

        <button class="btn btn-primary m-2" type="button" @click="$emit('close')">Close</button>

        <!-- <p>{{ this.submitUrl }}</p> -->
        <p> {{ this.inputForm[0] }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
*,
::before ::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.vue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.vue-modal-inner {
  max-width: 500px;
  margin: 2rem auto;
}

.vue-modal-content {
  position: relative;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  border-radius: 0.3rem;
  padding: 1rem;
}
</style>
