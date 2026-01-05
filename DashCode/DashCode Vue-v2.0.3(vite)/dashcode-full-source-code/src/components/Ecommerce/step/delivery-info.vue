<template>
  <div>
    <div class="card dark:border-slate-700 rounded-sm p-5">
      <div v-if="cart.items.length > 0">
        <h3
          class="text-slate-800 dark:text-slate-200 font-semibold text-base uppercase pb-3"
        >
          Your Orders
        </h3>
        <div v-for="(item, index) in cart.getItems" :key="index">
          <div class="card border dark:border-slate-700 rounded-sm p-5 mb-3">
            <div class="flex sm:flex-col md:flex-row gap-3 items-center">
              <div
                class="md:p-4 p-2 flex-none bg-slate-200 rounded md:h-20 md:w-20 w-16 h-16 rtl:ml-3"
              >
                <img class="w-full h-full object-contain" :src="item.img" />
              </div>
              <div class="md:text-base text-sm">
                <p
                  class="text-slate-900 dark:text-slate-300 font-medium md:pb-2 pb-1 line-clamp-2"
                >
                  {{ item.name }}
                </p>
                <p class="text-slate-900 dark:text-slate-300 font-medium">
                  <span
                    class="text-slate-500 dark:text-slate-400 font-normal mr-1"
                  >
                    Brand:
                  </span>
                  {{ item.brand }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h3>No result's</h3>
      </div>

      <div
        class="md:mt-10 mt-5 lg:flex lg:space-x-4 lg:space-y-0 space-y-5 items-center"
      >
        <p
          href="#"
          class="text-base font-medium text-slate-800 dark:text-slate-300 flex flex-none"
        >
          Choose Delivery Type
        </p>
        <div
          class="space-x-0 sm:space-x-2 md:space-x-5 md:space-y-0 space-y-3 rtl:space-x-reverse md:flex justify-start lg:justify-end flex-1 md:text-base text-sm"
        >
          <label
            class="inline-flex items-center border border-slate-900 dark:border-slate-700 rounded py-3 lg:px-10 px-5 md:w-auto w-[200px]"
          >
            <Radio name="x" value="A" checked v-model="picked1" />
            <span class="text-slate-900 dark:text-slate-300">
              Home Delivery
            </span>
          </label>
          <label
            class="inline-flex items-center border border-slate-900 dark:border-slate-700 rounded py-3 lg:px-10 px-5 md:w-auto w-[200px]"
          >
            <Radio name="x" value="B" v-model="picked1" @click="toggleModal" />
            <span class="text-slate-900 dark:text-slate-300">
              Local Pickup
            </span>
          </label>
        </div>
      </div>
    </div>
    <PickupModal :activeModal="activeModal" @close="toggleModal" />
  </div>
</template>

<script setup>
import Radio from "@/components/Radio";
import { ref } from "vue";
import PickupModal from "./pickup-modal.vue";
import { cartStore } from "@/store/cart";

const cart = cartStore();
const activeModal = ref(false);

const toggleModal = () => {
  activeModal.value = !activeModal.value;
};

const picked1 = ref("A");
</script>

<style lang="scss" scoped></style>
