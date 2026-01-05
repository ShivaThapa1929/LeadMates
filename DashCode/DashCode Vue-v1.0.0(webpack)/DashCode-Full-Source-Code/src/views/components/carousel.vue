<template>
  <div class="grid xl:grid-cols-2 grid-cols-1 gap-6">
    <Card title="Basic example">
      <Carousel :carousels="carousels1" />
    </Card>
    <Card title="With captions">
      <Carousel />
    </Card>
    <Card title="Carousel interval">
      <Carousel
        :carousels="carousels1"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
      />
    </Card>
    <Card title="Crossfade">
      <Carousel :carousels="carousels1" :effect="'fade'" />
    </Card>
  </div>
</template>
<script>
import Card from "@/components/Card";
import Carousel from "@/components/Carousel";
export default {
  components: {
    Carousel,
    Card,
  },
  data() {
    return {
      carousels1: [
        {
          img: "images/all-img/c1.png",
        },
        {
          img: "images/all-img/c2.png",
        },
        {
          img: "images/all-img/c3.png",
        },
        {
          img: "images/all-img/c4.png",
        },
      ],
    };
  },
};
</script>
<style lang=""></style>
