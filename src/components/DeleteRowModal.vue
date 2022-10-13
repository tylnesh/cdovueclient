<script setup lang="ts">
import { reactive } from "vue";
import { getAccessToken } from "../global";

interface Props {
  open: boolean;
  submitUrl: string;
  
}
const props = defineProps<Props>();
const emit = defineEmits(["close"]);
const inputedValues = reactive([]);

async function onSubmit(e: Event) {
  e.preventDefault();
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

  inputedValues.splice(0);

  emit("close");
}

const onClose = () => {
  emit("close");
};
</script>
<template>
  <div class="vue-modal" v-show="open">
    <div class="vue-modal-inner">
      <div id="create-row-content" class="vue-modal-content">
        <slot />
        <form v-on:submit="onSubmit">
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
            <button type="submit" class="btn btn-primary">Submit</button>
            <button class="btn btn-primary m-2" type="button" @click="onClose">
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
