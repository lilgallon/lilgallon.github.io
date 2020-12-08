class QBit {
    constructor() {
        this.value = null;
    }

    measure() {
        if (this.value) return this.value
        else return this.value = Math.random() < 0.5 ? 0 : 1;
    }

    toString() {
        return this.value ? 'qbit non mesuré' : 'qbit mesuré';
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
            console.log(`Node "${node.label}" (id: ${node.id})`);
        }
        return data;
    }

    compute(node, data) {
        console.log(`${node.label} {`);
        data = node.func(data);
        console.log('}');
        return data;
    }
}

const main = () => {
    const network = new Network(
        [
            {
                id: 1,
                label: "Alice",
                func: (data) => {
                    console.log('  ' + data);
                    return data;
                }
            },
            {
                id: 2,
                label: "Bob",
                func: (data) => {
                    console.log('  ' + data);
                    return data;
                }
            },
        ],
        [
            { from: 1, to: 2 },
            { from: 2, to: 1 },
        ]
    );

    network.communicate(1, 2, [
        new QBit(),
        new QBit(),
        new QBit(),
    ]);
}

main();