<template>
  <Modal
    :activeModal="activeModal"
    @close="activeModal"
    title="Pickup Address"
    label="Pickup"
    labelClass="btn-outline-dark"
    ref="modal1"
  >
    <form @submit.prevent="submit" class="space-y-5">
      <InputGroup
        type="text"
        name="ps-1"
        placeholder="Enter Pickup Address"
        horizontal
      />
      <div class="space-y-3">
        <div class="card border dark:border-slate-700 rounded-lg p-5">
          <label class="flex gap-1 items-center cursor-pointer">
            <Radio name="x" value="A" v-model="picked1" />
            <div class="space-y-1">
              <p class="font-medium text-base rtl:text-right">Mohakhali DOHS</p>
              <p class="font-normal text-sm text-slate-500 flex items-center">
                <Icon icon="mi:location" class="mr-1 rtl:ml-1" /> House 395,
                Road 29, New Area
              </p>
              <p class="font-normal text-sm text-slate-500 flex items-center">
                <Icon icon="solar:phone-outline" class="mr-1 rtl:ml-1" />
                +880123456789
              </p>
            </div>
          </label>
        </div>
        <div class="card border dark:border-slate-700 rounded-lg p-5">
          <label class="flex gap-1 items-center cursor-pointer">
            <Radio name="x" value="B" v-model="picked1" />
            <div class="space-y-1">
              <p class="font-medium text-base rtl:text-right">Mohakhali DOHS</p>
              <p class="font-normal text-sm text-slate-500 flex items-center">
                <Icon icon="mi:location" class="mr-1 rtl:ml-1" /> House 395,
                Road 29, New Area
              </p>
              <p class="font-normal text-sm text-slate-500 flex items-center">
                <Icon icon="solar:phone-outline" class="mr-1 rtl:ml-1" />
                +880123456789
              </p>
            </div>
          </label>
        </div>
        <div class="card border dark:border-slate-700 rounded-lg p-5">
          <label class="flex gap-1 items-center cursor-pointer">
            <Radio name="x" value="C" v-model="picked1" />
            <div class="space-y-1">
              <p class="font-medium text-base rtl:text-right">Mohakhali DOHS</p>
              <p class="font-normal text-sm text-slate-500 flex items-center">
                <Icon icon="mi:location" class="mr-1 rtl:ml-1" /> House 395,
                Road 29, New Area
              </p>
              <p class="font-normal text-sm text-slate-500 flex items-center">
                <Icon icon="solar:phone-outline" class="mr-1 rtl:ml-1" />
                +880123456789
              </p>
            </div>
          </label>
        </div>
      </div>
      <div class="col-span-12 flex justify-end">
        <button
          type="submit"
          class="btn btn-dark h-min w-max text-sm font-normal"
        >
          Done
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import Icon from "@/components/Icon";
import InputGroup from "@/components/InputGroup";
import Radio from "@/components/Radio";
import Modal from "@/components/Modal";

import { defineProps, ref } from "vue";
const props = defineProps({
  activeModal: Boolean,
});

const picked1 = ref("A");
</script>

<style lang="scss" scoped></style>
