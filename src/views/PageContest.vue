<template>
  <div v-if="asyncDataStatus_ready">
    <h1>{{ contest.name }}</h1>

    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="card bg-secondary shadow border-0">
          <div class="card-body px-lg-5 py-lg-5">
            <p>{{contest.rating ? `Team X rating: ${contest.rating}` : "No rating for Team X"}}</p>

            <label>Select Rating:</label>
            <form class="ratingForm" @submit.prevent="updateRating()" role="form">
              <select v-model="rating" name="cars">
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
              </select>
              <br />
              <br />
              <button type="submit" class="btn btn-primary">Send Rating</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <br />
  </div>
</template>

<script>
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapState, mapActions } from "vuex";
import { db } from "@/main";

export default {
  name: "PageContest",

  mixins: [asyncDataStatus],

  // id-ul contest-ului din db
  props: {
    id: {
      required: true,
      type: String
    }
  },

  data() {
    return {
      rating: null
    };
  },

  computed: {
    ...mapState({
      contestsList(state) {
        return state.contests.items;
      }
    }),

    contest() {
      return this.contestsList[this.id];
    }
  },

  methods: {
    ...mapActions("contests", ["fetchContest"]),

    updateRating() {
      db.collection("contests")
        .doc(this.id)
        .update({ rating: this.rating });
    }
  },

  created() {
    this.fetchContest(this.id);
    this.asyncDataStatus_fetched();
  }
};
</script>

<style scoped>
p {
  text-align: center;
}
</style>