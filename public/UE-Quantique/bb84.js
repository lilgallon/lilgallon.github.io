const DEBUG = false;

function fiftyFifty() {
    return Math.random() < 0.5;
}

// 'A' | 'B' | 'C'
function randomPolarization(nbPolarizations) {
    const rand = Math.random();
    if (nbPolarizations === 2) {
        return fiftyFifty() ? 'A' : 'B';
    } else if (nbPolarizations === 3) {
        if (rand < 0.333333) {
            return 'A';
        } else if (rand >= 0.333333 && rand < 0.66666) {
            return 'B';
        } else {
            return 'C;'
        }
    } else {
        throw new Error('Invalid polarization number');
    }
}


class QBit {
    /**
     * @param {0 | 1} value
     * @param {'A' | 'B' | 'C'} polarization
     */
    constructor(value, polarization) {
        this.stable = false;
        this.value = value;
        this.polarization = polarization;
    }

    measure(polarization) {
        if (!this.stable) {
            this.stable = true;
            if (polarization === this.polarization) {
                return this.value;
            } else {
                return this.value = fiftyFifty() ? 0 : 1;
            }
        } else {
            return this.value;
        }
    }

    toString() {
        return this.value ? 'qbit mesuré' : 'qbit non mesuré';
    }
}

class Network {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    findPath(from, to) {
        let found = false;

        let currentEdge = this.edges.find((edge) => edge.from === from);
        const path = [currentEdge];

        // vérifie que le premier chemin qu'il trouve, ça marchera pas
        // si le bon chemin est pas le premier, mais bon pour notre
        // exemple ça marche très bien comme ça
        while (!found) {
            const pathLength = path.length;
            for (const edge of this.edges) {
                if (edge.from === currentEdge.to) {
                    currentEdge = edge;
                    path.push(currentEdge);
                }

                if (currentEdge.to === to) {
                    found = true;
                    break;
                }
            }

            if (pathLength === path.length) break;
        }

        return found ? path : [];
    }

    // src: id, dst: id, data: données initiales
    communicate(src, dst, data) {
        const path = this.findPath(src, dst);
        data = this.compute(this.nodes.find((node) => node.id === src), data);
        for (const edge of path) {
            const node = this.nodes.find((node) => node.id === edge.to);
            data = this.compute(node, data);
        }
        return data;
    }

    compute(node, data) {
        if (DEBUG) console.log(`${node.label}:`);
        data = node.func(data);
        if (DEBUG) console.log('-');
        return data;
    }
}

function createNetwork(nAttackers, nPolarizations) {
    const edges = [];

    const nodes = [
        {
            id: 0,
            label: "Alice",
            func: (input) => {
                const n = 10000;
                let qbits = [];
                for(let i = 0; i<n; i++)
                    qbits.push(new QBit(0, 'A'));
                if (DEBUG) console.log(`|  Generated ${n} qbits`);
                return qbits
            }
        }
    ]

    for (let attacker = 1; attacker <= nAttackers; attacker++) {
        nodes.push(
            {
                id: attacker,
                label: `Attacker ${attacker}`,
                func: (input) => {
                    const newQBits = []
                    for (qbit of input) {
                        newQBits.push(
                            new QBit(
                                qbit.measure(randomPolarization(nPolarizations)),
                                'A'
                            )
                        );
                    }
                    if (DEBUG) console.log(`|  Measured all qbits, and created new ones`);
                    return newQBits;
                }
            }
        );

        edges.push({ from: attacker-1, to: attacker });
    }

    nodes.push(
        {
            id: nAttackers+1,
            label: "Bob",
            func: (input) => {
                const measurements = [];

                for (qbit of input) {
                    measurements.push(qbit.measure(randomPolarization(nPolarizations)));
                }
                if (DEBUG) console.log(`|  Measured all qbits`);
                return measurements;
            }
        }
    );

    edges.push({ from: nAttackers, to: nAttackers+1 })

    return new Network(nodes, edges);
}

const main = () => {
    let measurements, goodMeasurements;
    let nAttackers = 0;

    console.log();

    // 3b (w/o attacker)
    console.log(`ALICE -> ${nAttackers} ATTACKER -> BOB (2 polarizations)`);
    measurements = createNetwork(nAttackers, 2).communicate(0, nAttackers+1, null);
    goodMeasurements = measurements.filter((measurement) => measurement === 0).length;
    console.log('Successful measurements: ' + (goodMeasurements * 100 / measurements.length) + '%');

    console.log();

    // 3b (with attacker)
    nAttackers = 1;
    console.log(`ALICE -> ${nAttackers} ATTACKER -> BOB (2 polarizations)`);
    measurements = createNetwork(nAttackers, 2).communicate(0, nAttackers+1, null);
    goodMeasurements = measurements.filter((measurement) => measurement === 0).length;
    console.log('Successful measurements: ' + (goodMeasurements * 100 / measurements.length) + '%');

    console.log();

    // 4a (with n attackers)
    nAttackers = 100;
    console.log(`ALICE -> ${nAttackers} ATTACKERS -> BOB (2 polarizations)`);
    measurements = createNetwork(nAttackers, 2).communicate(0, nAttackers+1, null);
    goodMeasurements = measurements.filter((measurement) => measurement === 0).length;
    console.log('Successful measurements: ' + (goodMeasurements * 100 / measurements.length) + '%');

    console.log('');

    // 4b
    nAttackers = 0;
    console.log(`ALICE -> ${nAttackers} ATTACKERS -> BOB (3 polarizations)`);
    measurements = createNetwork(nAttackers, 3).communicate(0, nAttackers+1, null);
    goodMeasurements = measurements.filter((measurement) => measurement === 0).length;
    console.log('Successful measurements: ' + (goodMeasurements * 100 / measurements.length) + '%');
}

console.log();
main();
console.log();