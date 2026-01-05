<template>
  <Card bodyClass="p-3 rounded-md ">
    <div class="group md:flex flex-none">
      <router-link
        :to="{ name: 'product-details', params: { id: product.id } }"
      >
        <div
          class="bg-secondary-200 dark:rounded relative h-[259px] flex flex-col justify-center items-center rounded-md mb-3 lg:mb-0 ltr:md:mr-3 ltr:sm:mr-0 rtl:md:ml--3 rtl:sm:ml-0 ltr:lg:mr-3 rtl:lg:ml-3"
        >
          <div class="h-[235px] w-[266px] p-12">
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
          </div></div
      ></router-link>

      <div>
        <p
          class="text-xs text-slate-900 dark:text-slate-300 font-normal uppercase pb-2"
        >
          {{ product.category }}
        </p>
        <router-link
          :to="{ name: 'product-details', params: { id: product.id } }"
        >
          <h6
            class="text-slate-900 dark:text-slate-300 text-lg font-medium pb-2 w-full truncate"
          >
            {{ product.name }}
          </h6></router-link
        >

        <p class="pb-2 space-x-2 rtl:space-x-reverse">
          <span
            class="text-slate-900 dark:text-slate-300 text-lg font-semibold"
          >
            ${{ product.price }}
          </span>
          <del class="text-slate-500 dark:text-slate-500 font-normal text-lg">
            {{ product.oldPrice }}
          </del>
        </p>

        <span
          class="flex items-center text-slate-900 dark:text-slate-300 font-normal text-xs space-x-[4px] rtl:space-x-reverse pb-3"
        >
          <Icon icon="ph:star-fill" class="text-yellow-400" />
          <Icon icon="ph:star-fill" class="text-yellow-400" />
          <Icon icon="ph:star-fill" class="text-yellow-400" />
          <Icon icon="ph:star-fill" class="text-yellow-400" />
          <span class="ltr:pl-2 rtl:pr-2">{{ product.rating }}</span>
        </span>

        <p class="text-slate-500 dark:text-slate-500 text-sm font-normal pb-4">
          {{ product.desc }}
        </p>
        <div class="flex space-x-4 rtl:space-x-reverse md:max-w-[370px]">
          <CounterButton
            :product="product"
            v-if="cart.getItems.find((item) => item.id == props.product.id)"
          />

          <Button
            :disabled="
              cart.getItems.find((item) => item.id == props.product.id)
            "
            @click="cart.addToCart(product)"
            text="Add to Cart"
            icon="heroicons:shopping-bag"
            btnClass="btn-outline-dark w-full btn-sm font-medium hover:bg-slate-900 hover:text-white dark:hover:text-white dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            iconClass=" text-sm leading-none"
          />
        </div>
      </div>
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
});
</script>

<style lang="scss" scoped></style>
