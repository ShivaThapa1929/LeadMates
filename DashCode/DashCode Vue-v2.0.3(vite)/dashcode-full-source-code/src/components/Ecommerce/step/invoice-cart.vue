<template>
  <div class="p-6">
    <div class="text-center mb-8">
      <h4 class="text-slate-900 dark:text-slate-300 text-2xl font-medium pb-4">
        Thank You for Your Order!
      </h4>
      <p class="text-slate-900 dark:text-slate-300 text-base font-normal">
        A copy or your order summary has been sent to
        <span
          class="dark:text-slate-400 text-base font-medium ml-1 cursor-pointer"
        >
          customer@example.com
        </span>
      </p>
    </div>
    <div class="border dark:border-slate-700 p-3 lg:p-6 rounded">
      <p
        class="text-slate-900 dark:text-slate-300 text-base font-medium pb-3 border-b dark:border-slate-700 mb-4"
      >
        Order Summary
      </p>
      <div
        class="grid grid-cols-12 md:space-x-3 lg:space-x-5 space-y-3 md:space-y-0 overflow-auto"
      >
        <div class="flex-none col-span-12 md:col-span-6">
          <div class="flex space-x-1 md:space-x-3 rtl:space-x-reverse">
            <div
              class="font-medium md:text-sm text-xs text-slate-900 dark:text-slate-300 space-y-3 min-w-[110px]"
            >
              <p>Order Date:</p>
              <p>Name:</p>
              <p>Email:</p>
              <p>Shipping address:</p>
            </div>
            <div
              class="font-normal md:text-sm text-xs text-slate-900 dark:text-slate-300 space-y-3 min-w-[110px]"
            >
              <p>23-07-2023 09:53 AM</p>
              <p>Prantik Chakraborty</p>
              <p>customer.example@gmail.com</p>
              <p>
                3947 West Side Avenue Hackensack, NJ 07601, College, United
                States
              </p>
            </div>
          </div>
        </div>
        <div class="flex-none col-span-12 md:col-span-6">
          <div class="flex space-x-1 md:space-x-3 rtl:space-x-reverse">
            <div
              class="font-medium md:text-sm text-xs text-slate-900 dark:text-slate-300 space-y-3 min-w-[110px]"
            >
              <p>Order Status:</p>
              <p>Total order amount:</p>
              <p>Shipping:</p>
              <p>Payment method:</p>
            </div>
            <div
              class="font-normal md:text-sm text-xs text-slate-900 dark:text-slate-300 space-y-3 min-w-[110px]"
            >
              <p>Pending</p>
              <p>$350.00</p>
              <p>Flat shipping rate</p>
              <p>Cash on Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="py-12 text-center lg:text-2xl text-xl font-normal text-slate-900 dark:text-slate-300"
    >
      Order Code:
      <span class="lg:text-2xl text-xl font-medium"> 20230723-09532646 </span>
    </div>
    <div class="p-3 md:p-6 rounded">
      <p class="text-slate-900 dark:text-slate-300 text-base font-medium pb-3">
        Order Details
      </p>
      <div class="bg-white dark:bg-slate-800 space-y-7">
        <div class="overflow-x-auto border-0">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden">
              <table
                class="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
              >
                <thead class="border-0 border-slate-00 dark:border-slate-700">
                  <tr>
                    <th
                      scope="col"
                      class="table-th py-3 text-slate-900 dark:text-slate-300 font-medium lg:text-base text-sm normal-case pl-0 rtl:pr-0 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      class="table-th py-3 text-slate-900 dark:text-slate-300 font-medium lg:text-base text-sm normal-case ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      class="table-th py-3 text-slate-900 dark:text-slate-300 font-medium lg:text-base text-sm normal-case ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      Delivery Type
                    </th>
                    <th
                      scope="col"
                      class="table-th py-3 text-slate-900 dark:text-slate-300 font-medium lg:text-base text-sm normal-case pr-0 rtl:pl-0 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"

                >
                  <tr class="py-3" v-for="(item, index) in cart.getItems" :key="index">
                    <td
                      class="table-td pt-3 flex items-center space-x-3 rtl:space-x-reverse pb-3 pl-0 rtl:pr-0 ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      <div
                        class="md:p-4 p-2 flex-none bg-slate-200 rounded md:h-20 md:w-20 w-16 h-16 rtl:ml-3"
                      >
                        <img
                          class="w-full h-full object-contain"
                          :src="item.img"
                        />
                      </div>
                      <div>
                        <p
                          class="text-slate-900 dark:text-slate-300 lg:text-base text-sm font-normal md:pb-2 pb-1 lg:w-[380px] w-[150px] truncate"
                        >
                          {{item.name}}
                        </p>
                      </div>
                    </td>
                    <td
                      class="table-td pt-3 pb-3 text-slate-900 dark:text-slate-300 text-sm lg:text-base font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                        {{item.quantity}}
                    </td>
                    <td
                      class="table-td pt-3 pb-3 text-slate-900 dark:text-slate-300 text-sm lg:text-base font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      Home Delivery
                    </td>
                    <td
                      class="table-td pt-3 pb-3 pr-0 rtl:pl-0 text-slate-900 dark:text-slate-300 text-sm lg:text-base font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left"
                    >
                      ${{item.price * item.quantity}}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                class="md:flex lg:py-6 py-3 items-center justify-end border-t dark:border-slate-700 mt-3"
              >
                <div class="flex-none min-w-[270px] space-y-3">
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span
                        class="font-medium text-slate-900 text-xs lg:text-sm dark:text-slate-300"
                      >
                        Subtotal:
                      </span>
                      <span
                        class="text-slate-900 dark:text-slate-300 font-medium text-xs lg:text-sm"
                      >
                        ${{ cart.totalPrice }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span
                        class="font-medium text-slate-900 text-xs lg:text-sm dark:text-slate-300"
                      >
                        Tax:
                      </span>
                      <span
                        class="text-slate-700 dark:text-slate-300 text-xs lg:text-sm font-normal"
                      >
                        $00.00
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span
                        class="font-medium text-slate-900 text-xs lg:text-sm dark:text-slate-300"
                      >
                        Shipping:
                      </span>
                      <span
                        class="text-slate-700 dark:text-slate-300 text-xs lg:text-sm font-normal"
                      >
                        $00.00
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span
                        class="font-medium text-slate-900 text-xs lg:text-sm dark:text-slate-300"
                      >
                        Coupon Discount:
                      </span>
                      <span
                        class="text-slate-700 dark:text-slate-300 text-xs lg:text-sm font-normal"
                      >
                        $00.00
                      </span>
                    </div>
                  </div>
                  <div class="border-t dark:border-slate-700">
                    <div class="flex justify-between pt-3">
                      <span
                        class="font-medium text-slate-900 text-xs lg:text-sm dark:text-slate-300"
                      >
                        Total:
                      </span>
                      <span
                        class="text-slate-900 dark:text-slate-300 text-xs lg:text-sm"
                      >
                        ${{ cart.totalPrice }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { cartStore } from "@/store/cart";
const cart = cartStore();
</script>

<style lang="scss" scoped></style>
