<template>
  <div>
    <router-link to="/">Home</router-link>&nbsp;|
    <span v-if="!user">
      <router-link to="/signin">Login</router-link>&nbsp;|
      <router-link to="/register">Register</router-link>
    </span>
    <span v-else>
      <router-link to="/logout">SignOut</router-link>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      user: "auth/authUser"
    })
  }
};
</script>

<style scoped>
</style>