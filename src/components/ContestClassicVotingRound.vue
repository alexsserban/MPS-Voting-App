<template>
  <div>
    <div>
      <button style="margin-left: .5rem" class="btn btn-primary">{{ firstPlayer.name }}</button>
      <label class="form-control-label">vs</label>
      <button
        style="margin: 0 .5rem 0 .5rem; "
        class="btn btn-primary my-4"
      >{{ secondPlayer.name == null ? '-' : secondPlayer.name}}</button>
    </div>
    <div v-if="!userAlreadyVoted">
      <label class="form-control-label">Select Benchmarks Ratings</label>
      <div v-for="(benchmark, benchmarkKey, benchmarkIndex) in benchmarks" :key="benchmarkIndex">
        <select v-model="firstPlayer.benchmarks[benchmark]">
          <option disabled value>Score</option>
          <option v-for="(rating, ratingIndex) in ratingsList" :key="ratingIndex">{{rating}}</option>
        </select>

        <button style="margin: 0 2rem 0 2rem; " class="btn btn-primary my-4">{{ benchmark }}</button>

        <select v-model="secondPlayer.benchmarks[benchmark]">
          <option disabled value>Score</option>
          <option v-for="(rating, ratingIndex) in ratingsList" :key="ratingIndex">{{rating}}</option>
        </select>
      </div>
      <button @click="send()" class="btn btn-primary my-4">Send Ratings</button>
    </div>
    <div v-else>You already submited your vote for this round !</div>
    <hr />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

import { db } from "@/main";

export default {
  props: {
    contestId: { required: true, type: String },
    stageId: { required: true, type: Number },
    roundId: { required: true, type: String }
  },

  data() {
    return {
      firstPlayer: {
        name: null,
        benchmarks: {}
      },

      secondPlayer: {
        name: null,
        benchmarks: {}
      },

      ratingsList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  },

  computed: {
    ...mapState({
      userId(state) {
        return state.auth.authId;
      },

      benchmarks(state) {
        return state.contests.items[this.contestId].benchmarks;
      },

      round(state) {
        return state.contests.items[this.contestId].stages[this.stageId][
          this.roundId
        ];
      },

      userAlreadyVoted() {
        return this.voters.includes(this.userId);
      }
    }),

    voters() {
      return this.round.stats.users;
    }
  },

  methods: {
    ...mapActions("contests", ["sendRoundRating"]),

    send() {
      this.sendRoundRating({
        contestId: this.contestId,
        stageId: this.stageId,
        roundId: this.roundId,
        firstPlayer: this.firstPlayer,
        secondPlayer: this.secondPlayer,
        benchmarks: this.benchmarks
      });
    }
  },

  created() {
    let updatedRound = { ...this.round };
    delete updatedRound.stats;

    let players = Object.keys(updatedRound);

    if (
      updatedRound[players[0]].score == "disqualified" &&
      updatedRound[players[1]].score == "disqualified"
    ) {
      return;
    }

    if (updatedRound[players[0]] == null) {
      this.firstPlayer.name = players[0];

      this.secondPlayer.name = "-";
    } else {
      this.firstPlayer.name = players[0];

      this.secondPlayer.name = players[1];
    }

    this.firstPlayer.benchmarks = updatedRound[players[0]];
    this.secondPlayer.benchmarks = updatedRound[players[1]];
  }
};
</script>

<style scoped>
</style>