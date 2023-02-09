import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-toastify";

//o toast é uma biblioteca que faz os modal de informação, que aparecem do lado da tela

//objeto que vai fazer o controle dos state da quantidade de itens no carrinho, o preco total dos itens no carrinho, e um array com os itens.
const initialState = {
  cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

//meu slice que vai fazer a junção do "cart" com os satates e as funcoes de addToCart atraves de um reducer;
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //eu passo um state para a funcao e a minha ação é adiiconar ao state cartitem o product que eu passei
    addToCart(state, action) {
      //meu cartItems é um array, que cada item do array é um objeto, e esse objeto tem 2 propriedades, um objeto que é o produto e uma propriedade que e a quantidade dessse produto
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === action.payload._id
      );

      //aqui no caso, eu to pegando quantos itens tem o mesmo ID, se eu tenho por exemplo 3 itens com o mesmo ad, eu vou fazer a soma 3 vezes dessa quantidade de itens;
      //isso que esse if faz.

      //o primeiro if sempre vai cair no else, e vai adicionar o produto no carrinho com 1 item setado, a partir do segundo ele cai no if e ai é preciso apenas aumentar a quantidade do mesmo item.
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.info(`aumentado a quantidade de ${state.cartItems[itemIndex].name}`, {position:"bottom-left"})
      } else {
        //ao inves de passar apenas o produto que eu quero add no cart no cartItens, quero passar uma cartQuantity, que é a quantidade de um mesmo produto;
        //pq o cartTotalQuantity é a soma de todos os cartQuantity, pq o mesmo produto pode ter varias quantidades.
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
        toast.success(`adicionado ${action.payload.name} ao carrinho`, {position:"bottom-left"})
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart(state, action){
      const nextCartItem = state.cartItems.filter((cartItem) => (cartItem._id !== action.payload._id));

      state.cartItems = nextCartItem;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      //error ou sucesso ou info, isso são classes que define o tipo de alerta, é tipo as classes do buttons no bootstrap;
      toast.error(`${action.payload.name} Removido do carrinho`, {position:"bottom-left"})
    },

    decreaseCart(state, action){
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === action.payload._id
      );

      if(state.cartItems[itemIndex].cartQuantity > 1){
        state.cartItems[itemIndex].cartQuantity -= 1;
        toast.info(`quantidade de ${action.payload.name} decrementada com sucesso`, {position:"bottom-left"})
      }else if(state.cartItems[itemIndex].cartQuantity === 1){
        const nextCartItem = state.cartItems.filter((cartItem) => (cartItem._id !== action.payload._id));
        state.cartItems = nextCartItem;
        toast.error(`${action.payload.name} Removido do carrinho`, {position:"bottom-left"})
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    increaseCart(state, action){
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem._id === action.payload._id
      );

      if(state.cartItems[itemIndex].cartQuantity >= 1){
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.info(`quantidade de ${action.payload.name} incrementada com sucesso`, {position:"bottom-left"})
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart(state, action){
      state.cartItems = [];
      toast.error(`Carrinho Limpo`, {position:"bottom-left"});
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    getTotals(state, action){
      //cartTotal é o acumulador, ou seja em cada item que eu for percorrer eu vou ter ele disponivel pra mim, e a cada item que eu percorro(cartItem), eu vou adicionar o valor desse item
      //o valor desse item é o valor do item * quantidade, no final o meu acumulador vai ser um objeto com 2 propiedades, total e quantity. e vou retorna ele.
      let {total, quantity} = state.cartItems.reduce((cartTotal, cartItem) => {
        const {price, cartQuantity} = cartItem;
        const itemTotal = price * cartQuantity;

        cartTotal.total += itemTotal;
        cartTotal.quantity += cartQuantity;

        return cartTotal;
      }, {
        total: 0,
        quantity: 0
      });

      total = parseFloat(total.toFixed(2));
      state.cartTotalAmount = total;
      state.cartTotalQuantity = quantity;
    }
  },
});

//exportando a funcao
export const { addToCart, removeFromCart, decreaseCart, increaseCart, clearCart, getTotals} = cartSlice.actions;

export default cartSlice.reducer;
