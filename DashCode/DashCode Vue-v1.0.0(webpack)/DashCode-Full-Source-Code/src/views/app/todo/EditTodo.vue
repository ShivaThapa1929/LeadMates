<template>
  <div>
    <Modal
      :activeModal="editModal"
      @close="closeEditModal"
      title="Edit Task"
      centered
    >
      <form @submit.prevent="editTodo" class="space-y-4">
        <Textinput
          label="title"
          type="text"
          placeholder="Task Name"
          name="title"
          v-model.trim="store.state.apptodo.editItem.title"
        />
        <div class="assagin space-y-4">
          <VueSelect label="Assignee">
            <vSelect
              :options="assignOption"
              label="title"
              v-model="store.state.apptodo.editItem.image"
              multiple
            >
              <template #option="{ title, image }">
                <span class="flex items-center space-x-4">
                  <div class="flex-none">
                    <div class="h-7 w-7 rounded-full">
                      <img
                        :src="image"
                        alt=""
                        class="w-full h-full rounded-full"
                      />
                    </div>
                  </div>
                  <span class="flex-1">{{ title }}</span>
                </span>
              </template>
              <template #selected-option="{ title, image }">
                <span class="flex items-center space-x-4">
                  <div class="flex-none">
                    <div class="h-7 w-7 rounded-full">
                      <img
                        :src="image"
                        alt=""
                        class="w-full h-full rounded-full"
                      />
                    </div>
                  </div>
                  <span class="flex-1">{{ title }}</span>
                </span>
              </template>
            </vSelect>
          </VueSelect>
          <FromGroup label="Due Date" name="d1">
            <flat-pickr
              v-model="dateDefault"
              class="form-control"
              id="d1"
              placeholder="yyyy, dd M"
            />
          </FromGroup>

          <VueSelect label="Tag"
            ><vSelect
              :options="editCatagory"
              v-model="store.state.apptodo.editItem.catagory"
              multiple
          /></VueSelect>
          <Textarea label="Description" placeholder="Description" />
        </div>

        <div class="text-right">
          <Button
            text="Update"
            btnClass="btn-dark"
            :isDisabled="!isFromValid"
          ></Button>
        </div>
      </form>
    </Modal>
  </div>
</template>
<script setup>
import Button from "@/components/Button";
import FromGroup from "@/components/FromGroup";
import Modal from "@/components/Modal";
import VueSelect from "@/components/Select/VueSelect";
import Textarea from "@/components/Textarea";
import Textinput from "@/components/Textinput";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import { assignOption, editCatagory } from "../../../constant/data";

let store = useStore();

// computed data
const editModal = computed(() => {
  return store.state.apptodo.editModal;
});
const { handleSubmit } = useForm();

const toast = useToast();
const dateDefault = ref("");

const isFromValid = computed(() => {
  return (
    store.state.apptodo.editItem.title.length > 0 &&
    store.state.apptodo.editItem.image &&
    store.state.apptodo.editItem.catagory
  );
});

const editTodo = handleSubmit(() => {
  if (isFromValid.value) {
    store.dispatch("editTodo", {
      id: store.state.apptodo.editItem.id,
      title: store.state.apptodo.editItem.title,
      isDone: false,

      image: store.state.apptodo.editItem.image,
      catagory: store.state.apptodo.editItem.catagory,
    });
    store.state.apptodo.editModal = false;
    toast.success -
      500("Task updated", {
        timeout: 2000,
      });
  }
});

const closeEditModal = () => {
  store.dispatch("closeEditModal");
};
</script>
<style lang=""></style>
