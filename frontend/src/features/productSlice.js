import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setHeaders, url } from "./api";
import { toast } from "react-toastify";
import Product from "../Components/Details/Product/Product";

const initialState = {
  items: [],
  status: null,
  createStatus: null,
  deleteStatus: null,
  updateStatus: null
};

//axios fazendo a resuisinção da api, ele vai trazer os 3 itens que temos la;
//antes era localhost/products por causa que era um "api" falsa, agora temos localhost/api/products, que é onde realmente ta os nossos produtos
export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async () => {
    const response = await axios.get(`${url}/products`);
    return response?.data;
  }
);

//axios fazendo a resuisinção da api, ele vai enviar os valores que eu recebo dos input pra api, na api ele vai salvar no banco de dados.
export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(`${url}/products`, values, setHeaders());
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
    }
  }
);

//axios fazendo a resuisinção da api, aqui vamos atualizar o product
export const productsUpdate = createAsyncThunk(
  "products/productsUpdate",
  async (values) => {
    try {
      const response = await axios.put(`${url}/products/${values.product._id}`, values, setHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  }
);


//axios fazendo a resuisinção da api, aqui vamos remover o product
export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id) => {
    try {
      const response = await axios.delete(`${url}/products/${id}`, setHeaders());
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data);
    }
  }
);

//alguns casos da requisição, caso der certo eu atualizo o status pra success e atualizo o meu array de itens com oque eu recebi da requisição
//caso esteja em pending, eu atualizo o status para pending e não preciso att o array pq por padrao ele ja á []
//se for rejected ele att o staus e att o error com o error que veio da minha requisição atraves do try catch, no caso do error é o retorno do catch

/* podemos ver isso atraves da extensao react redux toolkit, onde temos ele sendo atualizado primeiro de null para pending e depois de pending para success, junto com os 3 produtos que vem da api */
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [productsFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [productsFetch.fulfilled]: (state, action) => {
      state.status = "success";
      state.items = action.payload;
    },
    [productsFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [productsCreate.pending]: (state, action) => {
      state.createStatus = "pending";
    },
    [productsCreate.fulfilled]: (state, action) => {
      state.createStatus = "success";
      state.items.push(action.payload);
      toast.success("Product Created!");
    },
    [productsCreate.rejected]: (state, action) => {
      state.createStatus = "rejected";
    },
    [productsDelete.pending]: (state, action) => {
      state.deleteStatus = "pending";
    },
    [productsDelete.fulfilled]: (state, action) => {
      
      const newList = state.items.filter((item) => item._id !== action.payload._id);
      state.items = newList;
      state.deleteStatus = "success";
      toast.error("Product Delete!");
    },
    [productsDelete.rejected]: (state, action) => {
      state.deleteStatus = "rejected";
    },
    [productsUpdate.pending]: (state, action) => {
      state.updateStatus = "pending";
    },
    [productsUpdate.fulfilled]: (state, action) => {
      
      const updateProducts = state.items.map((product) => 
        product._id === action.payload._id ? action.payload : product
      );

      state.items = updateProducts;

      state.updateStatus = "success";
      toast.info("Produto Atualizado!");
    },
    [productsUpdate.rejected]: (state, action) => {
      state.updateStatus = "rejected";
    },
  },
});

export default productSlice.reducer;
