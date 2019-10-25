<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="card bg-secondary shadow border-0">
          <div class="card-header bg-transparent pb-5">
            <div class="text-muted text-center mt-2 mb-4">
              <small>What do you wanna be?</small>
            </div>
            <div class="text-center">
              <form>
                <label class="radio-inline">
                  <input
                    class="custom-radio"
                    v-model="form.role"
                    value="judge"
                    type="radio"
                    name="type"
                  />Judge
                </label>
                <label class="radio-inline">
                  <input
                    class="custom-radio"
                    v-model="form.role"
                    value="organizer"
                    type="radio"
                    name="type"
                  />Organizer
                </label>
              </form>
            </div>
          </div>
          <div class="card-header bg-transparent pb-5">
            <div class="text-muted text-center mt-2 mb-4">
              <small>Sign up with</small>
            </div>
            <div class="text-center">
              <a @click="registerWithGoogle" class="btn btn-neutral btn-icon">
                <span class="btn-inner--icon">
                  <img src="../assets/google.svg" />
                </span>
                <span class="btn-inner--text">Google</span>
              </a>
            </div>
          </div>
          <div class="card-body px-lg-5 py-lg-5">
            <div class="text-center text-muted mb-4">
              <small>Or sign up with credentials</small>
            </div>
            <form @submit.prevent="register()">
              <div class="form-group">
                <div class="input-group input-group-alternative mb-3">
                  <input
                    v-model="form.name"
                    @blur="$v.form.name.$touch()"
                    class="form-control"
                    placeholder="Name"
                    type="text"
                  />
                </div>
                <template v-if="$v.form.name.$error">
                  <p v-if="!$v.form.name.required">This field is required.</p>
                </template>
              </div>
              <div class="form-group">
                <div class="input-group input-group-alternative mb-3">
                  <input
                    v-model.lazy="form.email"
                    @blur="$v.form.email.$touch()"
                    class="form-control"
                    placeholder="Email"
                    type="email"
                  />
                </div>
                <template v-if="$v.form.email.$error">
                  <p v-if="!$v.form.email.required" class="form-error">This field is required.</p>
                  <p
                    v-else-if="!$v.form.email.email"
                    class="form-error"
                  >This is not a valid email address.</p>
                </template>
              </div>
              <div class="form-group">
                <div class="input-group input-group-alternative mb-3">
                  <input
                    v-model="form.password"
                    @blur="$v.form.password.$touch()"
                    class="form-control"
                    placeholder="Password"
                    type="password"
                  />
                </div>
                <template v-if="$v.form.password.$error">
                  <p v-if="!$v.form.password.required" class="form-error">This field is required.</p>
                  <p
                    v-if="!$v.form.password.minLength"
                    class="form-error"
                  >The password should be atleast 6 characters long.</p>
                </template>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary mt-4">Create account</button>
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
import { required, email, minLength } from "vuelidate/lib/validators";
import { db } from "@/main";

export default {
  name: "PageRegister",

  mixins: [asyncDataStatus],

  data() {
    return {
      form: {
        name: null,
        email: null,
        password: null,
        role: "judge"
      }
    };
  },

  validations: {
    form: {
      name: {
        required
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },

  methods: {
    register() {
      this.$v.form.$touch();
      if (this.$v.form.$invalid) return;
      this.$store
        .dispatch("auth/registerUserWithEmailAndPassword", this.form)
        .then(() => {
          this.$router.push("/");
        });
    },

    registerWithGoogle() {
      this.$store.dispatch("auth/signInWithGoogle", this.form.role).then(() => {
        this.$router.push("/");
      });
    }
  },

  created() {
    this.asyncDataStatus_fetched();
  }
};
</script>

<style>
p {
  text-align: left;
}

.radio-inline {
  margin-right: 20px;
}

.custom-radio {
  margin-right: 5px;
}
</style>
