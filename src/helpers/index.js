const isEven = number => number % 2 == 0;

const makeNewRound = (firstPlayerName, secondPlayerName, benchmarks) => {
    let round = {
        [firstPlayerName]: {score: 0},
        [secondPlayerName]: {score: 0},
        stats: {
            nrRatings: 0,
            users: [],
            winner: null
        }
    };

    benchmarks.forEach(benchmark => {
        round[firstPlayerName][benchmark] = null;
        round[secondPlayerName][benchmark] = null;
    });

    return round;
};

const newStageFactory = (players, benchmarks) => {
    const nrStagePlayers = players.length,
        stage = {};
    let roundId = 0;

    for (let i = 0; i < nrStagePlayers; i += 2) {
        stage[roundId] = makeNewRound(players[i], players[i + 1], benchmarks);
        roundId++;
    }

    return stage;
};

const InitialStageFactory = (players, benchmarks) => {
    const nrMaxStagePlayers = nextPowerOf2(players.length),
        nrRounds = nrMaxStagePlayers / 2,
        stage = {};

    let firstSeed = 0,
        lastSeed = nrMaxStagePlayers - 1,
        firstRoundId = 0,
        lastRoundId = nrRounds - 1,
        roundId = null;

    for (let i = 0; i < nrRounds; i++) {
        roundId = isEven(i) ? firstRoundId++ : lastRoundId--; // Rundele 0 - n sunt configurate in ordinea 0, n, 1, n - 1, 2, n - 2, etc...
        stage[roundId] = {};

        stage[roundId] = players[lastSeed]
            ? makeNewRound(players[firstSeed], players[lastSeed], benchmarks)
            : {[players[firstSeed]]: null}; // Daca nu exista un jucator cu seedul 'lastSeed', primul jucator castiga runda automat

        firstSeed++;
        lastSeed--;
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

const getUpdatedPlayerBenchmarkScore = ({average, nrRatings, newRating}) => {
    return (average * nrRatings + newRating) / (nrRatings + 1);
};

const getWinnerBasedOnScore = score => {
    keys = Object.keys(score);
    score[keys[0]] > score[keys[1]]
        ? keys[0]
        : score[keys[0]] < score[keys[1]]
        ? keys[0]
        : null;
};

export {newStageFactory, InitialStageFactory, getUpdatedPlayerBenchmarkScore};
