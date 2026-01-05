<template>
  <div class="lg:flex flex-wrap blog-posts lg:space-x-5 space-y-5 lg:space-y-0">
    <div class="flex-none">
      <div class="lg:max-w-[360px]">
        <Card>
          <Sidebar />
        </Card>
      </div>
    </div>
    <div class="flex-1">
      <div class="grid grid-cols-1 gap-5">
        <Card :img="require('@/assets/images/all-img/post-1.png')">
          <div class="flex justify-between mb-4">
            <router-link :to="{ name: 'blog-details' }"
              ><span
                class="inline-flex leading-5 text-slate-500 dark:text-slate-500 text-sm font-normal"
                ><Icon
                  icon="heroicons-outline:calendar"
                  class="text-slate-400 dark:text-slate-500 mr-2 text-lg"
                />

                10/02/2021
              </span></router-link
            >
            <div class="flex space-x-4">
              <router-link to="#"
                ><span
                  class="inline-flex leading-5 text-slate-500 dark:text-slate-500 text-sm font-normal"
                  ><Icon
                    icon="heroicons-outline:chat"
                    class="text-slate-400 dark:text-slate-500 mr-2 text-lg"
                  />

                  3
                </span></router-link
              >
              <router-link to="#"
                ><span
                  class="inline-flex leading-5 text-slate-500 dark:text-slate-500 text-sm font-normal"
                  ><Icon
                    icon="heroicons-outline:share"
                    class="text-slate-400 dark:text-slate-500 mr-2 text-lg"
                  />

                  4
                </span></router-link
              >
            </div>
          </div>
          <h5 class="card-title text-slate-900">
            <router-link :to="{ name: 'blog-details' }">
              At Healthcare you will be treated by caring</router-link
            >
          </h5>
          <div
            class="card-text dark:text-slate-300 mt-4 space-y-4 leading-5 text-slate-600 text-sm border-b border-slate-100 dark:border-slate-700 pb-6"
          >
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip.Lorem ipsum dolor sit amet, consectetur adipiscing
              eli.
            </p>
            <p class="font-medium text-base">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum!
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididun ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ulla mco laboris nisi
              ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehende rit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididun ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ulla mco laboris nisi
              ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehende rit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididun ut labore et dolore magna aliqua. Ut enim
              ad minim veniam.
            </p>
          </div>
          <div class="mt-6">
            <ul class="flex items-center space-x-3">
              <li class="dark:text-slate-300">share:</li>
              <li>
                <a href="#"><img src="@/assets/images/svg/tw.svg" alt="" /></a>
              </li>
              <li>
                <a href="#"><img src="@/assets/images/svg/fb.svg" alt="" /></a>
              </li>
              <li>
                <a href="#"><img src="@/assets/images/svg/ln.svg" alt="" /></a>
              </li>
              <li>
                <a href="#"><img src="@/assets/images/svg/ins.svg" alt="" /></a>
              </li>
            </ul>
            <ul
              class="lg:flex items-center lg:space-x-3 mt-4 border-b border-slate-100 dark:border-slate-700 pb-6"
            >
              <li class="dark:text-slate-300">Popular tags:</li>
              <li v-for="(item, i) in tags" :key="i">
                <router-link
                  :to="item.link"
                  class="text-xs font-normal text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 py-1 px-3 rounded-full hover:bg-slate-900 hover:text-white transition duration-150"
                >
                  <span>{{ item.title }}</span>
                </router-link>
              </li>
            </ul>
            <ul class="comments mt-6 space-y-4">
              <li class="block">
                <div class="flex">
                  <div class="flex-none">
                    <div class="h-[56px] w-[56px] rounded-full mr-6">
                      <img
                        src="@/assets/images/post/c1.png"
                        alt=""
                        class="w-full block h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex flex-wrap justify-between mb-2">
                      <span
                        class="text-slate-600 text-base dark:text-slate-300 font-normal"
                        >Marvin McKinney
                      </span>

                      <span
                        class="text-sm text-slate-500 dark:text-slate-500 flex space-x-1 items-center"
                      >
                        <Icon icon="heroicons:clock" class="text-base" />
                        <span>Oct 09, 2021</span>
                      </span>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididun ut lab ore et dolore magna
                      aliqua.
                    </p>
                    <div class="mt-2">
                      <router-link
                        to="#"
                        class="flex space-x-2 items-center dark:text-slate-500 text-xs font-medium"
                      >
                        <span>Reply</span>
                        <Icon
                          icon="heroicons:arrow-right-20-solid"
                          class="text-lg"
                        />
                      </router-link>
                    </div>
                  </div>
                </div>
                <ul class="comments mt-4 pl-8">
                  <li class="block">
                    <div class="flex">
                      <div class="flex-none">
                        <div class="h-[56px] w-[56px] rounded-full mr-6">
                          <img
                            src="@/assets/images/post/c2.png"
                            alt=""
                            class="w-full block h-full object-contain rounded-full"
                          />
                        </div>
                      </div>
                      <div class="flex-1">
                        <div class="flex flex-wrap justify-between mb-2">
                          <span
                            class="text-slate-600 text-base dark:text-slate-300 font-normal"
                            >Marvin McKinney
                          </span>

                          <span
                            class="text-sm text-slate-500 dark:text-slate-500 flex space-x-1 items-center"
                          >
                            <Icon icon="heroicons:clock" class="text-base" />

                            <span>Oct 09, 2021</span>
                          </span>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididun ut lab ore et
                          dolore magna aliqua.
                        </p>
                        <div class="mt-2">
                          <router-link
                            to="#"
                            class="flex space-x-2 items-center dark:text-slate-500 text-xs font-medium"
                          >
                            <span>Reply</span>
                            <Icon
                              icon="heroicons:arrow-right-20-solid"
                              class="text-lg"
                            />
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
              <li class="block">
                <div class="flex">
                  <div class="flex-none">
                    <div class="h-[56px] w-[56px] rounded-full mr-6">
                      <img
                        src="@/assets/images/post/c3.png"
                        alt=""
                        class="w-full block h-full object-contain rounded-full"
                      />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex flex-wrap justify-between mb-2">
                      <span
                        class="text-slate-600 text-base dark:text-slate-300 font-normal"
                        >Marvin McKinney
                      </span>

                      <span
                        class="text-sm text-slate-500 dark:text-slate-500 flex space-x-1 items-center"
                      >
                        <Icon icon="heroicons:clock" class="text-base" />

                        <span>Oct 09, 2021</span>
                      </span>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididun ut lab ore et dolore magna
                      aliqua.
                    </p>
                    <div class="mt-2">
                      <router-link
                        to="#"
                        class="flex space-x-2 items-center dark:text-slate-500 text-xs font-medium"
                      >
                        <span>Reply</span>
                        <Icon
                          icon="heroicons:arrow-right-20-solid"
                          class="text-lg"
                        />
                      </router-link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div
              class="post-comments bg-slate-100 dark:bg-slate-900 p-6 rounded-md mt-6"
            >
              <h4
                class="text-lg font-medium text-slate-500 dark:text-slate-100 mb-4"
              >
                Leave a comment
              </h4>
              <form action="#">
                <div class="grid lg:grid-cols-2 grid-cols-1 gap-3">
                  <div class="lg:col-span-2">
                    <Textarea
                      label="Comment"
                      placeholder="writte your comment"
                    />
                  </div>
                  <Textinput
                    label="Full name"
                    placeholder="Full name"
                    type="text"
                  />
                  <Textinput
                    label="Email"
                    placeholder="Email Address"
                    type="email"
                  />
                </div>
                <div class="text-right">
                  <Button
                    text="Post comment"
                    type="submit"
                    btnClass=" btn-dark mt-3 "
                  />
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Textarea from "@/components/Textarea";
import Textinput from "@/components/Textinput";
import Sidebar from "./sidebar";

export default {
  components: {
    Card,
    Button,
    Icon,
    Sidebar,
    Textinput,
    Textarea,
  },
  data() {
    return {
      tags: [
        {
          title: "Business",
          link: "#",
        },
        {
          title: "Consulting",
          link: "#",
        },
        {
          title: "Photographic",
          link: "#",
        },
        {
          title: "Investment",
          link: "#",
        },
      ],
    };
  },
};
</script>
<style lang="scss">
.blog-posts {
  .image-box {
    @apply h-[248px];
  }
  .card {
    @apply h-auto;
  }
}
</style>
