<template>
  <!-- Page content -->
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="card bg-secondary shadow border-0">
          <div class="card-header bg-transparent pb-5">
            <div class="text-muted text-center mt-2 mb-3">
              <small>Sign in with</small>
            </div>
            <div class="btn-wrapper text-center">
              <a @click="signnInWithGoogle" class="btn btn-neutral btn-icon">
                <span class="btn-inner--icon">
                  <img src="../assets/google.svg" />
                </span>
                <span class="btn-inner--text">Google</span>
              </a>
            </div>
          </div>
          <div class="card-body px-lg-5 py-lg-5">
            <div class="text-center text-muted mb-4">
              <small>Or sign in with credentials</small>
            </div>
            <form @submit.prevent="signIn" role="form">
              <div class="form-group mb-3">
                <div class="input-group input-group-alternative">
                  <input v-model="form.email" class="form-control" placeholder="Email" type="email" />
                </div>
              </div>
              <div class="form-group">
                <div class="input-group input-group-alternative">
                  <input
                    v-model="form.password"
                    class="form-control"
                    placeholder="Password"
                    type="password"
                  />
                </div>
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-primary my-4">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "PageSignIn",

  mixins: [asyncDataStatus],

  data() {
    return {
      form: {
        email: null,
        password: null
      }
    };
  },

  methods: {
    signIn() {
      this.$store
        .dispatch("auth/signInWithEmailAndPassword", {
          email: this.form.email,
          password: this.form.password
        })
        .then(() => this.$router.push({ name: "Home" }));
    },

    signnInWithGoogle() {
      this.$store
        .dispatch("auth/signInWithGoogle")
        .then(() => this.$router.push({ name: "Home" }));
    }
  },

  created() {
    this.asyncDataStatus_fetched();
  }
};
</script>
