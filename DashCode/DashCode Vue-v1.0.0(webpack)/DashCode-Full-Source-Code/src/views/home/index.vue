<template>
  <div>
    <Breadcrumb />
    <div class="grid grid-cols-12 gap-5 mb-5">
      <div class="2xl:col-span-3 lg:col-span-4 col-span-12">
        <div
          class="bg-no-repeat bg-cover bg-center p-4 rounded-[6px] relative"
          :style="{
            backgroundImage:
              'url(' + require(`@/assets/images/all-img/widget-bg-1.png`) + ')',
          }"
        >
          <div class="max-w-[169px]">
            <div class="text-xl font-medium text-slate-900 mb-2">
              Upgrade your Dashcode
            </div>
            <p class="text-sm text-slate-800">Pro plan for better results</p>
          </div>
          <div
            class="absolute top-1/2 -translate-y-1/2 right-6 mt-2 h-12 w-12 bg-white text-slate-900 rounded-full text-xs font-medium flex flex-col items-center justify-center"
          >
            Now
          </div>
        </div>
      </div>
      <div class="2xl:col-span-9 lg:col-span-8 col-span-12">
        <Card bodyClass="p-4">
          <div class="grid md:grid-cols-3 col-span-1 gap-4">
            <div
              class="py-[18px] px-4 rounded-[6px]"
              v-for="(item, i) in statistics"
              :class="item.bg"
              :key="i"
            >
              <div class="flex items-center space-x-6">
                <div class="flex-none">
                  <apexchart
                    type="area"
                    height="48"
                    width="48"
                    :options="item.name.chartOptions"
                    :series="item.name.series"
                  />
                </div>
                <div class="flex-1">
                  <div
                    class="text-slate-800 dark:text-slate-300 text-sm mb-1 font-medium"
                  >
                    {{ item.title }}
                  </div>
                  <div
                    class="text-slate-900 dark:text-white text-lg font-medium"
                  >
                    {{ item.count }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-5">
      <div class="lg:col-span-8 col-span-12">
        <Card>
          <div class="legend-ring">
            <apexchart
              type="bar"
              height="400"
              :options="
                this.$store.state.isDark
                  ? columnCharthomeDark.chartOptions
                  : columnCharthome.chartOptions
              "
              :series="columnCharthome.series"
            />
          </div>
        </Card>
      </div>
      <div class="lg:col-span-4 col-span-12">
        <Card title="overview">
          <template #header>
            <DropEvent />
          </template>
          <apexchart
            type="radialBar"
            :height="window.width > 768 ? 350 : 250"
            :options="
              this.$store.state.isDark
                ? MultipleRadialbarsDark.chartOptions
                : MultipleRadialbars.chartOptions
            "
            :series="MultipleRadialbars.series"
          />
        </Card>
      </div>
      <div class="lg:col-span-8 col-span-12">
        <Card title="All company" noborder>
          <template #header>
            <DropEvent />
          </template>
          <CompanyTable class="-mx-6 -mb-6" />
        </Card>
      </div>
      <div class="lg:col-span-4 col-span-12">
        <Card title="Recent activity">
          <template #header>
            <DropEvent />
          </template>
          <ul class="list-item space-y-3 h-full overflow-x-auto">
            <li
              class="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 pb-3 last:pb-0"
              v-for="(item, i) in activity"
              :key="i"
            >
              <div>
                <div class="w-8 h-8 rounded-[100%]">
                  <img
                    :src="item.img"
                    alt=""
                    class="w-full h-full rounded-[100%] object-cover"
                  />
                </div>
              </div>
              <div
                class="text-start overflow-hidden text-ellipsis whitespace-nowrap max-w-[63%]"
              >
                <div
                  class="text-sm text-slate-600 dark:text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  Finance KPI Mobile app launch preparion meeting.
                </div>
              </div>
              <div class="flex-1 text-right">
                <div
                  class="text-sm font-light text-slate-400 dark:text-slate-400"
                >
                  1 hours
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
      <div class="lg:col-span-8 col-span-12">
        <Card title="Most sales">
          <template #header>
            <div
              class="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded p-1 flex items-center"
            >
              <span
                class="flex-1 text-sm font-normal px-3 py-1 transition-all duration-150 rounded cursor-pointer"
                :class="
                  fillterMap === 'global'
                    ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-300'
                    : 'dark:text-slate-300'
                "
                @click="fillterMap = 'global'"
                >Global</span
              >
              <span
                class="flex-1 text-sm font-normal px-3 py-1 rounded transition-all duration-150 cursor-pointer"
                :class="
                  fillterMap === 'usa'
                    ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-slate-300'
                    : 'dark:text-slate-300'
                "
                @click="fillterMap = 'usa'"
                >USA</span
              >
            </div>
          </template>
          <div class="md:flex items-center">
            <div class="flex-none">
              <h4
                class="text-slate-600 dark:text-slate-200 text-sm font-normal mb-[6px]"
              >
                Total earnings
              </h4>
              <div
                class="tetx-lg font-medium mb-[6px] dark:text-white text-slate-900"
                v-if="fillterMap === 'usa'"
              >
                $12,65,64787.00
              </div>
              <div
                class="tetx-lg font-medium mb-[6px] dark:text-white text-slate-900"
                v-if="fillterMap === 'global'"
              >
                $12,65.00
              </div>
              <div class="text-xs font-light dark:text-slate-200">
                <span class="text-primary-500">+08%</span> From last month
              </div>
              <ul
                class="bg-slate-50 dark:bg-slate-900 rounded p-4 min-w-[184px] space-y-5 mt-4"
              >
                <li
                  v-for="(item, i) in mostSales"
                  :key="i"
                  class="flex justify-between text-xs text-slate-600 dark:text-slate-300"
                >
                  <span class="flex space-x-2 items-center">
                    <span
                      :class="item.cls"
                      class="inline-flex h-[6px] w-[6px] bg-primary-500 ring-opacity-25 rounded-full ring-4"
                    ></span>
                    <span>{{ item.title }}</span></span
                  >
                  <span>{{ item.amount }}</span>
                </li>
              </ul>
            </div>
            <div class="flex-1">
              <Map />
            </div>
          </div>
        </Card>
      </div>
      <div class="lg:col-span-4 col-span-12">
        <Card title="overview">
          <template #header>
            <SelectMonth />
          </template>
          <apexchart
            type="radialBar"
            height="300"
            :options="
              this.$store.state.isDark
                ? gearradilDark.chartOptions
                : gearradil.chartOptions
            "
            :series="gearradil.series"
          />
          <div
            class="bg-slate-50 dark:bg-slate-900 rounded p-4 mt-8 flex justify-between flex-wrap"
          >
            <div class="space-y-1">
              <h4
                class="text-slate-600 dark:text-slate-200 text-xs font-normal"
              >
                Invested amount
              </h4>
              <div class="tetx-sm font-medium text-slate-900 dark:text-white">
                $8264.35
              </div>
              <div
                class="text-slate-500 dark:text-slate-300 text-xs font-normal"
              >
                +0.001.23 (0.2%)
              </div>
            </div>
            <!-- !! end single -->
            <div class="space-y-1">
              <h4
                class="text-slate-600 dark:text-slate-200 text-xs font-normal"
              >
                Invested amount
              </h4>
              <div class="tetx-sm font-medium text-slate-900 dark:text-white">
                $8264.35
              </div>
            </div>
            <!-- !! end single -->
            <div class="space-y-1">
              <h4
                class="text-slate-600 dark:text-slate-200 text-xs font-normal"
              >
                Invested amount
              </h4>
              <div class="tetx-sm font-medium text-slate-900 dark:text-white">
                $8264.35
              </div>
            </div>
            <!-- !! end single -->
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
<script>
import Card from '@/components/Card';
import {
  gearradil,
  gearradilDark,
  MultipleRadialbars,
  MultipleRadialbarsDark,
} from '../../constant/appex-chart';
import CompanyTable from './Analytics-Component/CompanyTable';
import {
  columnCharthome,
  columnCharthomeDark,
  shapeLine1,
  shapeLine2,
  shapeLine3,
  mostSales,
} from './Analytics-Component/data';
import DropEvent from './Analytics-Component/DropEvent';
import Map from './Analytics-Component/Map';
import SelectMonth from './Analytics-Component/SelectMonth';
import Breadcrumb from './Analytics-Component/Breadcrumbs';
import window from '@/mixins/window';

export default {
  mixins: [window],
  components: {
    Card,
    CompanyTable,
    Map,
    DropEvent,
    SelectMonth,
    Breadcrumb,
  },
  data() {
    return {
      columnCharthome,
      columnCharthomeDark,
      MultipleRadialbars,
      MultipleRadialbarsDark,
      gearradil,
      gearradilDark,
      mostSales,
      fillterMap: 'usa',
      statistics: [
        {
          name: shapeLine1,
          title: 'Totel revenue',
          count: '3,564',
          bg: 'bg-[#E5F9FF] dark:bg-slate-900	',
        },
        {
          name: shapeLine2,
          title: 'Products sold',
          count: '564',
          bg: 'bg-[#FFEDE5] dark:bg-slate-900	',
        },
        {
          name: shapeLine3,
          title: 'Growth',
          count: '+5.0%',
          bg: 'bg-[#EAE5FF] dark:bg-slate-900	',
        },
      ],
      activity: [
        {
          id: 1,
          img: require('@/assets/images/users/user-1.jpg'),
        },
        {
          id: 2,
          img: require('@/assets/images/users/user-2.jpg'),
        },
        {
          id: 3,
          img: require('@/assets/images/users/user-3.jpg'),
        },
        {
          id: 4,
          img: require('@/assets/images/users/user-4.jpg'),
        },
        {
          id: 5,
          img: require('@/assets/images/users/user-5.jpg'),
        },
        {
          id: 6,
          img: require('@/assets/images/users/user-6.jpg'),
        },
        {
          id: 7,
          img: require('@/assets/images/users/user-1.jpg'),
        },
        {
          id: 6,
          img: require('@/assets/images/users/user-2.jpg'),
        },
        {
          id: 7,
          img: require('@/assets/images/users/user-2.jpg'),
        },
      ],
    };
  },
};
</script>
<style lang=""></style>
