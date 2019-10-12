<template>
  <div id="app">
    <div id="nav">
      <TheNavBar v-show="showPage" />
    </div>
    <router-view :key="$route.path" v-show="showPage" @ready="showPage = true" />
    <AppSpinner v-show="!showPage" />
  </div>
</template>

<script>
import AppSpinner from "@/components/AppSpinner";
import TheNavBar from "@/components/TheNavBar";

export default {
  components: {
    AppSpinner,
    TheNavBar
  },

  data() {
    return {
      showPage: false
    };
  },

  created() {
    this.$router.beforeEach((to, from, next) => {
      if (to.name != from.name) this.showPage = false;

      next();
    });
  },

  name: "app"
};
</script>

<style>
@import "assets/argon-dashboard.css?v=1.1.0";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
