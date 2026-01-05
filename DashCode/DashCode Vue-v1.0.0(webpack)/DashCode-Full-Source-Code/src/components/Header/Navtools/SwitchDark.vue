<template>
  <span
    @click="toogleDark"
    class="lg:h-[32px] lg:w-[32px] lg:bg-gray-500-f7 lg:dark:bg-slate-900 dark:text-white text-slate-900 cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center"
  >
    <Icon icon="heroicons-outline:moon" v-if="!this.$store.state.isDark" />
    <Icon icon="heroicons-outline:sun" v-else-if="this.$store.state.isDark" />
  </span>
</template>
<script>
import Icon from "@/components/Icon";
export default {
  components: {
    Icon,
  },
  methods: {
    toogleDark() {
      this.$store.dispatch("toogleDark");
    },
  },
};
</script>
<style lang=""></style>
