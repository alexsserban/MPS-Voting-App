<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <router-link :to="{name: 'Contest', params: {id}}">
              <button class="btn btn-primary my-4">{{ contest.name }}</button>
            </router-link>
            <div style="text-align:left">
              <p class="form-control-label">
                Description:
                <span class="db-elem">{{contest.description}}</span>
              </p>
              <p class="form-control-label">
                Type:
                <span class="db-elem">{{contest.type}}</span>
              </p>
              <p class="form-control-label">
                Benchmarks:
                <span
                  v-for="(benchmark,index) in contest.benchmarks"
                  :key="index"
                  class="db-elem"
                >{{ benchmark }}{{ (index != contest.benchmarks.length - 1) ? ', ' : ''}}</span>
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
    almostAllBenchmarks() {
      return this.contest.benchmarks.slice(0, -1);
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