import {db, firestore} from '@/main';
import {
    newStageFactory,
    InitialStageFactory,
    getUpdatedPlayerBenchmarkScore
} from '@/helpers';

export default {
    namespaced: true,

    state: {
        items: {}
    },

    getters: {},

    actions: {
        fetchAllContests({commit}) {
            console.log(`Fetching Contests: ALL`);

            return new Promise(async (resolve, reject) => {
                const contests = await db.collection('contests').get();
                contests.docs.forEach(contest => {
                    commit(
                        'setItem',
                        {
                            resource: 'contests',
                            id: contest.id,
                            item: contest.data()
                        },
                        {root: true}
                    );
                });
                resolve();
            });
        },

        fetchContest({commit}, contestId) {
            return new Promise(async (resolve, reject) => {
                const contest = await db
                    .collection('contests')
                    .doc(contestId)
                    .get();

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
        },

        createContest({commit, state, rootState}, {contest, players}) {
            return new Promise(async (resolve, reject) => {
                contest = {
                    ...contest,
                    userId: rootState.auth.authId,
                    status: 'notStarted',
                    currentStage: 0,
                    stages: {
                        ['0']: InitialStageFactory(players, contest.benchmarks)
                    }
                };

                const contestRef = await db.collection('contests').add(contest);

                commit(
                    'setItem',
                    {
                        resource: 'contests',
                        id: contestRef.id,
                        item: contest
                    },
                    {root: true}
                );
                resolve(state.items[contestRef.id]);
            });
        },

        async sendRoundRating(
            {state, dispatch, rootState},
            {contestId, stageId, roundId, players}
        ) {
            await dispatch('fetchContest', contestId);

            let round = state.items[contestId].stages[stageId][roundId],
                updates = {};

            const benchmarks = state.items[contestId].benchmarks,
                nrRatings = round.stats.nrRatings,
                roundPath = `stages.${stageId}.${roundId}`;

            benchmarks.forEach(benchmark => {
                players.forEach(player => {
                    updates[
                        `${roundPath}.${player.name}.${benchmark}`
                    ] = getUpdatedPlayerBenchmarkScore({
                        average: round[player.name][benchmark],
                        nrRatings,
                        newRating: parseInt(player.benchmarks[benchmark], 10)
                    });
                });
            });

            updates[`${roundPath}.stats.nrRatings`] = nrRatings + 1;
            updates[
                `${roundPath}.stats.users`
            ] = firestore.FieldValue.arrayUnion(rootState.auth.authId);

            await db
                .collection('contests')
                .doc(contestId)
                .update(updates);

            await dispatch('fetchContest', contestId);
        },

        async endStage({state, commit}, {contestId, stageId}) {
            const stage = state.items[contestId].stages[stageId],
                benchmarks = state.items[contestId].benchmarks;

            let updates = {},
                newPlayers = [],
                score = null,
                keys = null,
                winner = null,
                firstBenchmark,
                secondBenchMark;

            for (let [roundKey, round] of Object.entries(stage)) {
                // Runda are un singur player, care trece automat in runda urmatoare
                if (!round.stats) {
                    newPlayers.push(Object.keys(round)[0]);
                    continue;
                }

                // Un jucator a fost descalificat pana sa fie disponibila runda pentru votare
                if (round.stats.winner) {
                    newPlayers.push(round.stats.winner);
                    continue;
                }

                score = {};

                // Calcul scor pentru cei doi jucatori din runda
                for (let [playerKey, player] of Object.entries(round)) {
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

                keys = Object.keys(score);

                // Departajare prin scor
                winner =
                    score[keys[0]] > score[keys[1]]
                        ? keys[0]
                        : score[keys[0]] < score[keys[1]]
                        ? keys[0]
                        : null;

                // Departajare prin benchmarks
                if (!winner)
                    for (let [i, benchmark] of Object.entries(benchmarks)) {
                        firstBenchmark = round[keys[0]][benchmark];
                        secondBenchMark = round[keys[1]][benchmark];

                        winner =
                            firstBenchmark > secondBenchMark
                                ? keys[0]
                                : firstBenchmark < secondBenchMark
                                ? keys[1]
                                : null;

                        if (winner) break;
                    }

                // Departajare finala prin nume sau castiga primul jucator
                if (!winner)
                    if (keys[0].charAt(0) > keys[1].charAt(0)) {
                        winner = keys[1];
                    } else {
                        winner = keys[0];
                    }

                updates[`stages.${stageId}.${roundKey}.stats.winner`] = winner;
                newPlayers.push(winner);
            }

            //Termina contestul daca a fost o singura runda in ultimul stage
            if (Object.keys(stage).length == 1) {
                commit('endContest', contestId);
                updates['status'] = ' finished';
            } else {
                const stage = newStageFactory(newPlayers, benchmarks);

                const newStageId = state.items[contestId].currentStage + 1;
                state.items[contestId].stages[`${newStageId}`] = stage;

                updates = {
                    ...updates,
                    [`stages.${newStageId}`]: stage,
                    ['currentStage']: newStageId,
                    ['status']: 'paused'
                };
            }

            await db
                .collection('contests')
                .doc(contestId)
                .update(updates);
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
