<template>
  <Card bodyClass="p-4 rounded-md">
    <router-link :to="{ name: 'product-details', params: { id: product.id } }">
      <div class="group">
        <div
          class="bg-secondary-200 dark:rounded relative h-[191px] flex flex-col justify-center items-center mb-3 rounded-md"
        >
          <div class="h-[146px]">
            <img
              class="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
              :src="product.img"
            />

            <Badge
              class="font-normal bg-danger-600 text-white absolute ltr:left-2 rtl:right-2 top-3"
            >
              {{ product.percent }}
            </Badge>

            <div
              class="hover-box flex flex-col invisible absolute ltr:right-2 rtl:left-2 top-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300"
            >
              <button class="bg-white p-2.5 mb-1.5 rounded-full">
                <Icon
                  icon="ph:heart-fill"
                  class="text-slate-400 dark:text-slate-400 hover:text-danger-600 dark:hover:text-danger-600"
                />
              </button>
              <button class="bg-white p-2.5 mb-1.5 rounded-full">
                <Icon
                  icon="ph:eye"
                  class="text-slate-400 dark:text-slate-400 hover:text-danger-600 dark:hover:text-danger-600"
                />
              </button>
              <button class="bg-white p-2.5 mb-1.5 rounded-full">
                <Icon
                  icon="jam:refresh-reverse"
                  class="text-slate-400 dark:text-slate-400 hover:text-danger-600 dark:hover:text-danger-600"
                />
              </button>
            </div>
          </div>
        </div></div
    ></router-link>

    <div>
      <div class="flex justify-between items-center">
        <p
          class="text-xs text-slate-900 dark:text-slate-300 uppercase font-normal"
        >
          {{ product.category }}
        </p>

        <span
          class="flex items-center text-slate-900 dark:text-slate-300 font-normal text-xs space-x-1 rtl:space-x-reverse"
        >
          <Icon icon="ph:star-fill" class="text-yellow-400" />
          <span>{{ product.rating }}</span>
        </span>
      </div>

      <router-link
        :to="{ name: 'product-details', params: { id: product.id } }"
      >
        <h6
          class="text-slate-900 dark:text-slate-300 text-base font-medium mt-2 truncate"
        >
          {{ product.name }}
        </h6>
      </router-link>
      <p
        class="text-slate-500 dark:text-slate-500 text-[11px] font-normal mt-1.5"
      >
        {{ product.subtitle }}
      </p>
      <p class="pb-4">
        <span
          class="text-slate-900 dark:text-slate-300 text-base font-medium mt-2 ltr:mr-2 rtl:mr-2"
        >
          ${{ product.price }}
        </span>
        <del class="text-slate-500 dark:text-slate-500 font-normal text-base">
          {{ product.oldPrice }}
        </del>
      </p>

      <CounterButton
        :product="product"
        v-if="cart.getItems.find((item) => item.id == props.product.id)"
      />
      <Button
        v-else
        text="Add to Cart"
        icon="heroicons:shopping-bag"
        btnClass="btn-outline-dark w-full btn-sm  font-medium hover:bg-slate-900 hover:text-white dark:hover:text-white  dark:hover:bg-slate-700 "
        iconClass=" text-sm leading-none"
        @click="cart.addToCart(product)"
      />
    </div>
  </Card>
</template>

<script setup>
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import CounterButton from "@/components/Ecommerce/counter-button.vue";
import { cartStore } from "@/store/cart";

const cart = cartStore();

const props = defineProps({
  product: Object,
  id: String,
});
</script>

<style></style>
