<template>
  <div class="row justify-content-center">
    <div class="col-lg-6 col-md-8">
      <div class="card bg-secondary shadow border-0">
        <div class="card-body px-lg-5 py-lg-5">
          <small>New Contest </small>
          <form>
            <div class="form-group mb">
              <div class="input-group input-group-alternative mb-3">
                <input
                  v-model="contest.name"
                  class="form-control"
                  placeholder="Contest Name"
                  type="text"
                />
              </div>
              <div class="input-group input-group-alternative mb-3">
                <input
                  v-model="contest.description"
                  class="form-control"
                  placeholder="Contest Description"
                  type="text"
                />
              </div>
              <div style="text-align:left">
                <label class="form-control-label" style="margin-right: 70px">Contest Type</label>
                <label class="radio-inline">
                  <input
                    class="custom-radio"
                    v-model="contest.type"
                    value="Classic"
                    type="radio"
                    name="type"
                  />Classic
                </label>
                <label class="radio-inline">
                  <!-- Modificat, Nicu-->
                  <input
                    class="custom-radio"
                    v-model="contest.type"
                    value="Groups"
                    type="radio"
                    name="type"
                  />Free Battle
                </label>
              </div>
            </div>
            <div class="row" style="margin-bottom: 20px;">
              <div class="col-lg-6" style="text-align: left;">
                <label class="form-control-label">Add New Benchmark</label>
                <input
                  type="text"
                  class="form-control form-control-alternative"
                  placeholder="ex: Pace"
                  v-model="newBenchmark"
                  @keypress.enter.prevent="addBenchMark()"
                />
              </div>
              <div class="col-lg-6">
                <label class="form-control-label">Benchmarks</label>
                <p
                  class="form-control-label"
                  style="margin-top:10px"
                  v-if="!contest.benchmarks.length"
                >No benchmarks!</p>
                <ul>
                  <li
                    style="text-align:left"
                    v-for="(benchmark,index) in contest.benchmarks"
                    :key="index"
                  >
                    {{ benchmark }}
                    <span class="btn-inner--icon">
                      <img
                        @click.prevent="contest.benchmarks.splice(index,1);"
                        width="12px"
                        src="../assets/cancel-icon.png"
                      />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6" style="text-align: left;">
                <label class="form-control-label">Add New Player (in seed order)</label>
                <input
                  type="text"
                  class="form-control form-control-alternative"
                  placeholder="ex: Alex"
                  v-model="newPlayer"
                  @keypress.enter.prevent="addPlayer()"
                />

                <button
                  style="float:left"
                  @click.prevent="create()"
                  class="btn btn-primary my-4"
                >Create Contest</button>
              </div>
              <div class="col-lg-6">
                <label class="form-control-label">Players</label>
                <p
                  class="form-control-label"
                  style="margin-top:10px"
                  v-if="!players.length"
                >No players!</p>
                <ul>
                  <li style="text-align:left" v-for="(player,index) in players" :key="index">
                    {{ player }}
                    <span class="btn-inner--icon">
                      <img
                        @click.prevent="players.splice(index,1);"
                        width="12px"
                        src="../assets/cancel-icon.png"
                      />
                    </span>
                  </li>
                </ul>
              </div>
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
        name: null,
        description: null,
        type: "Classic",
        benchmarks: []
      },
      newBenchmark: null,
      players: [],
      newPlayer: null
    };
  },

  methods: {
    ...mapActions("contests", ["createContest"]),

    addBenchMark() {
      this.contest.benchmarks.push(this.newBenchmark);
      this.newBenchmark = "";
    },

    addPlayer() {
      this.players.push(this.newPlayer);
      this.newPlayer = null;
    },

    create() {
      this.createContest({ contest: this.contest, players: this.players }).then(
        contest => {
          this.contest = {
            name: null,
            description: null,
            type: "Clasic",
            benchmarks: []
          };
          this.newBenchmark = null;
          this.players = [];
          this.newPlayer = null;
        }
      );
    }
  }
};
</script>

<style  scoped>
.form-group {
  margin-top: 10px;
}

.custom-radio {
  margin-right: 5px;
}
</style>