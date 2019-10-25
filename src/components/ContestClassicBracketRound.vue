<template>
  <div>
    <div>
      <label class="form-control-label">{{ score(firstPlayer) }}</label>
      <button
        style="margin-left: .5rem"
        class="btn btn-primary"
        v-bind:class="[isStarted ? firstPlayerWon ?  'win'  : isDisqualified(firstPlayer.name) ? 'disqualified' : 'lose' : '']"
      >{{ firstPlayer == 'undefined' ? '-' : firstPlayer.name}}</button>
      <label class="form-control-label">vs</label>
      <button
        style="margin: 0 .5rem 0 .5rem; "
        class="btn btn-primary my-4"
        v-bind:class="[isStarted ?  firstPlayerWon ?  isDisqualified(secondPlayer.name) ? 'disqualified' : 'lose' : 'win' : '']"
      >{{ secondPlayer == 'undefined' ? '-' : secondPlayer.name}}</button>
      <label class="form-control-label">{{ score(secondPlayer)}}</label>
    </div>
    <div>
      <div
        v-for="(benchmark, key, index) in benchmarks"
        :key="index"
      >{{`${key}: ${benchmark} - ${round[secondPlayer.name][key]}`}}</div>
      <br />
      <br />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    contestId: {
      required: true,
      type: String
    },

    stageId: {
      required: true,
      type: String
    },

    roundId: {
      required: true,
      type: String
    },
  },

  computed: {
    ...mapState({
      round(state) {
        return state.contests.items[this.contestId].stages[this.stageId][this.roundId];
      }
    }),

    isStarted() {
      if (
        this.firstPlayer.score == "disqualified" ||
        this.secondPlayer.score == "disqualified"
      )
        return true;
      return this.firstPlayer.score != 0 && this.secondPlayer.score != 0;
    },

    firstPlayerWon() {
      if (this.round[this.firstPlayer.name] == null) return true;
      if (this.round.stats.winner)
        return this.round.stats.winner == this.firstPlayer.name ? true : false;
      return false;
    },

    benchmarks() {
      let benchmarksList = { ...this.round[this.firstPlayer.name] };
      if (benchmarksList[Object.keys(benchmarksList)[0]] == null) return null;
      delete benchmarksList.score;

      return benchmarksList;
    },

    firstPlayer() {
      let updatedRound = { ...this.round };
      delete updatedRound.stats;

      let players = Object.keys(updatedRound);

      if (updatedRound[players[0]] == null)
        return {
          name: players[0],
          score: null
        };

      return {
        name: players[0],
        score: this.round[players[0]].score
      };
    },

    secondPlayer() {
      let updatedRound = { ...this.round };
      delete updatedRound.stats;

      let players = Object.keys(updatedRound);

      if (updatedRound[players[0]] == null)
        return {
          name: "-",
          score: null
        };

      return {
        name: players[1],
        score: this.round[players[1]].score
      };
    }
  },

  methods: {
    score(player) {
      return player.score == null ||
        player.score == 0 ||
        player.score == "disqualified" ||
        isNaN(player.score)
        ? ""
        : `${player.score}pct`;
    },

    isDisqualified(playerName) {
      if (this.round[playerName] && this.round[playerName].score)
        return this.round[playerName].score == "disqualified";

      return false;
    }
  }
};
</script>

<style scoped>
.win {
  background-color: green !important;
}

.lose {
  background-color: red !important;
}

.disqualified {
  background-color: gray !important;
}
</style>