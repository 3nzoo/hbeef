import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddCategoryAction extends PayloadAction<Category> {}

export type Category = {
  id: string;
  name: string;
};

export type CategoriesState = {
  categories: Category[];
};

const initialState: CategoriesState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<any>) => {
      state.categories.push(action.payload);
    },
    // removeCategory: (state, action: PayloadAction<string>) => {
    //   state.categories = stage.categories.filter(
    //     (category) => category.id !== action.payload
    //   );
    // },
  },
});

export default categorySlice.reducer;
export const { addCategory } = categorySlice.actions;
