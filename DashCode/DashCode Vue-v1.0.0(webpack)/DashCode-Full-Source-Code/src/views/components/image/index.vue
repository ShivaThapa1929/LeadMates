<template>
  <div class="space-y-5">
    <Card title="Images">
      <Image
        src="images/all-img/image-1.png"
        alt="image one"
        imageClass="rounded-md"
      />
    </Card>
    <Card title="Responsive images">
      <span
        class="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 uppercase mb-6 mt-5"
        >Small image with fluid</span
      >
      <Image
        src="images/all-img/image-2.png"
        alt="Small image with fluid:"
        imageClass="rounded-md mb-6"
      />
      <span
        class="block text-base font-medium tracking-[0.01em] dark:text-slate-300 text-slate-500 uppercase mb-6 mt-5"
        >Large image with fluid-grow:</span
      >
      <Image
        src="images/all-img/image-3.png"
        alt="Small image with fluid-grow:"
        imageClass="rounded-md w-full "
      />
    </Card>
    <Card title="Responsive images">
      <div
        class="grid xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5"
      >
        <Image
          :src="item.src"
          alt="thumb-1"
          imageClass="rounded-md border-4 border-slate-300"
          v-for="(item, i) in images"
          :key="i"
        />
      </div>
    </Card>
  </div>
</template>
<script>
import Card from '@/components/Card';
import Image from '@/components/Image';
export default {
  components: {
    Card,
    Image,
  },
  data() {
    return {
      images: [
        {
          src: 'images/all-img/thumb-1.png',
        },
        {
          src: 'images/all-img/thumb-2.png',
        },
        {
          src: 'images/all-img/thumb-3.png',
        },
        {
          src: 'images/all-img/thumb-4.png',
        },
        {
          src: 'images/all-img/thumb-5.png',
        },
        {
          src: 'images/all-img/thumb-6.png',
        },
      ],
    };
  },
};
</script>
<style lang=""></style>
