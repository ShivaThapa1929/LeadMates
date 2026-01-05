<template>
  <li
    class="flex bg-white dark:bg-slate-700 items-center justify-center text-center lg:border border-slate-300 dark:border-slate-700 dark:border-b-slate-500 rounded-t lg:border-b-8 rounded-b-lg xl:px-10 xl:py-7 lg:px-3 lg:py-6 transition-all duration-150"
    :class="{
      ' border-b-slate-900 dark:border-b-slate-300 text-slate-900 dark:text-white ':
        stepNumber === steps.step,
      ' border-b-slate-300 dark:border-b-slate-500 text-slate-500 ':
        stepNumber < steps.step,
      ' border-b-green-500 dark:border-b-green-500  text-green-500 dark:text-green-500 ':
        stepNumber > steps.step,
    }"
  >
    <div class="flex flex-col items-center justify-center space-y-3">
      <Icon class="h-8 w-8" :icon="steps.icon" />
      <div class="text-base font-medium lg:block hidden">
        {{ steps.step }}. {{ steps.title }}
      </div>
    </div>
  </li>
</template>

<script setup>
import Icon from "@/components/Icon";

const props = defineProps({
  steps: Object,
  stepNumber: Number,
});
</script>

<style lang="scss" scoped></style>
