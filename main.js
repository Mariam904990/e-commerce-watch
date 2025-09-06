import RegisterForm from "./js/register.js";
import LoginForm from "./js/login.js";
import {
  Loader,
  Sidebar,
  ScrollTop,
  CategoryFilter,
  CountdownModule,
  QuoteSlider,
} from "./js/ui.js";
import { Slider } from "./js/slider.js";
import UserMenu from "./js/userMenu.js";
import ShopPage from "./js/product.js";
// import Cart from "./js/cart.js";
import { CartSidebar } from "./js/cart-sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
  Loader.init();
  Sidebar.init();
  RegisterForm.init();
  LoginForm.init();
  UserMenu.init();
  Slider.init(".slider", 4000);
  CategoryFilter.init();
  CountdownModule.init(100);
  QuoteSlider.init();
  CartSidebar.init();
  // Cart.init();
  ShopPage.init();
  ScrollTop.init();
});
