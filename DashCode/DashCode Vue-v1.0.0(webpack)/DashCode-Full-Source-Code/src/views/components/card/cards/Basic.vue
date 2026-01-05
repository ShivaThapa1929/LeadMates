<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
    <Card
      title="Card title"
      subtitle="This is a subtitle"
      :img="require('@/assets/images/all-img/card-1.png')"
      imaClass="rounded-md"
      noborder
    >
      Lorem ipsum dolor sit amet, consec tetur adipiscing elit, sed do eiusmod
      tempor incididun ut .
      <div class="mt-4 space-x-4">
        <router-link to="#" class="btn-link">Learn more</router-link>
        <router-link to="#" class="btn-link">Another link</router-link>
      </div>
    </Card>
    <Card
      title="Card title"
      subtitle="This is a subtitle"
      :img="require('@/assets/images/all-img/card-2.png')"
      imaClass="rounded-t-md"
      imgTop
      gapNull
      noborder
    >
      Lorem ipsum dolor sit amet, consec tetur adipiscing elit, sed do eiusmod
      tempor incididun ut .
      <div class="mt-4 space-x-4">
        <router-link to="#" class="btn-link">Learn more</router-link>
        <router-link to="#" class="btn-link">Another link</router-link>
      </div>
    </Card>
    <Card
      title="Card title"
      :img="require('@/assets/images/all-img/card-3.png')"
      imaClass="rounded-md"
      overlay
      titleClass="2xl:pb-14"
      noborder
    >
      <div class="text-white mt-[50px]">
        <div class="text-white text-sm mb-2">This is a subtitle</div>
        Lorem ipsum dolor sit amet, consec tetur adipiscing elit, sed do eiusmod
        tempor incididun ut .
      </div>
      <div class="mt-[71px]">
        <Button
          text="Learn more"
          link="#"
          btnClass="btn bg-white text-slate-800"
        />
      </div>
    </Card>
  </div>
</template>
<script>
import Card from '@/components/Card';
import Button from '@/components/Button';
export default {
  components: {
    Card,
    Button,
  },
};
</script>
<style lang="scss"></style>
