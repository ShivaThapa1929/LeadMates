<template>
  <div class="card rounded-sm">
    <div class="grid grid-cols-12 gap-5">
      <div class="lg:col-span-7 col-span-12">
        <h3
          class="text-slate-900 dark:text-slate-300 font-medium text-base pb-3"
        >
          Select a Payment Option
        </h3>
        <div class="card border dark:border-slate-700 rounded-sm p-5">
          <div class="space-x-5 rtl:space-x-reverse">
            <div class="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-5">
              <div v-for="(item, i) in payments" :key="i" class="w-full">
                <label
                  :class="
                    item.value === selected
                      ? 'text-slate-900 dark:text-white scale-105 ring-1 ring-primary-500 '
                      : 'scale-100'
                  "
                  :for="`sa_id${i}`"
                  class="flex justify-center h-full text-slate-900 dark:text-white border cursor-pointer rounded text-center border-slate-300 dark:border-slate-700 p-2 transition-all duration-150"
                >
                  <input
                    class="hidden"
                    type="radio"
                    name="sidebar"
                    :id="`sa_id${i}`"
                    :value="item.value"
                    v-model="selected"
                  />

                  <div class="w-full h-full">
                    <div>
                      <img
                        class="h-full w-full object-cover"
                        :src="item.img"
                        alt=""
                      />
                    </div>
                    <p class="pt-2 uppercase text-sm md:text-base">
                      {{ item.value }}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex items-center text-base text-gray-500 mt-3 space-x-1 rtl:space-x-reverse"
        >
          <Checkbox active label="I agree to the" checked />
          <p class="text-slate-900 dark:text-slate-300 font-medium">
            terms and conditions, Return Policy & Privacy Policy
          </p>
        </div>
      </div>
      <div class="lg:col-span-5 col-span-12">
        <h3
          class="text-slate-900 dark:text-slate-300 font-medium text-base pb-3"
        >
          Summary
        </h3>
        <div class="card border dark:border-slate-700 rounded-sm p-4">
          <div>
            <ul class="divide-y divide-slate-300 dark:divide-slate-600 pb-8">
              <li class="text-xs pb-3">
                <div class="flex justify-between">
                  <p>Product</p>
                  <p>Total</p>
                </div>
              </li>

              <li
                v-for="(item, index) in cart.getItems"
                :key="index"
                class="text-xs text-slate-600 dark:text-slate-300 py-2"
              >
                <div class="flex justify-between gap-3 pb-1">
                  <p class="text-sm">
                    {{ item.name }}
                    <span
                      class="text-slate-800 dark:text-slate-300 font-medium px-2"
                    >
                      x
                    </span>
                    <span
                      class="text-slate-800 dark:text-slate-300 font-medium"
                    >
                      {{ item.quantity }}
                    </span>
                  </p>
                  <p class="text-slate-800 dark:text-slate-300 font-medium">
                    ${{item.price * item.quantity}}
                  </p>
                </div>
              </li>

              <li class="text-xs py-2 space-y-2">
                <div class="flex justify-between gap-3">
                  <p class="text-slate-900 dark:text-slate-300 font-medium">
                    Subtotal
                  </p>
                  <p class="text-slate-800 dark:text-slate-300 font-medium">
                    ${{cart.totalPrice}}
                  </p>
                </div>
                <div class="flex justify-between gap-3">
                  <p class="text-slate-900 dark:text-slate-300 font-medium">
                    Tax
                  </p>
                  <p class="text-slate-800 dark:text-slate-300 font-medium">
                    $00.00
                  </p>
                </div>
                <div class="flex justify-between gap-3">
                  <p class="text-slate-900 dark:text-slate-300 font-medium">
                    Total Shipping
                  </p>
                  <p class="text-slate-800 dark:text-slate-300 font-medium">
                    $00.00
                  </p>
                </div>
              </li>
              <li class="text-xs py-2">
                <div class="flex justify-between gap-3">
                  <p class="text-slate-900 dark:text-slate-300 font-medium">
                    Total
                  </p>
                  <p class="text-slate-800 dark:text-slate-300 font-medium">
                    ${{ cart.totalPrice }}
                  </p>
                </div>
              </li>
            </ul>

            <InputGroup type="text" placeholder="Have coupon code? Apply here ">
              <template v-slot:append>
                <Button text="Go" btnClass="btn-dark dark:bg-slate-700 " />
              </template>
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { payments } from "@/constant/data";

import Checkbox from "@/components/Checkbox";
import InputGroup from "@/components/InputGroup";
import Button from "@/components/Button";
import { ref } from "vue";
import { cartStore } from "@/store/cart";

const cart = cartStore();
const selected = ref("bkash");
</script>

<style lang="scss" scoped></style>
