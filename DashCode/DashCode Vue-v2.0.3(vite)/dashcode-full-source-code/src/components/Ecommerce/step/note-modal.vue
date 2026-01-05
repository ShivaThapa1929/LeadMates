<template>
  <Modal
    :activeModal="activeModal"
    title="New Address"
    label="New"
    labelClass="btn-outline-dark"
    ref="modal1"
  >
    <form
      @submit.prevent="submit"
      class="space-y-4 flex flex-col justify-between"
    >
      <Textarea
        label="Address"
        name="pn4"
        placeholder="Your Address"
        horizontal
      />
      <div class="flex">
        <p
          class="flex-none flex-0 mr-6 md:w-[100px] break-words ltr:inline-block rtl:block input-label"
        >
          Country
        </p>
        <div class="flex-1 w-full">
          <Select
            :options="options"
            placeholder="Select Your Country"
            classLabel="!w-[150px]"
          />
        </div>
      </div>
      <div class="flex">
        <p
          class="flex-none flex-0 mr-6 md:w-[100px] break-words ltr:inline-block rtl:block input-label"
        >
          State
        </p>
        <div class="flex-1 w-full">
          <Select
            :options="options"
            placeholder="Select Your State"
            classLabel="!w-[150px]"
          />
        </div>
      </div>
      <div class="flex">
        <p
          class="flex-none flex-0 mr-6 md:w-[100px] break-words ltr:inline-block rtl:block input-label"
        >
          City
        </p>
        <div class="flex-1 w-full">
          <Select
            :options="options"
            placeholder="Select Your City"
            classLabel="!w-[150px]"
          />
        </div>
      </div>

      <InputGroup
        type="text"
        label="Postal Code"
        name="ps-1"
        placeholder="Your Postal Code"
        horizontal
      />
      <InputGroup
        type="text"
        label="Phone No"
        name="ps-1"
        placeholder="+880"
        horizontal
      />

      <div class="col-span-12 flex justify-end">
        <button
          type="submit"
          class="btn btn-dark h-min w-max text-sm font-normal"
        >
          Save Address
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
const options = ref([
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]);

import Modal from "@/components/Modal";
import Textarea from "@/components/Textarea";
import InputGroup from "@/components/InputGroup";
import Select from "@/components/Select";
import { defineProps, ref } from "vue";
const props = defineProps({
  activeModal: Boolean,
});
</script>

<style lang="scss" scoped></style>
