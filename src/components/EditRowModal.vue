<script setup lang="ts">
import { computed } from "vue";
import { sendToBackend } from "../middleware";

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

const submitForm = async () => {
  let formBody = {};
  let url = "";

  if (props.selected.length > 1) {
    url = props.submitUrl + "/multi";
    let formArray = [];
    for (let i = 0; i < props.selected.length; i++) {
      let tempFormBody = {};
      Object.assign(tempFormBody, { id: props.selected[i]["id"] });
      for (let j = 0; j < props.inputForm.length; j++) {
        const field: string = props.inputForm[j].field;
        Object.assign(tempFormBody, {
          [field]: computedValues.value[j + i * props.inputForm.length],
        });
      }
      formArray.push(tempFormBody);
      Object.assign(formBody, { dealerList: formArray });
    }
  } else {
    url = props.submitUrl;
    Object.assign(formBody, { id: props.selected[0]["id"] });
    for (let i = 0; i < props.inputForm.length; i++) {
      const field: string = props.inputForm[i].field;
      Object.assign(formBody, { [field]: computedValues.value[i] });
    }
  }

  sendToBackend(url, "PUT", JSON.stringify(formBody));
  closeModal();
};

const closeModal = () => {
  emit("close");
};
</script>
<template>
  <div class="vue-modal" v-show="open">
    <div class="vue-modal-inner">
      <div id="create-row-content" class="vue-modal-content">
        <slot />

        <form>
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
            <button type="button" class="btn btn-primary" @click="submitForm">
              Submit
            </button>
            <button class="btn btn-primary m-2" type="button" @click="closeModal">
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
  overflow-x: hidden;
  overflow-y: scroll;
}

.vue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.vue-modal-inner {
  max-width: 500px;
  height: 80vh;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 2rem auto;
}

.vue-modal-content {
  position: relative;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  border-radius: 0.3rem;
  padding: 1rem;
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
}
</style>
