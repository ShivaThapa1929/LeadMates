<script setup>
import CounterButton from "@/components/Ecommerce/counter-button.vue";
import blackJumper from "@/assets/images/e-commerce/product-card/classical-black-tshirt.png";
import one from "@/assets/images/e-commerce/productDetails/1.png";
import two from "@/assets/images/e-commerce/productDetails/2.png";
import three from "@/assets/images/e-commerce/productDetails/3.png";
import gmail from "@/assets/images/e-commerce/productDetails/gmail.svg";
import facebook from "@/assets/images/e-commerce/productDetails/facebook.svg";
import twitter from "@/assets/images/e-commerce/productDetails/twitter.svg";
import insta from "@/assets/images/e-commerce/productDetails/insta.svg";
import linkedin from "@/assets/images/e-commerce/productDetails/linkedin.svg";
import Icon from "@/components/Icon";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import ThumbSlider from "@/components/Ecommerce/thumb-slider.vue";
import { cartStore } from "@/store/cart";
import { useQuery } from "@tanstack/vue-query";
import { getProductById } from "@/plugins/axios";
import { useRoute } from "vue-router";
import { ref } from "vue";
const props = defineProps({
  product: Object,
  id: String,
});
const color = ref("black");

const size = ref("S");

const colors = [
  { code: "black" },
  { code: "pink" },
  { code: "orange" },
  { code: "red" },
  { code: "yellow" },
];

const sizes = [
  { code: "S" },
  { code: "M" },
  { code: "L" },
  { code: "XL" },
  { code: "XXL" },
];

const setSize = (newSize) => {
  size.value = newSize;
};

const changeColor = (newColor) => {
  color.value = newColor;
};

const cart = cartStore();
const route = useRoute();

const productId = route.params.id;

const buttons = [
  {
    title: "Description",
  },
  {
    title: "Additional Info",
  },
];

