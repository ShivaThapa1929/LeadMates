<template>
  <div>
    <Modal
      :activeModal="store.state.kanban.editModal"
      @close="closeEditModal"
      title="Update Project"
      centered
    >
      <form @submit.prevent="updateTask" class="space-y-4">
        <Textinput
          label="title"
          type="text"
          placeholder="Task Name"
          name="title"
          v-model.trim="store.state.kanban.editName"
        />
        <div class="assagin space-y-4">
          <div class="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <FromGroup label="Start Date" name="d1">
              <flat-pickr
                v-model="store.state.kanban.editStartDate"
                class="form-control"
                id="d1"
                placeholder="yyyy, dd M"
                :config="{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }"
              />
            </FromGroup>
            <FromGroup label="End Date" name="d2">
              <flat-pickr
                v-model="store.state.kanban.editEndDate"
                class="form-control"
                id="d2"
                placeholder="yyyy, dd M"
                :config="{
                  altInput: true,
                  altFormat: 'F j, Y',
                  dateFormat: 'Y-m-d',
                }"
              />
            </FromGroup>
          </div>
          <VueSelect label="Assignee">
            <vSelect
              :options="assignOption"
              label="title"
              v-model="store.state.kanban.editassignto"
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

          <VueSelect label="Project category"
            ><vSelect
              :options="projectCatagory"
              v-model="store.state.kanban.editcta"
              multiple
          /></VueSelect>
          <Textarea
            label="Description"
            placeholder="Description"
            v-model="store.state.kanban.editdesc"
          />
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
import { computed } from "vue";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import { useStore } from "vuex";
import { assignOption, projectCatagory } from "../../../../constant/data";

let store = useStore();

const { handleSubmit } = useForm();

const toast = useToast();

const isFromValid = computed(() => {
  return (
    store.state.kanban.editName.length > 0 &&
    store.state.kanban.editassignto &&
    store.state.kanban.editcta &&
    store.state.kanban.editStartDate &&
    store.state.kanban.editEndDate &&
    store.state.kanban.editdesc
  );
});

const updateTask = handleSubmit(() => {
  if (isFromValid.value) {
    store.dispatch("updateTask", {
      id: store.state.kanban.editId,
      name: store.state.kanban.editName,
      des: store.state.kanban.editdesc,
      assignto: store.state.kanban.editassignto,
      catagory: store.state.kanban.editcta,
      startDate: store.state.kanban.editStartDate,
      endDate: store.state.kanban.editEndDate,
      progress: 60,
    });
    store.state.kanban.editModal = false;
    toast.success -
      500("Task updated", {
        timeout: 2000,
      });
  }
});

const closeEditModal = () => {
  store.state.kanban.editModal = false;
};
</script>
<style lang=""></style>
