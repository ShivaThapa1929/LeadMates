<template>
  <main class="app-wrapper">
    <Header :class="window.width > 1280 ? switchHeaderClass() : ''" />
    <!-- end header -->

    <Sidebar
      v-if="
        this.$store.state.menuLayout === 'vertical' &&
        this.$store.state.sidebarHidden === false &&
        window.width > 1280
      "
    />
    <!-- main sidebar end -->
    <Transition name="mobilemenu">
      <mobile-sidebar
        v-if="window.width < 1280 && this.$store.state.mobielSidebar"
      />
    </Transition>
    <Transition name="overlay-fade">
      <div
        v-if="window.width < 1280 && this.$store.state.mobielSidebar"
        class="overlay bg-slate-900 bg-opacity-70 backdrop-filter backdrop-blur-[3px] backdrop-brightness-10 fixed inset-0 z-[999]"
        @click="this.$store.state.mobielSidebar = false"
      ></div>
    </Transition>
    <!-- mobile sidebar -->
    <Settings />

    <div
      class="content-wrapper transition-all duration-150"
      :class="window.width > 1280 ? switchHeaderClass() : ''"
    >
      <div
        class="page-content"
        :class="this.$route.meta.appheight ? 'h-full' : 'page-min-height'"
      >
        <div
          :class="` transition-all duration-150 ${
            this.$store.state.cWidth === 'boxed'
              ? 'container mx-auto'
              : 'container-fluid'
          }`"
        >
          <Breadcrumbs v-if="!this.$route.meta.hide" />
          <router-view v-slot="{ Component }">
            <transition name="router-animation" mode="out-in" appear>
              <component :is="Component"></component>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
    <!-- end page content -->
    <FooterMenu v-if="window.width < 768" />
    <Footer
      :class="window.width > 1280 ? switchHeaderClass() : ''"
      v-if="window.width > 768"
    />
  </main>
</template>
<script>
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Settings from "../components/Settings";
import Sidebar from "../components/Sidebar/";
import window from "@/mixins/window";
import MobileSidebar from "@/components/Sidebar/MobileSidebar.vue";
import FooterMenu from "@/components/Footer/FooterMenu.vue";

export default {
  mixins: [window],
  components: {
    Header,
    Footer,
    Sidebar,
    Settings,
    Breadcrumbs,
    FooterMenu,
    MobileSidebar,
  },
  methods: {
    switchHeaderClass() {
      if (
        this.$store.state.menuLayout === "horizontal" ||
        this.$store.state.sidebarHidden
      ) {
        return "ml-0";
      } else if (this.$store.state.sidebarCollasp) {
        return "ml-[72px]";
      } else {
        return "ml-[248px]";
      }
    },
  },
};
</script>
<style lang="scss">
.router-animation-enter-active {
  animation: coming 0.2s;
  animation-delay: 0.1s;
  opacity: 0;
}
.router-animation-leave-active {
  animation: going 0.2s;
}

@keyframes going {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(0, 4%, 0) scale(0.93);
    opacity: 0;
  }
}
@keyframes coming {
  from {
    transform: translate3d(0, 4%, 0) scale(0.93);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}
@keyframes slideLeftTransition {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0px);
  }
}
.mobilemenu-enter-active {
  animation: slideLeftTransition 0.24s;
}

.mobilemenu-leave-active {
  animation: slideLeftTransition 0.24s reverse;
}

.page-content {
  @apply md:pt-6 md:pb-[37px] md:px-6 pt-[15px] px-[15px] pb-24;
}
.page-min-height {
  min-height: calc(var(--vh, 1vh) * 100 - 132px);
}
</style>
