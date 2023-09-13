import { createRouter, createWebHistory } from "vue-router";
import Home from "@route/Home.vue";

// don't rename `routes`
const routes = [
  { path: "/", name: "Home", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
//   // check user in here
//   const isUser = true;
//   if (requiresAuth && !isUser) {
//     next("/login");
//   } else {
//     next();
//   }
// });

export default router;
