<template>
  <router-link :to="{ name: 'home' }">
    <img
      src="@/assets/images/logo/logo-c.svg"
      alt=""
      v-if="!this.$store.state.isDark"
    />

    <img
      src="@/assets/images/logo/logo-c-white.svg"
      alt=""
      v-if="this.$store.state.isDark"
    />
  </router-link>
</template>
<script></script>
