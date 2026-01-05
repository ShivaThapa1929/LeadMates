<template>
  <div class="loginwrapper">
    <div class="lg-inner-column">
      <div class="right-column relative">
        <div
          class="inner-content h-full flex flex-col bg-white dark:bg-slate-800"
        >
          <div class="auth-box2 flex flex-col justify-center h-full">
            <div class="mobile-logo text-center mb-6 lg:hidden block">
              <router-link to="/"
                ><img
                  src="@/assets/images/logo/logo.svg"
                  alt=""
                  class="mx-auto"
              /></router-link>
            </div>
            <div class="text-center mb-10">
              <h4 class="font-medium mb-4">Lock Screen</h4>
              <div class="text-slate-500 dark:text-slate-400 text-base">
                Enter your password to unlock the screen!
              </div>
            </div>
            <div class="author-bio text-center mb-8">
              <div class="h-14 w-14 mx-auto rounded-full">
                <img
                  src="@/assets/images/all-img/user-big.png"
                  alt=""
                  class="w-full h-full object-cover block"
                />
              </div>
              <div
                class="text-slate-900 dark:text-white text-base font-medium mt-4"
              >
                Kathryn Murphy
              </div>
            </div>
            <Lockscreen />

            <div
              class="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm"
            >
              Not you ? return
              <router-link
                to="/"
                class="text-slate-900 dark:text-white ml-1 font-medium hover:underline"
              >
                Sign In
              </router-link>
            </div>
          </div>
          <div class="auth-footer text-center">
            Copyright 2021, Dashcode All Rights Reserved.
          </div>
        </div>
      </div>
      <div
        class="left-column bg-cover bg-no-repeat bg-center"
        :style="{
          backgroundImage:
            'url(' + require('@/assets/images/all-img/login-bg.png') + ')',
        }"
      >
        <div class="flex flex-col h-full justify-center">
          <div class="flex-1 flex flex-col justify-center items-center">
            <router-link to="/">
              <img
                src="@/assets/images/logo/logo-white.svg"
                alt=""
                class="mb-10"
              />
            </router-link>
          </div>
          <div>
            <div
              class="black-500-title max-w-[525px] mx-auto pb-20 text-center"
            >
              Unlock your Project
              <span class="text-white font-bold">performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Lockscreen from "./common/lockscreen";

export default {
  components: {
    Lockscreen,
  },
};
</script>
<style lang="scss"></style>
