<template>
  <div class="row justify-content-center">
    <div class="col-lg-6 col-md-8">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <small>New Contest</small>
          <form @submit.prevent="create()" role="form">
            <div class="form-group mb-3">
              <div class="input-group input-group-alternative">
                <input
                  v-model="contest.name"
                  class="form-control"
                  placeholder="Contest Name"
                  type="text"
                />
              </div>
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary my-4">Create Contest</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      contest: {
        name: null
      }
    };
  },

  methods: {
    ...mapActions("contests", ["createContest"]),

    create() {
      this.createContest(this.contest).then(contest => {
        this.contest = { name: null };
      });
    }
  }
};
</script>

<style  scoped>
.form-group {
  margin-top: 10px;
}
</style>