<template>
  <div v-if="asyncDataStatus_ready">
    <h1>
      {{ contest.name }}
      <span v-if="!isStarted && !isFinished && !isPaused">will start soon</span>
      <span v-else-if="isPaused">- next Stage will start soon</span>

      <span v-else-if="isStarted">- voting time</span>
      <span v-else>is finished!</span>
    </h1>
    <div class="row">
      <div :class="[isOrganizer && !isStarted && !isFinished ? 'col-lg-1' : 'col-lg-2']"></div>

      <div class="col-lg-8">
        <ContestClassicBracket v-if="!isStarted" :contestId="id" />
        <ContestClassicVotingStage v-else :contestId="id" :stageId="contest.currentStage" />
        <br />

        <button
          v-if="isOrganizer && !isStarted && !isFinished && !isPaused"
          class="btn btn-primary"
          @click="start()"
        >Start Contest</button>

        <button
          v-else-if="isOrganizer && isPaused && !isFinished"
          class="btn btn-primary"
          @click="start()"
        >Start next Stage</button>

        <br />
      </div>
      <div v-if="!isStarted && isOrganizer && !isFinished" class="col-lg-2">
        <RemovePlayer :contestId="id" :stageId="contest.currentStage" />
      </div>

      <div :class="[isOrganizer? 'col-lg-1' : 'col-lg-2']"></div>
    </div>
  </div>
</template>

<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import { db } from "@/main";
import ContestClassicBracket from "@/components/ContestClassicBracket.vue";
import ContestClassicVotingStage from "@/components/ContestClassicVotingStage.vue";
import RemovePlayer from "@/components/RemovePlayer.vue";

export default {
  name: "PageContest",

  mixins: [asyncDataStatus],

  components: {
    ContestClassicBracket,
    ContestClassicVotingStage,
    RemovePlayer
  },

  props: {
    id: {
      required: true,
      type: String
    }
  },

  data() {
    return {
      newPlayer: null
    };
  },

  computed: {
    ...mapState({
      contest(state) {
        return state.contests.items[this.id];
      }
    }),

    ...mapGetters({
      user: "auth/authUser"
    }),

    isOrganizer() {
      return this.user.role == "organizer";
    },

    isStarted() {
      return this.contest.status == "started";
    },

    isFinished() {
      return this.contest.status == "finished";
    },

    isPaused() {
      return this.contest.status == "paused";
    }
  },

  methods: {
    ...mapActions("contests", ["fetchContest", "fetchContestRealTime"]),

    start() {
      db.collection("contests")
        .doc(this.id)
        .update({
          status: "started"
        });
    }
  },

  created() {
    this.fetchContest(this.id).then(() => {
      this.asyncDataStatus_fetched();
      this.fetchContestRealTime(this.id);
    });
  }
};
</script>

<style scoped>
p {
  text-align: center;
}
</style>