import {db, firestore} from '@/main';
import Vue from 'vue';
import {createStage, createInitialStage} from '@/helpers';

export default {
    namespaced: true,

    state: {
        items: {}
    },

    getters: {},

    actions: {
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

        fetchContest({state, commit}, contestId) {
            return new Promise((resolve, reject) => {
                db.collection('contests')
                    .doc(contestId)
                    .get()
                    .then(function(contest) {
                        commit(
                            'setItem',
                            {
                                resource: 'contests',
                                id: contestId,
                                item: contest.data()
                            },
                            {root: true}
                        );
                        resolve();
                    });
            });
        },

        createContest(
            {commit, state, rootState, dispatch},
            {contest, players}
        ) {
            return new Promise(async (resolve, reject) => {
                contest.userId = rootState.auth.authId;
                contest.status = 'notStarted';
                contest.currentStage = 0;
                contest.stages = {};

                const stage = createInitialStage(players, contest.benchmarks);
                contest.stages['0'] = stage;

                // Adaugare contest in db, await nu lasa aplicatia sa treaca mai departe pana cand nu se termina executia acestei linii de cod
                const contestRef = await db.collection('contests').add(contest);

                commit(
                    'setItem',
                    {
                        resource: 'contests',
                        item: contest,
                        id: contestRef.id
                    },
                    {root: true}
                );
                resolve(state.items[contestRef.id]);
            });
        },

        async sendRoundRating(
            {state, commit, dispatch, rootState},
            {contestId, stageId, roundId, firstPlayer, secondPlayer}
        ) {
            await dispatch('fetchContest', contestId);
            delete firstPlayer.benchmarks.score;

            const keys = Object.keys(firstPlayer.benchmarks);
            let score = null;
            let updates = {};

            let nrRatings =
                state.items[contestId].stages[stageId][roundId].stats.nrRatings;

            keys.forEach(key => {
                score =
                    state.items[contestId].stages[stageId][roundId][
                        firstPlayer.name
                    ][key];

                score =
                    (score * nrRatings +
                        parseInt(firstPlayer.benchmarks[key], 10)) /
                    (nrRatings + 1);

                updates[
                    `stages.${stageId}.${roundId}.${firstPlayer.name}.${key}`
                ] = score;

                score =
                    state.items[contestId].stages[stageId][roundId][
                        secondPlayer.name
                    ][key];

                score =
                    (score * nrRatings +
                        parseInt(secondPlayer.benchmarks[key], 10)) /
                    (nrRatings + 1);

                updates[
                    `stages.${stageId}.${roundId}.${secondPlayer.name}.${key}`
                ] = score;
            });

            updates[`stages.${stageId}.${roundId}.stats.nrRatings`] =
                nrRatings + 1;

            updates[
                `stages.${stageId}.${roundId}.stats.users`
            ] = firestore.FieldValue.arrayUnion(rootState.auth.authId);

            await db
                .collection('contests')
                .doc(contestId)
                .update(updates);

            dispatch('fetchContest', contestId);
        },

        async endStage({state, dispatch, commit}, {contestId, stageId}) {
            await dispatch('fetchContest', contestId);
            const stage = state.items[contestId].stages[stageId];
            const rounds = Object.keys(stage);
            let score = {};
            let updates = {};
            const benchmarks = state.items[contestId].benchmarks;
            let newPlayers = [];
            let keys = null;
            let winner = null;

            for (let [roundKey, round] of Object.entries(stage)) {
                score = {};

                if (!round.stats) {
                    for (let [index, [playerKey, player]] of Object.entries(
                        Object.entries(round)
                    )) {
                        if (player == null) {
                            newPlayers.push(playerKey);
                            continue;
                        }
                    }
                } else if (round.stats.winner == null) {
                    for (let [index, [playerKey, player]] of Object.entries(
                        Object.entries(round)
                    )) {
                        if (playerKey == 'stats') continue;

                        score[playerKey] = 0;

                        for (let [key, benchmark] of Object.entries(player)) {
                            if (key == 'score') continue;
                            score[playerKey] += benchmark;
                        }

                        updates[
                            `stages.${stageId}.${roundKey}.${playerKey}.score`
                        ] = score[playerKey];
                    }
                    if (Object.keys(score).length == 2) {
                        keys = Object.keys(score);

                        if (score[keys[0]] > score[keys[1]]) {
                            winner = keys[0];
                        } else if (score[keys[0]] < score[keys[1]]) {
                            winner = keys[1];
                        } else {
                            for (let [i, benchmark] of Object.entries(
                                benchmarks
                            )) {
                                if (
                                    round[keys[0]][benchmark] >
                                    round[keys[1]][benchmark]
                                ) {
                                    winner = keys[0];
                                    break;
                                } else if (
                                    round[keys[0]][benchmark] <
                                    round[keys[1]][benchmark]
                                ) {
                                    winner = keys[1];
                                    break;
                                } else if (i == benchmarks.length - 1) {
                                    if (keys[1].charAt(0) > keys[1].charAt(0)) {
                                        winner = keys[1];
                                    } else {
                                        winner = keys[0];
                                    }
                                }
                            }
                        }
                    }
                    updates[
                        `stages.${stageId}.${roundKey}.stats.winner`
                    ] = winner;

                    newPlayers.push(winner);
                    console.log(newPlayers);
                } else {
                    newPlayers.push(round.stats.winner);
                }
            }

            await db
                .collection('contests')
                .doc(contestId)
                .update(updates);

            if (rounds.length == 1) {
                commit('endContest', contestId);
                await db
                    .collection('contests')
                    .doc(contestId)
                    .update({
                        status: 'finished'
                    });
            } else {
                const stage = createStage(newPlayers, benchmarks);

                const newStageId = state.items[contestId].currentStage + 1;
                state.items[contestId].stages[`${newStageId}`] = stage;

                db.collection('contests')
                    .doc(contestId)
                    .update({
                        [`stages.${newStageId}`]: stage,
                        currentStage: newStageId,
                        status: 'paused'
                    });
            }
        },

        disqualifyPlayer(
            {commit, state},
            {playerName, opponentName, contestId, stageId, roundId}
        ) {
            if (Object.keys(state.items[contestId].stages[stageId]).length == 1)
                db.collection('contests')
                    .doc(contestId)
                    .update({status: 'finished'});

            let updates = {};
            updates[`stages.${stageId}.${roundId}.${playerName}.score`] =
                'disqualified';

            updates[`stages.${stageId}.${roundId}.stats.winner`] = opponentName;

            db.collection('contests')
                .doc(contestId)
                .update(updates);

            commit('disqualify', {
                playerName,
                opponentName,
                roundId,
                stageId,
                contestId
            });
        },

        fetchContestRealTime({state, commit}, contestId) {
            db.collection('contests')
                .where('name', '==', state.items[contestId].name)
                .onSnapshot(function(snapshot) {
                    snapshot.docChanges().forEach(function(change) {
                        commit(
                            'setItem',
                            {
                                resource: 'contests',
                                id: contestId,
                                item: change.doc.data()
                            },
                            {root: true}
                        );
                    });
                });
        }
    },

    mutations: {
        endContest(state, contestId) {
            state.items[contestId].status = 'finished';
        },

        disqualify(
            state,
            {playerName, opponentName, contestId, stageId, roundId}
        ) {
            state.items[contestId].stages[stageId][roundId][playerName].score =
                'disqualified';

            state.items[contestId].stages[stageId][
                roundId
            ].stats.winner = opponentName;
        }
    }
};
