<template>
  <div class="btn-group">
    <Button
      v-for="(item, i) in groupButtons"
      :key="i"
      :text="item.title"
      :class="{ active: activeIndex === i }"
      @click="activeIndex = activeIndex === i ? null : i"
      :btnClass="btnClass"
      :icon="item.icon"
      :iconPosition="item.iconPosition"
    />
  </div>
</template>
<script>
import Button from "./index";
export default {
  components: {
    Button,
  },
  props: {
    btnClass: {
      type: String,
      default: "btn-outline-primary",
    },
    groupButtons: {
      type: Array,
      default: () => [
        {
          title: "Weekly",
        },
        {
          title: "Monthly",
        },
        {
          title: "Yearly",
        },
      ],
    },
  },
  data() {
    return {
      activeIndex: 0,
    };
  },
};
</script>
<style lang="scss">
.btn-group {
  @apply flex items-start;
  > button {
    @apply rounded-none first:rounded-l-md last:rounded-r-md;
  }
  .btn-outline-primary,
  .btn-outline-secondary,
  .btn-outline-success,
  .btn-outline-info,
  .btn-outline-warning,
  .btn-outline-danger,
  .btn-outline-dark,
  .btn-outline-light {
    @apply border-r-0 last:border;
  }

  .btn-primary,
  .btn-secondary,
  .btn-success,
  .btn-info,
  .btn-warning,
  .btn-danger,
  .btn-dark,
  .btn-light {
    @apply border-r border-r-white border-opacity-10  last:border-r-0 hover:ring-0 hover:ring-offset-0 bg-opacity-90;
    &.active {
      @apply bg-opacity-100;
    }
  }
}
</style>
