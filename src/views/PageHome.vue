<template>
  <div v-if="asyncDataStatus_ready" class="home">
    <h1>Hello {{ user ? user.name : "Guest" }}</h1>

    <span v-if="!availableContest">No contests available!</span>

    <!-- Pentru fiecare contest din contestList randeaza componenta ContestPreview -->
    <div v-else v-for="(contest,index) in contestsList" :key="index" class="text-center">
      <ContestPreview :contest="contest" :id="index" />
    </div>

    <br />
    <br />

    <!-- Daca exista un user logat, sa apara pe pagina si modulul de ContestCreator -->
    <ContestCreator v-if="isOrganizer" />
  </div>
</template>

<script>
import ContestPreview from "@/components/ContestPreview.vue";
import ContestCreator from "@/components/ContestCreator.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapState, mapGetters, mapActions } from "vuex";
import { db } from "@/main";

export default {
  name: "PageHome",

  // componentele folosite mai sus in template
  components: {
    ContestPreview,
    ContestCreator
  },

  mixins: [asyncDataStatus],

  computed: {
    // leaga variabila user la /store/modules/auth - authUser
    ...mapGetters({
      user: "auth/authUser"
    }),

    ...mapState({
      // leaga variabila contestsList la /store/modules/contests/items, adica toate contesturile extrase din db
      contestsList(state) {
        return state.contests.items;
      },

      // Daca obiectul contestsList nu este gol, inseamna ca sunt contesturi ce pot fi randate pe pagina
      availableContest() {
        if (Object.keys(this.contestsList).length != 0) return true;
        return false;
      }
    }),

    isOrganizer() {
      if (!this.user) return false;
      return this.user.role == "organizer";
    }
  },

  methods: {
    // pentru a putea folosi mai jos functia fetchAllContests() ce se afla in /store/modules/contests in actions
    ...mapActions("contests", ["fetchAllContests"])
  },

  // in momentul in care pagina este creata, foloseste functia pentru a extrage toate contesturile din db si apoi anunta aplicatia ca pagina poate fi randata
  // fara this.asyncDataStatus_fetched() pe pagina ar ramane acel loader la infinit si nu ar aparea nimic
  async created() {
    await this.fetchAllContests();
    this.asyncDataStatus_fetched();
  }
};
</script>
