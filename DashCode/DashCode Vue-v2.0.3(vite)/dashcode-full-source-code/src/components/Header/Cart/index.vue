<template>
  <Transition>
    <div
      class="setting-wrapper fixed ltr:right-0 rtl:left-0 top-0 md:w-[400px] w-[300px] bg-white dark:bg-slate-800 h-screen z-[9999] shadow-base2 dark:shadow-base3 border border-slate-200 dark:border-slate-700"
      v-if="themeSettingsStore.cartOpener"
    >
      <div class="px-6 h-full overflow-y-auto flex flex-col">
        <header
          class="sticky flex-none top-0 bg-white dark:bg-slate-800 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 -mx-5 px-6 py-[15px] mb-2 z-50"
        >
          <div>
            <span
              class="block text-xl text-slate-900 font-medium dark:text-[#eee]"
            >
              Cart
            </span>
            <span
              class="block text-sm font-light text-[#68768A] dark:text-[#eee]"
            >
              Total Price ${{ cart.totalPrice }}
            </span>
          </div>
          <div
            class="cursor-pointer text-2xl text-slate-800 dark:text-slate-200"
            @click="toggleCartDrawer"
          >
            <Icon icon="heroicons-outline:x" />
          </div>
        </header>
        <div
          class="divide-y divide-slate-200 dark:divide-slate-700 flex-1 flex flex-col"
        >
          <div
            class="divide-y divide-slate-200 dark:divide-slate-700 flex-1 flex flex-col space-y-6 pb-4"
            v-if="cart.getItems.length >= 1"
          >
            <template v-for="(item, index) in cart.getItems" :key="index">
              <CartItem :item="item" />
            </template>
          </div>
          <div
            v-else
            class="divide-y divide-slate-200 dark:divide-slate-700 flex-1 flex flex-col justify-center"
          >
            <NoItem />
          </div>
        </div>
        <footer
          class="bg-white dark:bg-slate-800 py-6 sticky flex-none bottom-0 -mx-6 px-6 space-y-4 border-t border-slate-200 dark:border-slate-700"
        >
          <div
            class="flex justify-between text-base font-medium leading-none text-slate-900 dark:text-white"
          >
            <span>Subtotal:</span>
            <span>${{ cart.totalPrice }}</span>
          </div>
          <div
            class="flex justify-between space-x-3 rtl:space-x-reverse"
            v-if="cart.getItems.length >= 1"
          >
            <router-link to="/app/products"
              ><Button
                text="Continue to Shipping"
                btnClass="btn-dark text-base"
            /></router-link>

            <router-link to="/app/cart">
              <Button text="View Cart" btnClass="btn-dark text-base" />
            </router-link>
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>
<script setup>
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useThemeSettingsStore } from "@/store/themeSettings";
import CartItem from "./cart-item.vue";
import { cartStore } from "@/store/cart";
import NoItem from "./no-Item.vue";

const themeSettingsStore = useThemeSettingsStore();
const toggleCartDrawer = () => {
  themeSettingsStore.toggleCartDrawer();
};

const cart = cartStore();
</script>
<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
