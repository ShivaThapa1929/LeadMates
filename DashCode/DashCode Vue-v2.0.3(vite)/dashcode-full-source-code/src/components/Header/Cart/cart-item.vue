<template>
  <div class="flex space-x-4 rtl:space-x-reverse pt-4">
    <div class="flex-none">
      <div class="md:w-20 md:h-20 w-14 h-14 bg-slate-200 rounded">
        <img :src="props.item.img" class="w-full h-full object-cover p-3" />
      </div>
    </div>
    <div class="flex-1 space-y-1 truncate">
      <div
        class="md:text-base text-sm truncate font-normal text-slate-900 dark:text-white"
      >
        Classical Black T-Shirt Classical Black T-Shirt
      </div>
      <div class="text-sm text-slate-500 dark:text-slate-400 pb-2">
        Price:
        <span class="text-xs"
          >${{ props.item.price * props.item.quantity }}</span
        >
      </div>

      <div class="flex items-center space-x-4 rtl:space-x-reverse">
        <CounterButton :product="item" />

        <button
          @click="cart.removeFromCart(item)"
          class="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400 bg-slate-100 hover:bg-danger-500 hover:text-white dark:hover:bg-danger-500 dark:hover:text-white"
        >
          <Icon icon="heroicons:trash" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CounterButton from "@/components/Ecommerce/counter-button.vue";
import Icon from "@/components/Icon";
import { cartStore } from "@/store/cart";

const cart = cartStore();
const props = defineProps({
  item: Object,
});
</script>

<style></style>
