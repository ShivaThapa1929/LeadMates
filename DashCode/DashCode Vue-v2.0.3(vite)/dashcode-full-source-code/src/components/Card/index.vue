<template>
  <div
 :class="
      cn('card rounded-md bg-white dark:bg-slate-800', props.class, {
        ' border border-gray-5002 dark:border-slate-700':
          this.$store.themeSettingsStore.skin === 'bordered',
        'shadow-base': this.$store.themeSettingsStore.skin !== 'bordered',
      })
    "
    v-if="!overlay"
  >
    <div :class="cn('card-body flex flex-col', bodyClass)">
      <header
        v-if="title || subtitle"
        :class="cn('flex mb-5 items-center', {
        'order-1': imgTop,
        'border-b border-slate-100 dark:border-slate-700 pb-5 -mx-6 px-6': !noborder
      })"
      >
        <div class="flex-1">
          <div
          v-if="title"
           :class="cn('card-title text-slate-900 dark:text-white', titleClass)"
          >
            {{ title }}
          </div>
          <div v-if="subtitle" :class="cn('card-subtitle', subtitleClass)">
            {{ subtitle }}
          </div>
        </div>
        <div class="flex-0" v-if="$slots.header">
          <slot name="header"></slot>
        </div>
      </header>
      <div
      v-if="img"
       :class="cn('image-box', {
        'order-0': imgTop,
        '-mx-6': gapNull,
        '-mt-6': gapNull && imgTop,
        '-mb-6': gapNull && imgBottom,
        'order-3 mt-6': imgBottom,
        'mb-6': !imgBottom
      })"
      >
        <img
          :src="img"
          alt=""
          :class="cn('block w-full h-full object-cover', imaClass)"
        />
      </div>
      <div :class="cn('card-text h-full', { 'order-2': imgTop })">
        <slot></slot>
      </div>
    </div>
  </div>
  <div
   :class="cn('rounded-md overlay bg-no-repeat bg-center bg-cover card', customClass)"
    v-if="overlay"
    :style="{
      backgroundImage: 'url(' + `${img}` + ')',
    }"
  >
    <div
     :class="cn('card-body h-full flex flex-col justify-center', bodyClass)"
    >
      <header class="mb-5">
        <div
        v-if="title"
         :class="cn('card-title text-slate-900 dark:text-white', titleClass)"
        >
          {{ title }}
        </div>
        <div v-if="subtitle" :class="cn('card-subtitle', subtitleClass)">
          {{ subtitle }}
        </div>
      </header>
      <div class="card-text h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import { cn } from "@/lib/utils";
const props = defineProps({
  class: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  titleClass: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  subtitleClass: {
    type: String,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
  imaClass: {
    type: String,
    default: "",
  },
  imgTop: {
    type: Boolean,
    default: false,
  },
  imgBottom: {
    type: Boolean,
    default: false,
  },
  gapNull: {
    type: Boolean,
    default: false,
  },
  overlay: {
    type: Boolean,
    default: false,
  },
  noborder: {
    type: Boolean,
    default: false,
  },
  bodyClass: {
    type: String,
    default: "p-6",
  },
    customClass: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.card-title {
  @apply font-medium  capitalize md:text-xl md:leading-[28px] text-lg leading-[24px];
}
.card-subtitle {
  @apply text-sm leading-5 font-medium text-slate-600 dark:text-slate-300 mt-1;
}
.overlay {
  @apply relative z-[1] after:absolute after:inset-0 after:w-full after:h-full after:bg-slate-900 after:bg-opacity-40 after:rounded-md after:z-[-1];
  .card-title,
  .card-subtitle {
    @apply text-white;
  }
}
</style>
