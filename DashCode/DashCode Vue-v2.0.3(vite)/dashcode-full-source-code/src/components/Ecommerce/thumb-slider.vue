<template>
  <Swiper
    :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff',
    }"
    :loop="true"
    :spaceBetween="10"
    :navigation="false"
    :thumbs="{ swiper: thumbsSwiper }"
    :modules="modules"
    class="mySwiper2"
  >
    <SwiperSlide
      v-for="(image, i) in images"
      :key="i"
      class="h-[409px] w-[396px] py-11 px-14 bg-secondary-200 rounded-md"
    >
      <img
        class="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
        :src="image"
        alt="."
      />
    </SwiperSlide>
  </Swiper>

  <div :class="['flex mt-6 space-x-3', isRtl ? 'space-x-reverse' : '']">
    <Swiper
      @swiper="setThumbsSwiper"
      :loop="true"
      :spaceBetween="10"
      :slidesPerView="4"
      :freeMode="true"
      :watchSlidesProgress="true"
      :modules="modules"
      class="mySwiper"
    >
      <SwiperSlide
        v-for="(image, i) in images"
        :key="i"
        class="h-[90px] w-[90px] py-[14px] px-[17px] bg-secondary-200 rounded"
      >
        <img class="h-full w-full object-contain" :src="image" alt="." />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Thumbs } from "swiper/core";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Import required modules
import blackJumper from "@/assets/images/e-commerce/product-card/classical-black-tshirt.png";
import blackTshirt from "@/assets/images/e-commerce/product-card/black-t-shirt.png";
import checkShirt from "@/assets/images/e-commerce/product-card/check-shirt.png";
import grayJumper from "@/assets/images/e-commerce/product-card/gray-jumper.png";
import grayTshirt from "@/assets/images/e-commerce/product-card/gray-t-shirt.png";
import pinkBlazer from "@/assets/images/e-commerce/product-card/pink-blazer.png";
import redTshirt from "@/assets/images/e-commerce/product-card/red-t-shirt.png";
import yellowFrok from "@/assets/images/e-commerce/product-card/yellow-frok.png";
import yellowJumper from "@/assets/images/e-commerce/product-card/yellow-jumper.png";
import { useThemeSettingsStore } from "@/store/themeSettings";

const images = [
  blackJumper,
  blackTshirt,
  checkShirt,
  grayTshirt,
  grayJumper,
  pinkBlazer,
  redTshirt,
  yellowFrok,
  yellowJumper,
];

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper;
};

const themeSettings = useThemeSettingsStore();

const isRtl = ref(false);

watch(themeSettings, (newThemeSettings) => {
  isRtl.value = newThemeSettings.direction;
});

const modules = [Navigation, Thumbs];

const props = defineProps({
  product: Object,
  id: String,
});
</script>

<style lang="scss" scoped></style>
