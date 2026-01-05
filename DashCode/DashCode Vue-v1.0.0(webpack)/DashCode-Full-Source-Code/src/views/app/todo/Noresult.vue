<template>
  <div>
    <div
      v-if="
        (todos.length === 0 && this.$store.state.apptodo.todoSearch !== '') ||
        todos.length === 0
      "
    >
      <Badge
        label="No Result Found"
        badgeClass="bg-danger-500 text-white w-full block text-center mt-10 "
      />
    </div>
  </div>
</template>
<script>
import Badge from "@/components/Badge";
export default {
  components: {
    Badge,
  },
  props: {
    todos: {
      type: Array,
    },
  },
};
</script>
<style lang=""></style>
