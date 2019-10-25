import {db, firestore} from '@/main';
import Vue from 'vue';

export default {
    namespaced: true,

    // in obiectul items se stocheaza toate contesturile dupa ce sunt extrase din db
    state: {
        items: {}
    },

    getters: {},

    actions: {
        createStage({commit}, {contestId, benchmarks, players}) {},

        // createStage({commit}, {contestId, benchmarks, players}) {
        //     return new Promise((resolve, reject) => {
        //         // const stageRef = db
        //         //     .collection('contests')
        //         //     .doc(contestId)
        //         //     .collection('stages')
        //         //     .doc();

        //         const battles = {};
        //         const ordering = [
        //             'first',
        //             'second',
        //             'third',
        //             'fourth',
        //             'fifth',
        //             'sixth',
        //             'seventh',
        //             'eighth',
        //             'ninth',
        //             'tenth'
        //         ];

        //         const playerProperties = {};

        //         benchmarks.forEach(benchmark => {
        //             playerProperties[benchmark] = {
        //                 average: null,
        //                 nrOfRatings: 0,
        //                 ratings: []
        //             };
        //         });

        //         for (let i = 0; i < players.length; i += 2) {
        //             battles[ordering[0]] = {
        //                 [players[i]]: {...playerProperties},
        //                 [players[i + 1]]: {...playerProperties}
        //             };

        //             ordering.shift();
        //         }

        //         const stage = {battles};

        //         db.collection('contests')
        //             .doc(contestId)
        //             .collection('stages')
        //             .doc(stageRef.id)
        //             .set(stage);

        //         commit(
        //             'setItem',
        //             {item: stage, id: stageRef.id, resource: 'stages'},
        //             {root: true}
        //         );

        //         resolve(stageRef.id);
        //     });
        // },

        updateStage(
            {commit, state},
            {contestId, id, battleId, firstPlayer, secondPlayer}
        ) {
            Object.keys(firstPlayer.benchmarks).forEach(key => {
                db.collection('contests')
                    .doc(contestId)
                    .collection('stages')
                    .doc(id)
                    .update({
                        [`battles.${battleId}.${firstPlayer.name}.${key}.ratings`]: firestore.FieldValue.arrayUnion(
                            firstPlayer.benchmarks[key]
                        ),
                        [`battles.${battleId}.${secondPlayer.name}.${key}.ratings`]: firestore.FieldValue.arrayUnion(
                            secondPlayer.benchmarks[key]
                        )
                    });

                commit('addUserRating', {
                    stage: id,
                    battle: battleId,
                    user: firstPlayer.name,
                    benchmark: key,
                    rating: firstPlayer.benchmarks[key]
                });
                commit('addUserRating', {
                    stage: id,
                    battle: battleId,
                    user: secondPlayer.name,
                    benchmark: key,
                    rating: secondPlayer.benchmarks[key]
                });
            });
        },

        fetchCurrentStage({commit}, {contestId, id}) {
            return new Promise((resolve, reject) => {
                db.collection('contests')
                    .doc(contestId)
                    .collection('stages')
                    .doc(id)
                    .get()
                    .then(function(stage) {
                        commit(
                            'setItem',
                            {
                                id,
                                item: stage.data(),
                                resource: 'stages'
                            },
                            {root: true}
                        );
                        resolve();
                    });
            });
        }
    },

    mutations: {
        addUserRating(state, {stage, battle, user, benchmark, rating}) {
            state.items[stage].battles[battle][user][benchmark].ratings.push(
                rating
            );
        }
    }
};
