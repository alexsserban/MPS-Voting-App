<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <router-link :to="pageContest">
              <button class="btn btn-primary my-4">{{ contest.name }}</button>
            </router-link>
            <div style="text-align:left">
              <p class="form-control-label">
                Description:
                <span class="db-elem">{{ contest.description }}</span>
              </p>
              <p class="form-control-label">
                Type:
                <span class="db-elem">{{ contest.type }}</span>
              </p>
              <p class="form-control-label">
                Benchmarks:
                <span
                  v-for="(benchmark, index) in contest.benchmarks"
                  :key="index"
                  class="db-elem"
                >
                  {{ benchmark
                  }}{{
                  index != contest.benchmarks.length - 1 ? ", " : ""
                  }}
                </span>
                <!-- {{contest.benchmarks[contest.benchmarks.length - 1]}} -->
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import { db } from "@/main";
import { mapGetters } from "vuex";

export default {
  name: "ContestPreview",

  props: {
    contest: {
      required: true,
      type: Object
    },

    id: {
      required: true,
      type: String
    }
  },

  computed: {
    ...mapGetters({
      user: "auth/authUser"
    }),

    almostAllBenchmarks() {
      return this.contest.benchmarks.slice(0, -1);
    },

    pageContest() {
      if (this.user && this.user.role == "judge") return { name: "Home" };
      return { name: "Contest", params: { id: this.id } };
    }
  }
};
</script>

<style scoped>
ul {
  text-align: left;
}

.db-elem {
  font-size: 16px;
  color: #5e72e4;
}
</style>
