<template>
  <div>
    <div class="bg-white dark:bg-slate-800">
      <div class="rounded p-5 space-y-5">
        <label class="flex border dark:border-slate-700 rounded p-5">
          <Radio name="x" value="A" v-model="picked1" checked />

          <div
            class="flex flex-start -mt-1 space-x-3 md:space-x-5 rtl:space-x-reverse"
          >
            <div
              class="w-max md:min-w-[110px] md:text-base text-xs text-slate-500 dark:text-slate-400 space-y-1.5"
            >
              <p>Address:</p>
              <p>Postal Code:</p>
              <p>City:</p>
              <p>State:</p>
              <p>Country:</p>
              <p>Phone No:</p>
            </div>
            <div
              class="md:text-base text-xs text-slate-900 dark:text-slate-300 space-y-1.5"
            >
              <p>395/B Dashcode Tower, Road 29, Mohakhali DOHS</p>
              <p>1206</p>
              <p>Mohakhali</p>
              <p>Dhaka</p>
              <p>Bangladesh:</p>
              <p>9876543201</p>
            </div>
          </div>
        </label>

        <label class="flex border dark:border-slate-700 rounded p-5">
          <Radio name="x" value="B" v-model="picked1" />
          <div
            class="flex flex-start -mt-1 space-x-3 md:space-x-5 rtl:space-x-reverse"
          >
            <div
              class="w-max md:min-w-[110px] md:text-base text-xs text-slate-500 dark:text-slate-400 space-y-1.5"
            >
              <p>Address:</p>
              <p>Postal Code:</p>
              <p>City:</p>
              <p>State:</p>
              <p>Country:</p>
              <p>Phone No:</p>
            </div>
            <div
              class="md:text-base text-xs text-slate-900 dark:text-slate-300 space-y-1.5"
            >
              <p>395/B Dashcode Tower, Road 29, Mohakhali DOHS</p>
              <p>1206</p>
              <p>Mohakhali</p>
              <p>Dhaka</p>
              <p>Bangladesh:</p>
              <p>9876543201</p>
            </div>
          </div>
        </label>

        <button
          @click="toggleModal"
          class="w-full flex flex-col justify-center items-center font-normal text-slate-800 dark:text-slate-300 p-5 space-y-3 border dark:border-slate-700 rounded bg-slate-100 dark:bg-slate-800"
        >
          <Icon icon="ic:round-plus" class="h-6 w-6" />
          <span>Add New Address</span>
        </button>
      </div>
    </div>
    <NoteModal :activeModal="openModal" @close="toggleModal" />
  </div>
</template>

<script setup>
import Icon from "@/components/Icon";
import Radio from "@/components/Radio";
import { ref } from "vue";
import NoteModal from "./note-modal.vue";

const openModal = ref(false);

const toggleModal = () => {
  openModal.value = !openModal.value;
};

const picked1 = ref("A");
</script>

<style></style>
