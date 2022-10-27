<script setup lang="ts">
import { sendToBackend } from "../middleware";

interface Props {
  open: boolean;
  submitUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected: Array<any>;
}
const props = defineProps<Props>();
const emit = defineEmits(["close"]);

async function submit() {
  let formBody = {};
  Object.assign(formBody, { list: props.selected });

  await sendToBackend(props.submitUrl + "/multi", "DELETE", JSON.stringify(formBody));
  emit("close");
}

const closeModal = () => {
  emit("close");
};
</script>
<template>
  <div class="vue-modal" v-show="open">
    <div class="vue-modal-inner">
      <div id="create-row-content" class="vue-modal-content">
        <slot />
        <p>Are you sure you want to delete {{ props.selected.length }} item(s)</p>
        <button type="button" class="btn btn-primary" @click="submit">Submit</button>
        <button class="btn btn-primary m-2" type="button" @click="closeModal">
          Close
        </button>
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