const { isLoading, isError, isFetching, data, error, refetch } = useQuery({
  queryKey: ["product"],
  queryFn: () => getProductById(productId),
});
</script>
<template>
  <span v-if="isLoading"> loading...</span>

  <div class="w-full bg-white dark:bg-slate-800 p-6 rounded-lg" v-else>
    <div class="pb-5">
      <div
        class="grid grid-cols-12 md:space-x-6 md:space-y-0 space-y-4 sm:space-y-4 rtl:space-x-reverse"
      >
        <div class="col-span-12 md:col-span-5 lg:col-span-4 space-y-4">
          <ThumbSlider :product="data.product" />
        </div>
        <div class="col-span-12 md:col-span-7 lg:col-span-8 space-y-2">
          <div class="space-y-2">
            <h1
              class="text-slate-900 dark:text-slate-300 text-xl lg:text-2xl font-medium"
            >
              {{ data.product.name }}
            </h1>
            <p
              class="flex items-center text-slate-900 dark:text-slate-300 font-normal text-sm lg:text-base space-x-1.5 rtl:space-x-reverse"
            >
              <Icon icon="ph:star-fill" class="text-yellow-400" />
              <Icon icon="ph:star-fill" class="text-yellow-400" />
              <Icon icon="ph:star-fill" class="text-yellow-400" />
              <Icon icon="ph:star-fill" class="text-yellow-400" />
              <Icon icon="ph:star-fill" class="text-slate-300/80" />
              <span
                class="ltr:pl-2 rtl:pr-2 text-slate-500 dark:text-slate-400"
              >
                (789 reviews)
              </span>
            </p>
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <p
                class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
              >
                Brand:
              </p>
              <p
                class="font-medium text-sm lg:text-base text-slate-900 dark:text-slate-300 capitalize"
              >
                {{ data.product.brand }}
              </p>
            </div>
            <div class="flex items-center space-x-2 rtl:space-x-reverse">
              <p
                class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
              >
                Available:
              </p>
              <p
                class="font-medium text-sm lg:text-base text-slate-900 dark:text-slate-300"
              >
                In Stock
              </p>
            </div>
            <p
              class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
            >
              {{ data.product.desc }}
            </p>
          </div>
          <div class="flex flex-col space-y-4 py-4 !mt-0">
            <div class="flex flex-col space-y-3">
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <p
                  class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                >
                  Color:
                </p>
                <p
                  class="font-medium text-sm lg:text-base text-slate-900 dark:text-slate-300 capitalize"
                >
                  {{ color }}
                </p>
              </div>
              <div class="flex space-x-4 rtl:space-x-reverse h-6">
                <label v-for="(innerColor, i) in colors" :key="i">
                  <input
                    type="radio"
                    name="color"
                    :value="innerColor.code"
                    @change="changeColor(innerColor.code)"
                    class="hidden"
                  />
                  <div
                    :style="{ backgroundColor: innerColor.code }"
                    class="h-7 w-7"
                    :class="{
                      'ring-slate-900 dark:ring-slate-50':
                        innerColor.code === color,
                      'ring-slate-300 dark:ring-slate-700':
                        innerColor.code !== color,
                      'ring-1': true,
                      'ring-offset-2': true,
                      'dark:ring-offset-slate-800 ring-offset-slate-50': true,
                      'cursor-pointer': true,
                      'rounded-sm': true,
                    }"
                  />
                </label>
              </div>
            </div>
            <div class="flex flex-col space-y-3">
              <div class="flex items-center space-x-2 rtl:space-x-reverse">
                <p
                  class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                >
                  Size:
                </p>
                <p
                  class="font-medium text-base text-slate-900 dark:text-slate-300"
                >
                  {{ size }}
                </p>
              </div>
              <div
                class="flex items-center space-x-4 rtl:space-x-reverse mb-4 h-6"
              >
                <label v-for="(list, i) in sizes" :key="i">
                  <input
                    type="radio"
                    name="size"
                    :value="list.code"
                    @change="setSize(list.code)"
                    class="hidden h-7 w-7"
                  />
                  <div
                    :style="{ backgroundColor: list.code }"
                    class="h-7 w-7"
                    :class="{
                      'ring-slate-900 dark:ring-slate-50': list.code === size,
                      'ring-slate-300 dark:ring-slate-700': list.code !== size,
                      'ring-1': true,
                      'dark:text-slate-300 text-slate-900': true,
                      'dark:ring-slate-900': list.code === size,
                      'ring-offset-2': true,
                      flex: true,
                      'justify-center': true,
                      'items-center': true,
                      'ring-offset-white dark:ring-offset-slate-900': true,
                      'cursor-pointer': true,
                      'dark:ring-offset-transparent': true,
                      'rounded-sm': true,
                    }"
                  >
                    {{ list.code }}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div
            class="w-full border-t border-slate-300 dark:border-slate-600"
          ></div>

          <div class="overflow-x-auto">
            <div class="inline-block max-w-full align-middle">
              <div class="overflow-hidden">
                <table class="min-w-full">
                  <tbody class="bg-white dark:bg-slate-800">
                    <tr>
                      <td
                        class="table-td py-2 pl-0 rtl:pr-0 font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                      >
                        Price:
                      </td>
                      <td
                        class="table-td py-2 px-8 space-x-3 rtl:space-x-reverse"
                      >
                        <span
                          class="text-slate-900 dark:text-slate-300 font-semibold text-base lg:text-xl"
                        >
                          ${{ data.product.price }}
                        </span>
                        <del
                          class="text-slate-500 dark:text-slate-400 font-semibold text-base lg:text-xl"
                        >
                          {{ data.product.oldPrice }}
                        </del>
                        <Badge
                          class="font-normal text-[10px] bg-danger-600 text-white"
                        >
                          <span>{{ data.product.percent }}</span>
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="table-td py-2 pl-0 rtl:pr-0 font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                      >
                        Quantity:
                      </td>

                      <td class="table-td py-2 px-8">
                        <CounterButton
                          :product="data?.product"
                          v-if="
                            cart.getItems.find((item) => item.id == productId)
                          "
                        />
                        <span v-else>
                          <div
                            class="flex space-x-4 rtl:space-x-reverse items-center cursor-not-allowed"
                          >
                            <div
                              class="flex-1 h-8 flex border border-1 border-slate-400 delay-150 ease-in-out dark:border-slate-600 divide-x-[1px] rtl:divide-x-reverse text-sm font-normal divide-slate-500 dark:divide-slate-600 rounded cursor-not-allowed"
                            >
                              <button
                                type="button"
                                class="flex-none px-2 dark:text-white text-slate-900 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-700 cursor-not-allowed opacity-50"
                              >
                                <Icon icon="eva:minus-fill" />
                              </button>

                              <div
                                class="flex-1 w-[62px] text-center text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-not-allowed"
                              >
                                0
                              </div>
                              <button
                                type="button"
                                class="flex-none px-2 cursor-not-allowed opacity-50 text-slate-900 hover:bg-slate-900 hover:text-white dark:text-white dark:hover:bg-slate-700 rtl:dark:hover:rounded-l ltr:dark:hover:rounded-r"
                              >
                                <Icon icon="eva:plus-fill" />
                              </button>
                            </div></div
                        ></span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="table-td py-2 pl-0 rtl:pr-0 font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                      >
                        Total Price:
                      </td>
                      <td
                        v-if="
                          cart.getItems.find((item) => item.id === productId)
                        "
                        class="table-td py-2 px-8 text-slate-900 dark:text-slate-300 font-semibold text-base lg:text-xl"
                      >
                        ${{
                          data?.product?.price *
                          cart.getItems.find((item) => item.id === productId)
                            .quantity
                        }}
                      </td>
                      <td
                        v-else
                        class="table-td py-2 px-8 text-slate-900 dark:text-slate-300 font-semibold text-base lg:text-xl"
                      >
                        ${{ data?.product?.price }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse pb-5"
          >
            <Button
              @click="cart.addToCart(data.product)"
              :disabled="cart.getItems.find((item) => item.id === productId)"
              text="Add to Cart"
              icon="heroicons:shopping-bag"
              btnClass="btn-outline-dark w-[180px] btn-sm font-medium hover:bg-slate-900 dark:text-white hover:text-white dark:hover:text-white dark:hover:bg-slate-700 flex items-center  disabled:cursor-not-allowed disabled:opacity-50"
              iconClass=" text-sm leading-none"
            />
            <Button
              text="Buy Now"
              btnClass="btn-outline-dark w-[180px] btn-sm bg-slate-900 dark:bg-slate-800 font-medium hover:bg-white text-white hover:text-slate-900 dark:hover:text-white dark:hover:!bg-slate-700 flex items-center"
              iconClass=" text-sm leading-none"
            />
            <div class="flex space-x-3 rtl:space-x-reverse">
              <Button
                icon="octicon:heart-16"
                btnClass="btn-outline-secondary w-[40px] border dark:border-slate-600 dark:hover:border-slate-600 btn-sm font-medium hover:bg-slate-900 hover:text-white dark:hover:text-white dark:hover:bg-slate-700 flex items-center"
                iconClass=" text-sm leading-none"
              />
              <Button
                icon="eva:repeat-fill"
                btnClass="btn-outline-secondary w-[40px] border dark:border-slate-600 dark:hover:border-slate-600 btn-sm font-medium hover:bg-slate-900 hover:text-white dark:hover:text-white dark:hover:bg-slate-700 flex items-center"
                iconClass=" text-sm leading-none"
              />
            </div>
          </div>
          <div
            class="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3 rtl:space-x-reverse"
          >
            <p
              class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
            >
              Share to:
            </p>
            <div class="flex items-center space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                class="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center"
              >
                <img class="w-full h-full" :src="gmail" />
              </button>
              <button
                type="button"
                class="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center"
              >
                <img class="w-full h-full" :src="facebook" />
              </button>
              <button
                type="button"
                class="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center"
              >
                <img class="w-full h-full" :src="twitter" />
              </button>
              <button
                type="button"
                class="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center"
              >
                <img class="w-full h-full" :src="insta" />
              </button>
              <button
                type="button"
                class="border p-2 dark:border-slate-600 rounded h-8 w-8 flex justify-center items-center"
              >
                <img class="w-full h-full" :src="linkedin" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-5">
      <div class="border border-1 dark:border-slate-700 rounded">
        <Card>
          <TabGroup>
            <TabList
              class="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse"
            >
              <Tab
                v-slot="{ selected }"
                as="template"
                v-for="(item, i) in buttons"
                :key="i"
              >
                <button
                  :class="[
                    selected
                      ? 'text-slate-900 dark:text-slate-300 before:w-full'
                      : 'text-slate-500 before:w-0 dark:text-slate-500',
                  ]"
                  class="text-lg lg:text-xl font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2 transition duration-150 before:transition-all before:duration-150 relative before:absolute before:left-1/2 before:bottom-[-6px] before:h-[1.5px] before:bg-slate-900 dark:before:bg-slate-300 before:-translate-x-1/2"
                >
                  {{ item.title }}
                </button>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div
                  class="text-slate-600 dark:text-slate-400 text-sm lg:text-base font-normal"
                >
                  <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore
                    magna. Lorem ipsum dolor sit amet, consetetur sadipscing
                    elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                    dolore magna. Lorem ipsum dolor sit amet, consetetur
                    sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna.
                  </p>
                  <ul
                    class="space-y-3 p-6 sm:ml-14 lg:ml-28 ml-0 rounded-md bg-slate-white dark:bg-slate-800"
                  >
                    <li
                      class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                    >
                      <span
                        class="h-[10px] w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                      ></span>
                      <span>Lorem ipsum dolor sit amet.</span>
                    </li>
                  </ul>
                  <p
                    class="text-slate-600 dark:text-slate-400 text-sm lg:text-base font-normal"
                  >
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore
                    magna. Lorem ipsum dolor sit amet, consetetur sadipscing
                    elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                    dolore magna. Lorem ipsum dolor sit amet, consetetur
                    sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna.
                  </p>
                </div>
              </TabPanel>
              <TabPanel>
                <div
                  class="text-slate-600 dark:text-slate-400 text-sm font-normal"
                >
                  <div
                    class="flex justify-between items-start pb-4 overflow-auto space-x-3 rtl:space-x-reverse"
                  >
                    <ul
                      class="space-y-3 rounded-md bg-slate-white dark:bg-slate-800 min-w-[200px]"
                    >
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> Brand : Easy</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> Material : Cotton</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> Pattern : Solid Color</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span>Collar : Square Neck</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span>Color : As given picture</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span>Sleeve Length : Long Sleeve</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span>Plate Type : Slim</span>
                      </li>
                    </ul>
                    <ul
                      class="space-y-3 rounded-md bg-slate-white dark:bg-slate-800 min-w-[200px]"
                    >
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span
                          >Sales Channel Type : E-commerce Only Sells
                          Online</span
                        >
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> Material Composition : 100% Cotton</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> Size : M,L,XL</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> M- long: 29", body: 40"</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> L- long: 30 ", body: 42"</span>
                      </li>
                      <li
                        class="text-sm lg:text-base text-slate-600 dark:text-slate-400 flex space-x-2 items-center rtl:space-x-reverse"
                      >
                        <span
                          class="h-[5px] md:h-[10px] w-[5px] md:w-[10px] bg-slate-900 dark:bg-slate-400 rounded-full inline-block"
                        ></span>
                        <span> XL- long: 31", body: 44"</span>
                      </li>
                    </ul>
                  </div>
                  <p
                    class="text-slate-600 dark:text-slate-400 text-sm lg:text-base font-normal"
                  >
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy eirmod tempor invidunt ut labore et dolore
                    magna. Lorem ipsum dolor sit amet, consetetur sadipscing
                    elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                    dolore magna. Lorem ipsum dolor sit amet, consetetur
                    sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                    labore et dolore magna.
                  </p>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
      <div class="border border-1 dark:border-slate-700 rounded p-6">
        <h6 class="text-slate-900 dark:text-slate-300 pb-6 text-lg lg:text-xl">
          Reviews & Ratings
        </h6>
        <div class="space-y-12">
          <div
            class="bg-secondary-100 dark:bg-slate-700 p-6 rounded grid grid-cols-12"
          >
            <div
              class="col-span-12 items-center md:col-span-6 flex space-x-3 justify-center md:justify-start rtl:space-x-reverse order-2 md:order-1 mt-3 md:mt-0"
            >
              <div class="font-medium items-center flex">
                <p
                  class="text-slate-900 dark:text-slate-300 text-base lg:text-lg"
                >
                  4.2
                </p>
                <p
                  class="text-slate-500 dark:text-slate-400 text-sm lg:text-base"
                >
                  /5
                </p>
              </div>
              <div
                class="flex flex-col sm:flex-row sm:items-center md:justify-start text-slate-900 dark:text-slate-300 font-normal text-sm lg:text-base"
              >
                <div class="flex items-center space-x-1.5">
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-slate-300/80" />
                </div>
                <div class="text-slate-500 dark:text-slate-400">
                  (789 reviews)
                </div>
              </div>
            </div>
            <div
              class="col-span-12 md:col-span-6 flex justify-center md:justify-end items-center order-1 md:order-2"
            >
              <button
                type="button"
                class="bg-yellow-500 text-white rounded px-6 py-3 text-sm lg:text-base"
              >
                Rate this product
              </button>
            </div>
          </div>
          <div class="flex space-x-3 rtl:space-x-reverse">
            <div
              class="h-14 w-14 rounded-full object-cover bg-white ring-1 overflow-hidden flex-none"
            >
              <img class="h-full w-full object-contain" :src="blackJumper" />
            </div>
            <div>
              <div>
                <p
                  class="text-slate-900 dark:text-slate-300 font-medium text-sm lg:text-base pb-1"
                >
                  Devied Beakhum
                </p>
                <p
                  class="text-slate-500 dark:text-slate-400 font-normal text-xs pb-1"
                >
                  08-03-2023
                </p>
                <p
                  class="flex items-center text-slate-900 dark:text-slate-300 font-normal text-sm lg:text-base space-x-1.5 rtl:space-x-reverse pb-3"
                >
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                </p>
                <p
                  class="pb-4 text-sm lg:text-base text-slate-500 dark:text-slate-400"
                >
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna.
                  Lori ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt.
                </p>
                <div class="flex space-x-2 rtl:space-x-reverse pb-3">
                  <p
                    class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                  >
                    Info:
                  </p>
                  <p class="font-medium text-sm lg:text-base text-[#10B26C]">
                    Verified Purchase
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-12">
                <div
                  class="col-span-12 flex justify-end space-x-4 rtl:space-x-reverse dark:text-slate-400"
                >
                  <p class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="cursor-pointer">
                      <Icon icon="heroicons:hand-thumb-up" />
                    </span>
                    <span>02</span>
                  </p>
                  <p class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="cursor-pointer">
                      <Icon icon="carbon:reply" />
                    </span>
                    <span>00</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex space-x-3 rtl:space-x-reverse">
            <div
              class="h-14 w-14 rounded-full object-cover bg-white ring-1 overflow-hidden flex-none"
            >
              <img class="h-full w-full object-contain" :src="blackJumper" />
            </div>
            <div>
              <div>
                <p
                  class="text-slate-900 dark:text-slate-300 font-medium text-sm lg:text-base pb-1"
                >
                  Devied Beakhum
                </p>
                <p
                  class="text-slate-500 dark:text-slate-400 font-normal text-xs pb-1"
                >
                  08-03-2023
                </p>
                <p
                  class="flex items-center text-slate-900 dark:text-slate-300 font-normal text-sm lg:text-base space-x-1.5 rtl:space-x-reverse pb-3"
                >
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                  <Icon icon="ph:star-fill" class="text-yellow-400" />
                </p>
                <p
                  class="pb-4 text-sm lg:text-base text-slate-500 dark:text-slate-400"
                >
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna.
                  Lori ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt.
                </p>
                <div class="flex space-x-2 rtl:space-x-reverse pb-3">
                  <p
                    class="font-normal text-sm lg:text-base text-slate-500 dark:text-slate-400"
                  >
                    Info:
                  </p>
                  <p class="font-medium text-sm lg:text-base text-[#10B26C]">
                    Verified Purchase
                  </p>
                </div>
              </div>
              <div class="grid grid-cols-12">
                <div class="col-span-12 mb-3">
                  <div class="flex space-x-2 rtl:space-x-reverse mb-9">
                    <div
                      class="h-[90px] w-[90px] rounded bg-slate-100 p-1 overflow-hidden"
                    >
                      <img class="h-full w-full object-contain" :src="three" />
                    </div>
                    <div
                      class="h-[90px] w-[90px] rounded bg-slate-100 overflow-hidden p-1"
                    >
                      <img class="h-full w-full object-contain" :src="one" />
                    </div>
                    <div
                      class="h-[90px] w-[90px] rounded bg-slate-100 overflow-hidden p-1"
                    >
                      <img class="h-full w-full object-contain" :src="two" />
                    </div>
                  </div>
                  <div
                    class="max-h-[400px] max-w-[346px] rounded bg-slate-100 overflow-hidden p-1"
                  >
                    <img class="h-full w-full object-contain" :src="three" />
                  </div>
                </div>
                <div
                  class="col-span-12 flex justify-end dark:text-slate-400 space-x-4 rtl:space-x-reverse"
                >
                  <p class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="cursor-pointer">
                      <Icon icon="heroicons:hand-thumb-up" />
                    </span>
                    <span>02</span>
                  </p>
                  <p class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="cursor-pointer">
                      <Icon icon="carbon:reply" />
                    </span>
                    <span>00</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
