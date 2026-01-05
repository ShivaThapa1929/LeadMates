<template>
  <div>
    <div
      class="col-span-12 text-slate-600 dark:text-slate-300 text-base mb-3 mt-6"
    >
      Navbar Type
    </div>
    <div class="grid md:grid-cols-4 grid-cols-1 gap-3">
      <div v-for="(item, i) in navbarTypes" :key="i">
        <label
          :for="`navbar_type${i}`"
          class="text-slate-500 dark:text-slate-400 text-sm cursor-pointer flex items-center"
        >
          <input
            class="hidden"
            type="radio"
            name="navType"
            :id="`navbar_type${i}`"
            :value="item.value"
            v-model="navType"
          />
          <span
            :class="item.value === navType ? 'shadow-inset-4' : ''"
            class="flex-none h-4 w-4 bg-white dark:bg-transparent rounded-full border border-secondary-500 inline-block mr-3 transition-all duration-150"
          ></span>
          {{ item.label }}
        </label>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  // watch skins

  data() {
    return {
      navType: this.$store.state.navbarType,
      navbarTypes: [
        {
          value: "floating",
          label: "Floating",
        },
        {
          value: "sticky",
          label: "Sticky",
        },
        {
          value: "static",
          label: "Static",
        },
        {
          value: "hidden",
          label: "Hidden",
        },
      ],
    };
  },

  mounted() {
    this.$store.watch(
      (state) => state.navbarType,
      (newVal) => {
        this.navType = newVal;
      }
    );
  },

  watch: {
    navType: {
      handler() {
        this.$store.state.navbarType = this.navType;
      },
      immediate: true,
    },
  },
};
</script>
<style lang="css"></style>
