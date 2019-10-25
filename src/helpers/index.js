const createStage = (players, benchmarks) => {
    const stage = {};
    let roundId = 0;

    for (let i = 0; i < players.length; i += 2) {
        if (!players[i + 1]) {
            stage[roundId] = {
                [players[i]]: null
            };
            continue;
        }

        stage[roundId] = {
            [players[i]]: {score: 0},
            [players[i + 1]]: {score: 0},
            stats: {
                nrRatings: 0,
                users: [],
                winner: null
            }
        };
        for (let j = 0; j < benchmarks.length; j++) {
            stage[roundId][players[i]][benchmarks[j]] = null;

            stage[roundId][players[i + 1]][benchmarks[j]] = null;
        }

        roundId++;
    }

    return stage;
};

const createInitialStage = (players, benchmarks) => {
    const stage = {};
    let roundId = null;
    const maxPlayers = nextPowerOf2(players.length);

    let min = 0;
    let max = maxPlayers - 1;

    let minRound = 0;
    let maxRound = maxPlayers / 2 - 1;

    for (let i = 0; i < maxPlayers / 2; i++) {
        if (i % 2 == 0) {
            roundId = minRound;
            minRound++;
        } else {
            roundId = maxRound;
            maxRound--;
        }
        stage[roundId] = {};

        if (!players[min]) {
            stage[roundId] = {
                [players[max]]: null
            };
        } else if (!players[max]) {
            stage[roundId] = {
                [players[min]]: null
            };
        }

        if (!players[min] || !players[max]) {
            min++;
            max--;
            continue;
        }
        stage[roundId] = {
            [players[min]]: {score: 0},
            [players[max]]: {score: 0},
            stats: {
                nrRatings: 0,
                users: [],
                winner: null
            }
        };

        for (let j = 0; j < benchmarks.length; j++) {
            stage[roundId][players[min]][benchmarks[j]] = null;

            stage[roundId][players[max]][benchmarks[j]] = null;
        }

        min++;
        max--;
    }

    return stage;
};

const nextPowerOf2 = n => {
    let count = 0;

    if (n && !(n & (n - 1))) return n;

    while (n != 0) {
        n >>= 1;
        count += 1;
    }

    return 1 << count;
};

export {createStage, createInitialStage};
