import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type cartState = {
  name: string;
  productId: string;
  quantity: number;
  price: number;
  img_Url: string;
};

const CART_KEY = 'cart';

const loadCartFromStorage = (): cartState[] => {
  const cartJson = localStorage.getItem(CART_KEY);

  return cartJson ? JSON.parse(cartJson) : [];
};

const saveCartToStorage = (cart: cartState[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        name: string;
        productId: string;
        quantity: number;
        price: number;
        img_Url: string;
      }>
    ) => {
      const { name, productId, quantity, price, img_Url } = action.payload;
      const existingItem = state.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.push({ name, productId, quantity, price, img_Url }); // replace 10 with the actual price
      }
      saveCartToStorage(state);
    },
    removeOneFromCart: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const { productId } = action.payload;
      const existingItem = state.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity -= 1;
        if (existingItem.quantity < 1) {
          const index = state.findIndex((item) => item.productId === productId);
          if (index !== -1) {
            state.splice(index, 1);
          }
        }
      }

      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.findIndex((item) => item.productId === productId);
      if (index !== -1) {
        state.splice(index, 1);
        saveCartToStorage(state);
      }
    },
    clearCart: (state) => {
      state.length = 0;
      saveCartToStorage(state);
    },
  },
});

export default cartSlice.reducer;
export const { removeOneFromCart, removeFromCart, clearCart, addToCart } =
  cartSlice.actions;
