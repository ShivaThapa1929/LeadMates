<template>
  <div>
    <Modal
      :activeModal="store.state.kanban.columModal"
      @close="closeModal"
      title="Create new Column"
      centered
    >
      <form @submit.prevent="addColumn" class="space-y-4">
        <Textinput
          label="title"
          type="text"
          placeholder="Column Name"
          name="title"
          v-model.trim="newTodoText"
          :error="newtodoError"
        />
        <div class="formGroup">
          <label class="form-label">Select Color</label>
          <input type="color" v-model="columColor" />
        </div>

        <div class="text-right">
          <Button text="Add" btnClass="btn-dark"></Button>
        </div>
      </form>
    </Modal>
  </div>
</template>
<script setup>
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Textinput from "@/components/Textinput";
import { useField, useForm } from "vee-validate";
import { useStore } from "vuex";
import * as yup from "yup";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
let store = useStore();

const schema = yup.object({
  newTodoText: yup.string().required("Title is required"),
});
const { handleSubmit } = useForm({
  validationSchema: schema,
});
const columColor = ref("#4669FA");
const { value: newTodoText, errorMessage: newtodoError } =
  useField("newTodoText");

const addColumn = handleSubmit(() => {
  store.dispatch("addColumn", {
    id: uuidv4(),
    name: newTodoText.value,
    tasks: [],
    color: columColor.value,
  });
  // empty text input
  newTodoText.value = "";
});

const closeModal = () => {
  store.state.kanban.columModal = false;
};
</script>
<style lang=""></style>
