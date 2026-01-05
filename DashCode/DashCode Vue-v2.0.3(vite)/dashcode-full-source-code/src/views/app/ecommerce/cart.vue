<template>
  <div>
    <Card>
      <div class="grid grid-cols-5 gap-5">
        <StepBox
          v-for="(steps, i) in stepsArray"
          :key="i"
          :steps="steps"
          :stepNumber="stepNumber"
        />
      </div>
      <div class="mt-8">
        <CartStep v-if="stepNumber == 1" />
        <ShippingInfo v-else-if="stepNumber == 2" />

        <InvoiceCart v-else-if="stepNumber == 5" />
        <DeliveryInfo v-else-if="stepNumber == 3" />
        <Payment v-else-if="stepNumber == 4" />

        <div
          class="flex flex-col md:flex-row md:justify-between md:px-6 py-5 md:py-10 md:mt-8 space-x-0 md:space-x-6 rtl:space-x-reverse"
        >
          <div class="flex justify-center">
            <template v-if="stepNumber > 4"></template>
            <router-link v-else to="products">
              <button
                class="flex justify-center text-sm border w-full border-slate-400 dark:border-0 font-medium text-slate-900 md:w-max dark:text-white col-span-12 md:col-span-6 py-3 px-3 rounded-md hover:bg-slate-800 hover:text-white dark:bg-slate-900 dark:hover:bg-slate-900/50 delay-200 ease-in-out mb-4 md:mb-0"
              >
                <span> Add More Product </span>
              </button>
            </router-link>
          </div>
          <div class="flex">
            <div
              class="flex flex-col items-center md:flex-row md:justify-end md:space-x-5 rtl:space-x-reverse space-y-3 md:space-y-0 mx-auto w-full md:w-max"
            >
              <template v-if="stepNumber < 5">
                <template v-if="stepNumber <= 4">
                  <button
                    v-if="stepNumber > 1 && stepNumber <= 4"
                    @click="stepNumber-- > 1"
                    :disabled="stepNumber === 1"
                    type="button"
                    class="btn btn-dark text-sm font-normal w-full ease-in-out md:w-max disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span> Go Back </span>
                  </button>
                  <button
                    v-if="stepNumber <= 3"
                    @click="stepNumber++ < 5 && stepsArray.step++"
                    :disabled="cart.items.length == 0 || stepNumber === 5"
                    type="button"
                    class="btn btn-dark text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50 w-full md:w-max"
                  >
                    <span>Continue to Shipping </span>
                  </button>

                  <button
                    v-else-if="(stepNumber = 4)"
                    @click="stepNumber++ < 5 && stepsArray.step++"
                    :disabled="cart.items.length == 0 || stepNumber === 5"
                    type="button"
                    class="btn btn-dark text-sm font-normal disabled:cursor-not-allowed disabled:opacity-50 w-full md:w-max"
                  >
                    <span>Submit</span>
                  </button>
                </template>
              </template>

              <router-link
                to="products"
                v-else
              >
                <button
                  @click="cart.removeAllFromCart()"
                  type="button"
                  class="btn btn-dark text-sm font-normal w-full ease-in-out md:w-max disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span> Shop More </span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script setup>
import Card from "@/components/Card";
import CartStep from "@/components/Ecommerce/step/cart-step.vue";
import ShippingInfo from "@/components/Ecommerce/step/shipping-info.vue";
import StepBox from "@/components/Ecommerce/step/step-box.vue";
import InvoiceCart from "@/components/Ecommerce/step/invoice-cart.vue";
import DeliveryInfo from "@/components/Ecommerce/step/delivery-info.vue";
import Payment from "@/components/Ecommerce/step/payment.vue";

import { ref } from "vue";
import { cartStore } from "@/store/cart";

const cart = cartStore();

let stepNumber = ref(1);
const stepsArray = [
  {
    step: 1,
    icon: "mdi:cart-outline",
    title: "My Cart",
  },
  {
    step: 2,
    icon: "streamline:shipping-transfer-cart-package-box-fulfillment-cart-warehouse-shipping-delivery",
    title: "Shipping Info",
  },
  {
    step: 3,
    icon: "la:shipping-fast",
    title: "Delivery Info",
  },
  {
    step: 4,
    icon: "fluent:payment-32-regular",
    title: "Payment",
  },
  {
    step: 5,
    icon: "line-md:confirm-circle",
    title: "Confirmation",
  },
];
</script>

<style lang="scss"></style>
