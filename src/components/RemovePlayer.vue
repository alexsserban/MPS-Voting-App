<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <label class="form-control-label">Disqualify Players from current Stage:</label>
            <ul v-for="(round, roundKey, roundIndex) in rounds" :key="roundIndex">
              <li
                style="text-align:left"
                v-for="(player, playerKey, playerIndex) in updatedRound(round)"
                :key="playerIndex"
              >
                {{playerKey }}
                <span class="btn-inner--icon">
                  <img
                    @click.prevent="removePlayer(playerKey, roundKey, round)"
                    width="12px"
                    src="../assets/cancel-icon.png"
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  props: {
    contestId: {
      required: true,
      type: String
    },

    stageId: {
      required: true,
      type: Number
    }
  },

  computed: {
    ...mapState({
      contest(state) {
        return state.contests.items[this.contestId];
      }
    }),

    rounds() {
      return this.contest.stages[this.stageId];
    }
  },

  methods: {
    ...mapActions("contests", ["disqualifyPlayer"]),

    updatedRound(round) {
      let newRound = { ...round };
      for (let [key, value] of Object.entries(newRound)) {
        if (key == "stats") delete newRound[key];
        if (value == null) return null;
      }

      const keys = Object.keys(newRound);
      if (
        newRound[keys[0]].score == "disqualified" ||
        newRound[keys[1]].score == "disqualified"
      )
        return null;
      return newRound;
    },

    removePlayer(playerName, roundId, round) {
      let opponentName = null;
      for (let [key, value] of Object.entries(this.updatedRound(round))) {
        if (key != playerName) opponentName = key;
      }

      this.disqualifyPlayer({
        playerName,
        opponentName,
        roundId,
        stageId: this.stageId,
        contestId: this.contestId
      });
    }
  }
};
</script>

<style scoped>
</style>