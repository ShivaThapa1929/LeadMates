<template>
  <div
    class="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 h-max"
  >
    <div v-for="(product, i) in getProduct?.products" :key="i">
      <ProductWish :product="product" />
    </div>
  </div>
</template>
<script setup>
import ProductWish from "@/components/Ecommerce/product-wish.vue";
import { useQuery } from "@tanstack/vue-query";
import { getProducts } from "@/plugins/axios";



const {
  data: getProduct,
} = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});

</script>
<style></style>
