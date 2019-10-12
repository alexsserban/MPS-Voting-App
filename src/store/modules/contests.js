import {db} from '@/main';
import Vue from 'vue';

export default {
    namespaced: true,

    // in obiectul items se stocheaza toate contesturile dupa ce sunt extrase din db
    state: {
        items: {}
    },

    getters: {},

    actions: {
        createContest({commit, state, rootState}, contest) {
            return new Promise(async (resolve, reject) => {
                contest.userId = rootState.auth.authId;
                contest.rating = null;

                // Adaugare contest in db, await nu lasa aplicatia sa treaca mai departe pana cand nu se termina executia acestei linii de cod
                const contestRef = await db.collection('contests').add(contest);

                // Adaugare Contest la Items
                // setItem se afla in /store/modules/index.js la mutations
                commit(
                    'setItem',
                    {resource: 'contests', item: contest, id: contestRef.id},
                    {root: true}
                );
                resolve(state.items[contestRef.id]);
            });
        },

        fetchAllContests({state, commit}) {
            console.log(`Fetching Contests: ALL`);

            return new Promise((resolve, reject) => {
                db.collection('contests')
                    .get()
                    .then(contests => {
                        contests.docs.forEach(contest => {
                            commit(
                                'setItem',
                                {
                                    item: contest.data(),
                                    id: contest.id,
                                    resource: 'contests'
                                },
                                {root: true}
                            );
                        });
                        resolve(Object.values(state.items));
                    });
            });
        },

        // diferenta dintre fetchContest si fetchAllContests, pe langa faptul ca prima extrage din db un singur contest este ca
        // in momentul ce o valoare dintr-un contest se modifica, aceste modificari apar in timp real in pagina.
        // Firestore real time updates
        fetchContest({state, commit}, contestId) {
            db.collection('contests')
                .doc(contestId)
                .onSnapshot(function(snapshot) {
                    commit(
                        'setItem',
                        {
                            resource: 'contests',
                            id: contestId,
                            item: snapshot.data()
                        },
                        {root: true}
                    );
                });
        }
    },

    mutations: {}
};
