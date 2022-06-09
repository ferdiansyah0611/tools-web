import { createRouter, createWebHistory } from "vue-router";
// dont remove [1]
import Home from "@route/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  // dont remove [2]
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth);
  // check user in here
  const isUser = true;
  if (requiresAuth && !isUser) {
    next("/login");
  } else {
    next();
  }
});

export default router;
