import { defineStore } from "pinia";

export const cartStore = defineStore("cart", {
  state: () => ({
    items: [],
    totalPrice: 0,
  }),
  actions: {
    addToCart(product) {
      const itemFound = this.items.find((item) => item.id === product.id);

      if (itemFound) {
        itemFound.quantity += 1;
        // this.totalPrice += itemFound.price;
      } else {
        this.items.push({ ...product, quantity: 1 });
        // this.totalPrice += product.price;
      }

      this.getTotalPrice();
    },

    removeFromCart(item) {
      let itemFound = this.items.find((i) => item.id == i.id);
      if (itemFound) {
        this.items = this.items.filter((i) => item.id !== i.id);
      }

      this.getTotalPrice();
    },
    removeAllFromCart() {
      this.items = [];
      this.totalPrice = 0;
    },

    getTotalPrice() {
      this.totalPrice = 0;
      this.items.map((product) => {
        let quantity = parseInt(product.quantity);
        let pricePerUnit = parseInt(product.price);
        this.totalPrice += pricePerUnit * quantity;
      });
    },
  },
  getters: {
    getItems() {
      return this.items;
    },
  },
});
