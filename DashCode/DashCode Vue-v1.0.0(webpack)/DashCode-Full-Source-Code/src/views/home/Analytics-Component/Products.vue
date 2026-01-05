<template>
  <div class="grid md:grid-cols-3 grid-cols-1 gap-5">
    <div
      v-for="(item, i) in products"
      :key="i"
      class="bg-slate-50 dark:bg-slate-900 p-4 rounded text-center"
    >
      <div class="h-12 w-12 rounded-full mb-4 mx-auto">
        <img
          :src="require(`@/assets/images/all-img/${item.img}`)"
          alt=""
          class="w-full h-full rounded-full"
        />
      </div>
      <span
        class="text-slate-500 dark:text-slate-300 text-sm mb-1 block font-normal"
        >{{ item.price }}</span
      >
      <span class="text-slate-600 dark:text-slate-300 text-sm mb-4 block">{{
        item.title
      }}</span>
      <router-link
        to="#"
        class="btn btn-secondary dark:bg-slate-800 dark:hover:bg-slate-600 block w-full text-center btn-sm"
      >
        View More
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      products: [
        {
          img: "p-1.png",
          price: "$150.00",
          title: "Car engine oil",
        },
        {
          img: "p-2.png",
          price: "$150.00",
          title: "Car engine oil",
        },
        {
          img: "p-3.png",
          price: "$150.00",
          title: "Car engine oil",
        },
        {
          img: "p-4.png",
          price: "$150.00",
          title: "Car engine oil",
        },
        {
          img: "p-5.png",
          price: "$150.00",
          title: "Car engine oil",
        },
        {
          img: "p-6.png",
          price: "$150.00",
          title: "Car engine oil",
        },
      ],
    };
  },
};
</script>
<style lang=""></style>
