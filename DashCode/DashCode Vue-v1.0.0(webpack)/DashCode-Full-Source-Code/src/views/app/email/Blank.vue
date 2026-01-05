<template>
  <div>
    <div
      v-if="
        (emails.length === 0 && this.$store.state.email.search !== '') ||
        emails.length === 0
      "
    >
      <Badge
        label="No Email Found"
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
    emails: {
      type: Array,
    },
  },
};
</script>
<style></style>
