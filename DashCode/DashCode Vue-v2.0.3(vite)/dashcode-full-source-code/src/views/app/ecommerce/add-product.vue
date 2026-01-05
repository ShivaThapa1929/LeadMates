<template>
  <form class="grid grid-cols-12 gap-4 rounded-lg max-h-max">
    <div class="col-span-12 md:col-span-7 lg:col-span-7 space-y-4">
      <Card title="Product Information">
        <div class="space-y-4">
          <Textinput
            label="Product Name"
            id="h_Fullname"
            type="text"
            placeholder="Full name"
            horizontal
            classLabel="!w-[150px]"
          />

          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 md:w-[100px] !w-[150px] break-words ltr:inline-block rtl:block input-label"
            >
              Category
            </p>
            <div class="flex-1 w-full">
              <Select :options="options" classLabel="!w-[150px]" />
            </div>
          </div>

          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 md:w-[100px] !w-[150px] break-words ltr:inline-block rtl:block input-label"
            >
              Brand
            </p>
            <div class="flex-1 w-full">
              <Select :options="options" classLabel="!w-[150px]" />
            </div>
          </div>
          <Textinput
            label="Unit"
            id="unit"
            type="text"
            placeholder="Unit (e.g. KG, Pc etc)"
            horizontal
            classLabel="!w-[150px]"
          />
          <Textinput
            label="Weight (in kg)"
            id="weight"
            type="text"
            placeholder="0.00"
            horizontal
            classLabel="!w-[150px]"
          />
          <Textinput
            label="Minimum Purchase Qty"
            id="weight"
            type="text"
            placeholder="1"
            horizontal
            classLabel="!w-[150px]"
          />
          <Textinput
            label="Tags"
            id="weight"
            type="text"
            placeholder="Type & hit enter to add a tag"
            horizontal
            classLabel="!w-[150px]"
          />
          <Textinput
            label="Barcode"
            id="weight"
            type="text"
            placeholder="Code"
            horizontal
            classLabel="!w-[150px]"
          />
          <div class="flex space-x-10 rtl:space-x-reverse">
            <label class="flex-none dark:text-slate-300 w-[132px]"
              >Refundable</label
            >
            <div class="flex-1">
              <Switch active />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Product Images">
        <div class="space-y-4">
          <div class="flex items-center space-x-6 rtl:space-x-reverse">
            <label class="inline-flex text-sm dark:text-slate-300 font-normal">
              Gallery Images (600 X 600)
            </label>
            <div class="flex-1">
              <Fileinput
                label="Browse"
                placeholder="Choose File"
                name="pdf"
                selectedFile="selectedFile"
              />
            </div>
          </div>
          <div class="flex items-center space-x-6 rtl:space-x-reverse">
            <label class="inline-flex text-sm dark:text-slate-300 font-normal">
              Thumb Images (600 X 600)
            </label>
            <div class="flex-1">
              <Fileinput
                label="Browse"
                placeholder="Choose File"
                name="pdf"
                selectedFile="selectedFile"
              />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Product Variation">
        <div class="space-y-4">
          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 !w-[150px] md:w-[100px] break-words ltr:inline-block rtl:block input-label"
            >
              Color
            </p>
            <div class="flex-1 w-full">
              <Select
                placeholder="2 items selected"
                :options="options"
                classLabel="!w-[150px]"
              />
            </div>
          </div>
          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 !w-[150px] md:w-[100px] break-words ltr:inline-block rtl:block input-label"
            >
              Attributes
            </p>
            <div class="flex-1 w-full">
              <Select
                placeholder="1 item selected"
                :options="options"
                classLabel="!w-[150px]"
              />
            </div>
          </div>
          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 !w-[150px] md:w-[100px] break-words ltr:inline-block rtl:block input-label"
            >
              Size
            </p>
            <div class="flex-1 w-full">
              <Select
                placeholder="5 items selected"
                :options="options"
                classLabel="!w-[150px]"
              />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Product Description">
        <div class="space-y-4">
          <Textarea
            label="Description"
            id="pn4"
            placeholder="Some product description..."
            horizontal
            classLabel="!w-[150px]"
          />
        </div>
      </Card>
      <Card title="PDF Specification">
        <div class="space-y-4">
          <div class="flex items-center space-x-6 rtl:space-x-reverse">
            <label
              class="inline-flex text-sm !w-[150px] font-normal dark:text-slate-300"
            >
              Add PDF File
            </label>
            <div class="flex-1">
              <Fileinput
                label="Browse"
                placeholder="Choose File"
                name="pdf"
                selectedFile="selectedFile"
              />
            </div>
          </div>
        </div>
      </Card>
      <Card title="SEO Meta Tags">
        <div class="space-y-4">
          <Textinput
            label="Meta Title"
            id="meta_title"
            type="text"
            placeholder="Title"
            horizontal
            classLabel="!w-[150px]"
          />
          <Textarea
            label="Description"
            id="pn4"
            placeholder="Write something for your product seo"
            horizontal
            classLabel="!w-[150px]"
          />
          <div class="flex items-center space-x-11 rtl:space-x-reverse">
            <label
              class="inline-flex text-sm font-normal dark:text-slate-300 w-[130px]"
            >
              Meta Image
            </label>
            <div class="flex-1">
              <Fileinput
                label="Browse"
                placeholder="Choose File"
                name="pdf"
                selectedFile="selectedFile"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="col-span-12 md:col-span-5 lg:col-span-5 space-y-4">
      <Card title="Shipping Configuration">
        <div class="space-y-4">
          <div class="flex justify-between">
            <label class="dark:text-slate-300">Free Shipping</label>
            <div>
              <Switch active />
            </div>
          </div>
          <div class="flex justify-between">
            <label class="dark:text-slate-300">Flat Rate</label>
            <div>
              <Switch active />
            </div>
          </div>
          <div class="flex justify-between">
            <label class="dark:text-slate-300"
              >Is Product Quantity Multiply</label
            >
            <div>
              <Switch active />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Low Stock Quantity Warning">
        <div class="space-y-4">
          <Textinput
            label="Quantity"
            id="qty_warning"
            type="text"
            placeholder="1"
            horizontal
            classLabel="!w-[150px]"
          />
        </div>
      </Card>
      <Card title="Stock Visibility State">
        <div class="space-y-4">
          <div class="flex justify-between">
            <label class="text-sm dark:text-slate-300 font-normal"
              >Show Stock Quantity</label
            >
            <div>
              <Switch active />
            </div>
          </div>
          <div class="flex justify-between">
            <label class="text-sm dark:text-slate-300 font-normal">
              Show Stock With Text Only
            </label>
            <div>
              <Switch active />
            </div>
          </div>
          <div class="flex justify-between">
            <label class="text-sm dark:text-slate-300 font-normal"
              >Hide Stock</label
            >
            <div>
              <Switch active />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Cash On Delivery">
        <div class="space-y-4">
          <div class="flex justify-between">
            <label class="text-sm dark:text-slate-300 font-normal"
              >Status</label
            >
            <div>
              <Switch active />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Featured">
        <div class="space-y-4">
          <div class="flex justify-between">
            <label class="text-sm dark:text-slate-300 font-normal"
              >Status</label
            >
            <div>
              <Switch active />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Todays Deal">
        <div class="space-y-4">
          <div class="flex justify-between">
            <label class="text-sm dark:text-slate-300 font-normal"
              >Status</label
            >
            <div>
              <Switch active />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Flash Deal">
        <div class="space-y-4">
          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 md:w-[100px] break-words ltr:inline-block rtl:block input-label"
            >
              Category
            </p>
            <div class="flex-1 w-full">
              <Select
                placeholder="Choose Flash Title"
                :options="options"
                classLabel="!w-[150px]"
              />
            </div>
          </div>

          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 md:w-[100px] break-words ltr:inline-block rtl:block input-label"
            >
              Discount
            </p>
            <div class="flex-1 w-full">
              <Textinput
                id="discount"
                type="text"
                placeholder="0"
                classLabel="!w-[150px]"
              />
            </div>
          </div>
          <div class="flex">
            <p
              class="flex-none flex-0 mr-6 md:w-[100px] break-words ltr:inline-block rtl:block input-label"
            >
              Type
            </p>
            <div class="flex-1 w-full">
              <Select
                placeholder="Choose Discount Type"
                :options="options"
                classLabel="!w-[150px]"
              />
            </div>
          </div>
        </div>
      </Card>
      <Card title="Estimate Shipping Time">
        <div class="space-y-4">
          <Textinput
            label="Shipping Days"
            id="shipping_days"
            type="text"
            placeholder="07"
            horizontal
          />
        </div>
      </Card>
      <Card title="Estimate Shipping Time">
        <div class="space-y-4">
          <div class="flex space-x-4 rtl:space-x-reverse">
            <div class="flex-none">
              <Textinput
                class="inline-flex"
                label="VAT"
                id="vat"
                type="text"
                placeholder="00"
                horizontal
              />
            </div>
            <div class="flex-1">
              <Select placeholder="Flat" :options="options" />
            </div>
          </div>
          <div class="flex space-x-4 rtl:space-x-reverse">
            <div class="flex-none">
              <Textinput
                label="TAX"
                id="tax"
                type="text"
                placeholder="00"
                horizontal
              />
            </div>
            <div class="flex-1">
              <Select placeholder="Percent" :options="options" />
            </div>
          </div>
        </div>
      </Card>
    </div>
    <div class="col-span-12 flex justify-end">
      <button
        type="button"
        class="btn btn-dark dark:bg-slate-800 h-min w-max text-sm font-normal"
      >
        Save Product
      </button>
    </div>
  </form>
</template>
<script setup>
import Textinput from "@/components/Textinput";
import Fileinput from "@/components/Fileinput";
import Textarea from "@/components/Textarea";
import Switch from "@/components/Switch";
import Select from "@/components/Select";
import Card from "@/components/Card";

import { ref } from "vue";

const selected = ref(null);

const options = [
  {
    value: "option1",
    label: "Option 1",
  },
  {
    value: "option2",
    label: "Option 2",
  },
  {
    value: "option3",
    label: "Option 3",
  },
];
</script>
<style lang="scss"></style>
