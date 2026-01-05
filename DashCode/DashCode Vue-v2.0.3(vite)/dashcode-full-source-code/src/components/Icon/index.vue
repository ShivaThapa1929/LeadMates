<template>
  <span>
    <Icon :icon="icon" :class="class" />
  </span>
</template>
<script>
import { Icon } from "@iconify/vue";
export default {
  components: {
    Icon,
  },
  props: {
    icon: {
      type: String,
      default: "heroicons-outline:home",
    },
    class: {
      type: String,
      default: null,
    },
  },
};
</script>
<style lang=""></style>
