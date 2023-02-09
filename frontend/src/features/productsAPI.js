import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


//endpoint para pegar os itens, aqui no caso o endpoint e getAllProducts, e ele vai trazer tudo de http://localhost:5000/products
export const productsAPI = createApi({
  reducerPath: "productsAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({ 
        query: () => "products" 
    }),
  }),
});

export const {useGetAllProductsQuery} = productsAPI;