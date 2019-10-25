<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <ContestClassicBracketStage
              v-for="(stage, stageId, stageIndex) in stages"
              :key="stageIndex"
              :contestId="contestId"
              :stageId="stageId"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContestClassicBracketStage from "@/components/ContestClassicBracketStage.vue";
import { mapState } from "vuex";

export default {
  components: { ContestClassicBracketStage },

  props: {
    contestId: {
      required: true,
      type: String
    }
  },

  computed: {
    ...mapState({
      stages(state) {
        return state.contests.items[this.contestId].stages;
      }
    })
  }
};
</script>

<style  scoped>
</style>