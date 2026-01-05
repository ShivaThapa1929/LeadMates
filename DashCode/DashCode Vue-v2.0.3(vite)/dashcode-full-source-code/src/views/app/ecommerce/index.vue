<template>
  <div>
    <div class="grid grid-cols-12 gap-5">
      <Card class="lg:col-span-3 lg:block hidden h-max col-span-12">
        <InputGroup type="text" appendIcon="heroicons-outline:search" merged />
        <div class="space-y-6 divide-y divide-slate-200 dark:divide-slate-700">
          <div class="space-y-2 ltr:-ml-6 ltr:pl-6 rtl:-mr-6 rtl:pr-6">
            <div
              class="text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase pt-5 pb-2"
            >
              categories
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="All" checked />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >9724</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Accessories" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >1312</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Clothing" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >3752</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Electronics" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >985</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Fashion" />
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >745</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Footwear" />
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >1280</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Furniture" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >820</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Mobile" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >2460</span
              >
            </div>

            <button
              class="text-xs font-medium text-slate-900 dark:text-slate-300 pt-1"
            >
              View Less
            </button>
          </div>
          <div class="space-y-2 ltr:-ml-6 ltr:pl-6 rtl:-mr-6 rtl:pr-6">
            <div
              class="text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase pt-5 pb-2"
            >
              brands
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Apple" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >9724</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Apex" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >1312</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Easy" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >3752</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Pixel" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >985</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="Samsung" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >2460</span
              >
            </div>

            <button
              class="text-xs font-medium text-slate-900 dark:text-slate-300 pt-1"
            >
              View Less
            </button>
          </div>
          <div class="space-y-2 ltr:-ml-6 ltr:pl-6 rtl:-mr-6 rtl:pr-6">
            <div
              class="text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase pt-5 pb-2"
            >
              price
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="$0 - $199" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >9724</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="$200 - $449" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >1312</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="$450 - $599" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >3752</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="$600 - $799" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >985</span
              >
            </div>
            <div class="flex items-center justify-between">
              <Checkbox label="$800 & Above" />

              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >745</span
              >
            </div>
          </div>
          <div class="space-y-2 ltr:-ml-6 ltr:pl-6 rtl:-mr-6 rtl:pr-6 h-max">
            <div
              class="text-slate-800 dark:text-slate-200 font-semibold text-xs uppercase pt-5 pb-2"
            >
              ratings
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-start">
                <Checkbox>
                  <template v-slot:labelHtml>
                    <span
                      class="text-slate-900 dark:text-slate-300 text-sm font-normal flex"
                      ><Icon icon="ph:star-fill" class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400"
                    /></span>
                  </template>
                </Checkbox>
              </div>
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >9724</span
              >
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-start">
                <Checkbox>
                  <template v-slot:labelHtml>
                    <span
                      class="text-slate-900 dark:text-slate-300 text-sm font-normal flex"
                      ><Icon icon="ph:star-fill" class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400"
                    /></span>
                  </template>
                </Checkbox>
              </div>
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >1312</span
              >
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-start">
                <Checkbox>
                  <template v-slot:labelHtml>
                    <span
                      class="text-slate-900 dark:text-slate-300 text-sm font-normal flex"
                      ><Icon icon="ph:star-fill" class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400"
                    /></span>
                  </template>
                </Checkbox>
              </div>
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >3752</span
              >
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-start">
                <Checkbox>
                  <template v-slot:labelHtml>
                    <span
                      class="text-slate-900 dark:text-slate-300 text-sm font-normal flex"
                      ><Icon icon="ph:star-fill" class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-yellow-500 dark:text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400"
                    /></span>
                  </template>
                </Checkbox>
              </div>
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >985</span
              >
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-start">
                <Checkbox>
                  <template v-slot:labelHtml>
                    <span
                      class="text-slate-900 dark:text-slate-300 text-sm font-normal flex"
                      ><Icon icon="ph:star-fill" class="text-yellow-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400" /><Icon
                        icon="ph:star-fill"
                        class="text-slate-500 dark:text-slate-400"
                    /></span> </template
                ></Checkbox>
              </div>
              <span
                class="text-slate-500 dark:text-slate-400 font-normal text-xs"
                >745</span
              >
            </div>
          </div>
        </div>
      </Card>
      <div class="lg:col-span-9 col-span-12">
        <div>
          <div class="md:flex mb-6 md:space-y-0 space-y-4">
            <div class="flex-1 flex items-center space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                class="border p-2.5 rounded"
                @click="setState('grid')"
                :class="[
                  view === 'grid'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-slate-300 text-slate-300',
                ]"
              >
                <Icon icon="heroicons:view-columns" class="w-6 h-6" />
              </button>
              <button
                type="button"
                class="border p-2.5 rounded"
                @click="setState('list')"
                :class="[
                  view === 'list'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-slate-300 text-slate-300',
                ]"
              >
                <Icon icon="heroicons:list-bullet" class="w-6 h-6" />
              </button>
            </div>
            <div
              class="flex-none sm:flex items-center sm:space-x-4 sm:rtl:space-x-reverse sm:space-y-0 space-y-2"
            >
              <div class="flex space-x-3 rtl:space-x-reverse items-center">
                <label
                  for="select"
                  class="text-sm font-normal text-[#68768A] w-[100px] sm:w-max"
                >
                  Show:
                </label>
                <Select
                  class="sm:w-[150px] w-full"
                  :options="options"
                  v-model="selected"
                />
              </div>
              <div class="flex space-x-3 rtl:space-x-reverse items-center">
                <label
                  class="text-sm font-normal text-[#68768A] w-[100px] sm:w-max"
                >
                  Sort by:
                </label>
                <Select
                  class="sm:w-[150px] w-full"
                  :options="options"
                  v-model="selected"
                />
              </div>
            </div>
          </div>

          <div
            v-if="view === 'grid'"
            class="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 h-max"
          >
            <div v-for="(product, i) in getProduct?.products" :key="i">
              <ProductBox :product="product" />
            </div>
          </div>

          <div v-else class="space-y-3 grid-cols-1 gap-5 h-max">
            <div v-for="(product, i) in getProduct?.products" :key="i">
              <ProductList :product="product" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import InputGroup from "@/components/InputGroup/index.vue";
import Checkbox from "@/components/Checkbox";
import ProductBox from "@/components/Ecommerce/product-box.vue";
import ProductList from "@/components/Ecommerce/product-list.vue";
import Select from "@/components/Select";
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getProducts } from "@/plugins/axios";

const selected = ref(null);

const options = [
  {
    value: "option1",
    label: "Option 1",
  },
  {
    value: "option2",
    label: "Option 2",
  },
  {
    value: "option3",
    label: "Option 3",
  },
];

const view = ref("grid");

const setState = (state) => {
  view.value = state;
};

const {
  isLoading,
  isError,
  isFetching,
  data: getProduct,
  error,
  refetch,
} = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});
</script>
<style></style>
