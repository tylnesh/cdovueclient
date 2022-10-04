<script setup lang="ts">
import { propsToAttrMap } from "@vue/shared";
import { onMounted, ref, reactive } from "vue";

import { getAccessToken } from "../global";

interface Props {
  open: boolean;
  submitUrl: string;
  inputForm: Array<any>;
}
const props = defineProps<Props>();
const inputedValues = reactive([]);

//TODO: Implement submit form
async function submitForm(e: Event) {
  e.preventDefault();

  // let formBody: string[] = [];

  // for (let i = 0; i < props.inputForm.length; i++) {
  //   if (typeof props.inputForm[i] === "object") {
  //     formBody.push(
  //       encodeURIComponent(props.inputForm[i].field) +
  //         "=" +
  //         encodeURIComponent(inputedValues[i])
  //     );
  //   }
  // }
  // let formBodyString = formBody.join("&");

  let formBody = {};
  for (let i = 0; i < props.inputForm.length; i++) {
    const field: string = props.inputForm[i].field;
    Object.assign(formBody, { [field]: inputedValues[i] });
  }

  fetch(props.submitUrl, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formBody),
  });
}
</script>
<template>
  <div class="vue-modal" v-show="open">
    <div class="vue-modal-inner">
      <div id="create-row-content" class="vue-modal-content">
        <slot />
        <form v-on:submit="submitForm">
          <div
            class="m-3"
            v-for="(inputFormPart, counter) in this.inputForm"
            v-bind:key="counter"
          >
            <label for="name" class="form-label">{{ inputFormPart.label }}</label>
            <input
              type="text"
              class="form-control"
              id="inputFormPart.name"
              v-model="inputedValues[counter]"
            />
          </div>

          <div class="left-align">
            <button type="submit" class="btn btn-primary" @click="$emit('close')">
              Submit
            </button>
            <button class="btn btn-primary m-2" type="button" @click="$emit('close')">
              Close
            </button>
          </div>
        </form>
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
