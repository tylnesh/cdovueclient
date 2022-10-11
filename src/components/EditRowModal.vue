<script setup lang="ts">
import { computed } from "vue";
import { getAccessToken } from "../global";

interface Props {
  open: boolean;
  submitUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputForm: Array<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected: Array<any>;
}
const props = defineProps<Props>();
const emit = defineEmits(["close"]);
//const inputedValues = reactive([]);

const computedValues = computed(() => {
  let formKeys: Array<string> = [];
  let values = [];
  for (let i = 0; i < props.inputForm.length; i++) {
    formKeys.push(props.inputForm[i]["field"]);
  }

  for (let i = 0; i < props.selected.length; i++) {
    for (let j = 0; j < formKeys.length; j++) {
      values.push(props.selected[i][formKeys[j]]);
    }
  }
  return values;
});

async function onSubmit(e: Event) {
  e.preventDefault();
  let formBody = {};

  if (props.selected.length > 1) {
    return;
  } else {
    Object.assign(formBody, { id: props.selected[0]["id"] });
    for (let i = 0; i < props.inputForm.length; i++) {
      const field: string = props.inputForm[i].field;
      Object.assign(formBody, { [field]: computedValues.value[i] });
    }
  }

  console.log(formBody);
  fetch(props.submitUrl, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + getAccessToken(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formBody),
  });
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
            class="m-5 black-background"
            v-for="(selected, selectedCounter) in props.selected"
            v-bind:key="selectedCounter"
          >
            <div class="m-3">
              <label for="selectedId" class="form-label">ID</label>
              <input
                type="text"
                id="selectedId"
                class="form-control"
                v-model="selected['id']"
                readonly
              />
            </div>

            <div
              class="m-3"
              v-for="(inputFormPart, inputCounter) in props.inputForm"
              v-bind:key="inputCounter"
            >
              <label for="name" class="form-label">{{ inputFormPart.label }}</label>
              <input
                type="text"
                class="form-control"
                id="inputFormPart.name"
                v-model="
                  computedValues[inputCounter + selectedCounter * props.inputForm.length]
                "
              />
            </div>
            <hr
              v-if="
                props.selected.length > 1 && selectedCounter < props.selected.length - 1
              "
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
