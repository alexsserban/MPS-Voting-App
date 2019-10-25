<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <label
              v-if="availableRoundsToVote"
              class="form-control-label"
              style="margin-right: 70px"
            >No available Rounds to Rate</label>
            <div v-if="!isOrganizer">
              <ContestClassicVotingRound
                v-for="(round, roundId, roundIndex) in filteredStage"
                :key="roundIndex"
                :contestId="contestId"
                :stageId="stageId"
                :roundId="roundId"
              />
            </div>
            <div v-else-if="!availableRoundsToVote">
              <label class="form-control-label">Judges are voting!</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="isOrganizer && isStarted"
      style="margin: 0 2rem 0 2rem; "
      class="btn btn-primary my-4"
      @click="finishVotingRound()"
    >Finish This Stage</button>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import ContestClassicVotingRound from "@/components/ContestClassicVotingRound.vue";

export default {
  components: { ContestClassicVotingRound },

  props: {
    contestId: { required: true, type: String },
    stageId: { required: true, type: Number }
  },

  computed: {
    ...mapGetters({
      user: "auth/authUser"
    }),

    ...mapState({
      contestStatus(state) {
        return state.contests.items[this.contestId].status;
      },

      stage(state) {
        return state.contests.items[this.contestId].stages[this.stageId];
      }
    }),

    isStarted() {
      return this.contestStatus == "started";
    },

    isOrganizer() {
      return this.user.role == "organizer";
    },

    filteredStage() {
      let newStage = {};
      let skip = null;

      for (let [roundKey, round] of Object.entries(this.stage)) {
        skip = false;
        if (round.stats) {
          for (let [playerKey, player] of Object.entries(round)) {
            if (player.score == "disqualified") skip = true;
          }
          if (skip) continue;
          newStage[roundKey] = round;
        }
      }

      return newStage;
    },

    availableRoundsToVote() {
      return Object.keys(this.filteredStage).length == 0;
    }
  },

  methods: {
    ...mapActions("contests", ["endStage"]),

    finishVotingRound() {
      this.endStage({ contestId: this.contestId, stageId: this.stageId });
    }
  }
};
</script>

<style scoped>
</style>