<template>
  <div class="flex space-x-4 rtl:space-x-reverse items-center">
    <div
      class="flex-1 h-8 flex border border-1 border-slate-900 delay-150 ease-in-out dark:border-slate-600 divide-x-[1px] rtl:divide-x-reverse text-sm font-normal divide-slate-900 dark:divide-slate-600 rounded"
    >
      <button
        @click="decrement"
        :disabled="cartProduct.quantity === 1"
        type="button"
        class="flex-none px-2 dark:text-white text-slate-900 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Icon icon="eva:minus-fill" />
      </button>

      <div
        class="flex-1 w-[62px] text-center text-slate-900 dark:text-slate-300 flex items-center justify-center"
      >
        {{ cartProduct.quantity }}
      </div>
      <button
        @click="increment"
        :disabled="cartProduct.quantity === 10"
        type="button"
        class="flex-none px-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 hover:bg-slate-900 hover:text-white dark:text-white dark:hover:bg-slate-700 rtl:dark:hover:rounded-l ltr:dark:hover:rounded-r"
      >
        <Icon icon="eva:plus-fill" />
      </button>
    </div>
  </div>
</template>

<script setup>
import Icon from "@/components/Icon";
import { ref } from "vue";
import { cartStore } from "@/store/cart";

const cart = cartStore();

const props = defineProps({
  product: Object,
});

const increment = () => cart.addToCart(cartProduct);
const decrement = () => {
  cartProduct.quantity === 1 ? "" : cartProduct.quantity--;
  cart.getTotalPrice();
};

const cartProduct = cart.getItems.find((item) => item.id == props.product.id);
</script>

<style scoped></style>
