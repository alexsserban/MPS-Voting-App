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

const newStageFactoryGroups = (battlePlan, players, benchmarks, numBattles) => {
    const nrStagePlayers = players.length,
        stage = {};
    let roundId = 0;

    console.log("Players: "+ players);
    for (let i = 0; i < nrStagePlayers; i ++) {

        //Verificam sa vedem daca are deja adversar
        if (battlePlan[players[i]][players[i]] == 1) continue;

        //Cautam adversar
        for (let j = 0; j < nrStagePlayers; j++) {
            //Nu vrem acelasi jucator
            if (i == j) continue;

            //Verificam sa nu fi concurat deja
            if (battlePlan[players[i]][players[j]] != 0) continue;

            //Verificam sa vedem daca are deja adversar
            if (battlePlan[players[j]][players[j]] == 1) continue;
            
            //II notam ca a participa la o competitie
            battlePlan[players[i]][players[i]] = 1;
            battlePlan[players[j]][players[j]] = 1;
            //Ii adaugam la battlePlan
            battlePlan[players[i]][players[j]] = 2;
            battlePlan[players[j]][players[i]] = 2;
            //Cream o runda de 1v1 si cautam alti luptatori
            stage[roundId] = makeNewRound(players[i], players[j], benchmarks);
            roundId++;
            break;
        }
        //Nu am gasit adversar
        if (battlePlan[players[i]][players[i]] == 0) {
            stage[roundId] = {[players[i]]: null};
            battlePlan[players[i]][players[i]] = 1;
        }
    }
    for (let i = 0; i < nrStagePlayers; i ++) {
        battlePlan[players[i]][players[i]] = 0;
    }
    return stage;
};

const InitialBattlePlan = players => {
    const battlePlan = {};

    for (var i = 0; i < players.length; i++) {
        battlePlan[players[i]] = {};
        for (var j = 0; j < players.length; j++) {
            battlePlan[players[i]][players[j]] = 0;
        }
    }

    return battlePlan;
};

const contestEnded = (battlePlan, players) => {
    var nrStagePlayers = players.length;

    console.log(players);

    for (var i = 0; i < nrStagePlayers; i++) {
        var countBattles = 0;

        for (var j = 0; j < nrStagePlayers; j++) {
            if (i == j) {continue}

            if (battlePlan[players[i]][players[j]] != 0)
                countBattles++;
        }

        if (countBattles != (nrStagePlayers - 1) )
            return false;
    }

    return true;
} 

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

export {
    newStageFactory,
    newStageFactoryGroups,
    InitialStageFactory,
    InitialBattlePlan,
    getUpdatedPlayerBenchmarkScore,
    contestEnded
    };
