<template>
  <div>
    <p>Stage {{stageId}}</p>
    <ContestClassicBracketRound v-for="(round, roundId, roundIndex) in stage" :key="roundIndex" :contestId="contestId" :stageId="stageId" :roundId="roundId" />
  </div>
</template>

<script>
import ContestClassicBracketRound from "@/components/ContestClassicBracketRound.vue";
import { mapState } from "vuex";

export default {
  components: { ContestClassicBracketRound },

  props: {
    contestId: {
      required: true,
      type: String
    },

    stageId: {
      required: true,
      type: String
    }
  },

  computed: {
    ...mapState({
      stage(state) {
        return state.contests.items[this.contestId].stages[this.stageId];
      }
    })
  }
};
</script>

<style scoped>
</style>