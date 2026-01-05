<template>
  <span
    @click="toggleCartDrawer"
    class="relative lg:h-[32px] lg:w-[32px] lg:bg-slate-100 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
    ><Icon icon="heroicons:shopping-cart" />
    <span
      class="absolute lg:right-0 lg:top-0 -top-2 -right-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]"
      >{{ cart.items.length }}</span
    >
  </span>
  <CartDrawer />
</template>
<script setup>
import Icon from "@/components/Icon";
import CartDrawer from "@/components/Header/Cart";
import { useThemeSettingsStore } from "@/store/themeSettings";
import { cartStore } from "@/store/cart";
const themeSettingsStore = useThemeSettingsStore();

const toggleCartDrawer = () => {
  themeSettingsStore.toggleCartDrawer();
};

const cart = cartStore();
</script>
<style></style>
