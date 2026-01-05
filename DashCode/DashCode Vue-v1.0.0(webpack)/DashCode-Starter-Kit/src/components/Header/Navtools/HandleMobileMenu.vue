<template>
  <div
    class="cursor-pointer text-slate-900 dark:text-white text-2xl"
    @click="toggleMsidebar"
  >
    <Icon icon="heroicons-outline:menu-alt-3" />
  </div>
</template>
<script setup>
import Icon from "@/components/Icon";
import { useStore } from "vuex";
const store = useStore();

// dispath toggleMsidebar
const toggleMsidebar = () => {
  store.dispatch("toggleMsidebar");
};
</script>
<style lang="scss"></style>
