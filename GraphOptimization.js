class GraphLayout {
  constructor(graphData) {
    this.nodeList = graphData.nodes;
    this.edgeList = graphData.edges;
    this.nodePositions = this._initializeNodePositions();
    this.iterations = 800;
    this.repulsionStrength = 0.08;
    this.attractionStrength = 0.02;
    this.springIdealLength = 0.2;
    this.dampingFactor = 0.85;
    this.minimumNodeDistance = 0.03;
    this.edgeAttractionWeight = 2.0;
  }

  _initializeNodePositions() {
    const positions = {};
    for (const node of this.nodeList) {
      positions[node.id] = { x: node.x, y: node.y };
    }
    return positions;
  }

  optimizeLayout() {
    for (let i = 0; i < this.iterations; i++) {
      const forces = {};
      const temperature = 1.0 - i / this.iterations;
      const currentDamping = this.dampingFactor * temperature;

      // Initialize forces
      for (const nodeId in this.nodePositions) {
        forces[nodeId] = { x: 0, y: 0 };
      }

      // Repulsive forces between all pairs
      for (const nodeA in this.nodePositions) {
        for (const nodeB in this.nodePositions) {
          if (nodeA === nodeB) continue;

          let dx = this.nodePositions[nodeA].x - this.nodePositions[nodeB].x;
          let dy = this.nodePositions[nodeA].y - this.nodePositions[nodeB].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.minimumNodeDistance) {
            distance = this.minimumNodeDistance;
            dx += (Math.random() - 0.5) * 0.01;
            dy += (Math.random() - 0.5) * 0.01;
          }

          const repulsiveForce = this.repulsionStrength / (distance * distance);
          forces[nodeA].x += (dx / distance) * repulsiveForce;
          forces[nodeA].y += (dy / distance) * repulsiveForce;
        }
      }

      // Attractive forces for connected nodes
      for (const [nodeA, nodeB] of this.edgeList) {
        let dx = this.nodePositions[nodeA].x - this.nodePositions[nodeB].x;
        let dy = this.nodePositions[nodeA].y - this.nodePositions[nodeB].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.001) distance = 0.001;

        const attractiveForce =
          this.attractionStrength *
          this.edgeAttractionWeight *
          (distance - this.springIdealLength);
        const fx = (dx / distance) * attractiveForce;
        const fy = (dy / distance) * attractiveForce;

        forces[nodeA].x -= fx;
        forces[nodeA].y -= fy;
        forces[nodeB].x += fx;
        forces[nodeB].y += fy;
      }

      // Apply forces with damping and temperature
      for (const nodeId in this.nodePositions) {
        const forceX = forces[nodeId].x * currentDamping;
        const forceY = forces[nodeId].y * currentDamping;
        const forceMagnitude = Math.sqrt(forceX * forceX + forceY * forceY);
        const maxForce = 0.1 * temperature;

        if (forceMagnitude > maxForce) {
          const scale = maxForce / forceMagnitude;
          this.nodePositions[nodeId].x += forceX * scale;
          this.nodePositions[nodeId].y += forceY * scale;
        } else {
          this.nodePositions[nodeId].x += forceX;
          this.nodePositions[nodeId].y += forceY;
        }
      }
    }

    this._separateUnconnectedComponents();
    this._normalizePositions();
  }

  _separateUnconnectedComponents() {
    const connectedPairs = new Set();
    this.edgeList.forEach(([a, b]) => {
      connectedPairs.add(`${a}-${b}`);
      connectedPairs.add(`${b}-${a}`);
    });

    for (let i = 0; i < 100; i++) {
      for (const nodeA in this.nodePositions) {
        for (const nodeB in this.nodePositions) {
          if (nodeA === nodeB) continue;
          if (connectedPairs.has(`${nodeA}-${nodeB}`)) continue;

          let dx = this.nodePositions[nodeA].x - this.nodePositions[nodeB].x;
          let dy = this.nodePositions[nodeA].y - this.nodePositions[nodeB].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.springIdealLength * 1.5) {
            const pushForce = 0.001;
            const pushX = (dx / distance) * pushForce;
            const pushY = (dy / distance) * pushForce;

            this.nodePositions[nodeA].x += pushX;
            this.nodePositions[nodeA].y += pushY;
            this.nodePositions[nodeB].x -= pushX;
            this.nodePositions[nodeB].y -= pushY;
          }
        }
      }
    }
  }

  _normalizePositions() {
    const allNodes = Object.values(this.nodePositions);
    let maxX = Math.max(...allNodes.map((n) => n.x));
    let maxY = Math.max(...allNodes.map((n) => n.y));
    let minX = Math.min(...allNodes.map((n) => n.x));
    let minY = Math.min(...allNodes.map((n) => n.y));

    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    for (const nodeId in this.nodePositions) {
      this.nodePositions[nodeId].x =
        (this.nodePositions[nodeId].x - minX) / rangeX;
      this.nodePositions[nodeId].y =
        (this.nodePositions[nodeId].y - minY) / rangeY;
    }
  }

  getOptimizedPositions() {
    return this.nodePositions;
  }
}

// Usage:
const graphData = {
  nodes: [
    { id: "Blantyre", x: 0.9134213014976535, y: 0.2540740323898225 },
    { id: "Chikwawa", x: 0.14374226893980302, y: 0.3910154112946962 },
    { id: "Chiradzulu", x: 0.9351749046225152, y: 0.5027042682331085 },
    { id: "Chitipa", x: 0.5033532302137712, y: 0.6371050642113303 },
    { id: "Dedza", x: 0.32675593364689126, y: 0.32741458873737384 },
    { id: "Dowa", x: 0.44893854232683894, y: 0.3534310438093927 },
    { id: "Karonga", x: 0.7719114930591756, y: 0.7164846847486838 },
    { id: "Kasungu", x: 0.9486271739760203, y: 0.03717616769235954 },
    { id: "Lilongwe", x: 0.03185092819745572, y: 0.07907784991666855 },
    { id: "Machinga", x: 0.4976553188158377, y: 0.15957191749775634 },
    { id: "Mangochi", x: 0.2417748469656349, y: 0.22132470346325728 },
    { id: "Mchinji", x: 0.8029651384628501, y: 0.4170419722297135 },
    { id: "Mulanje", x: 0.6998851394303303, y: 0.7300336822154281 },
    { id: "Mwanza", x: 0.3093976112949879, y: 0.9141857772478698 },
    { id: "Mzimba", x: 0.16190201617155997, y: 0.8356366262711726 },
    { id: "Neno", x: 0.9869012833729535, y: 0.3511167097222222 },
    { id: "Nkhata Bay", x: 0.0882233026546202, y: 0.18674223158715342 },
    {
      id: "Nkhotakota",
      x: 0.17467106409589772,
      y: 0.0010883823237957113,
    },
    { id: "Nsanje", x: 0.8093914854184416, y: 0.5079865816371467 },
    { id: "Ntcheu", x: 0.8588177668360885, y: 0.4167540312634731 },
    { id: "Ntchisi", x: 0.3969781197576786, y: 0.9982702660465445 },
    { id: "Phalombe", x: 0.934352810085411, y: 0.7328019939159007 },
    { id: "Rumphi", x: 0.2438492080065875, y: 0.0387865957339274 },
    { id: "Salima", x: 0.837201462046805, y: 0.9965726289086905 },
    { id: "Thyolo", x: 0.6272655175304893, y: 0.7688215502317457 },
    { id: "Zomba", x: 0.7252659639019722, y: 0.810888016094619 },
    { id: "Balaka", x: 0.15932838570160823, y: 0.5698123530031478 },
    { id: "Likoma", x: 0.3488343806746971, y: 0.6253864059894712 },
  ],
  edges: [
    ["Blantyre", "Chikwawa"],
    ["Blantyre", "Chiradzulu"],
    ["Blantyre", "Thyolo"],
    ["Chikwawa", "Nsanje"],
    ["Chikwawa", "Mwanza"],
    ["Chiradzulu", "Zomba"],
    ["Chiradzulu", "Phalombe"],
    ["Chitipa", "Karonga"],
    ["Dedza", "Lilongwe"],
    ["Dedza", "Ntcheu"],
    ["Dowa", "Lilongwe"],
    ["Dowa", "Ntchisi"],
    ["Karonga", "Rumphi"],
    ["Kasungu", "Lilongwe"],
    ["Kasungu", "Mzimba"],
    ["Lilongwe", "Mchinji"],
    ["Lilongwe", "Salima"],
    ["Machinga", "Zomba"],
    ["Machinga", "Balaka"],
    ["Mangochi", "Balaka"],
    ["Mangochi", "Salima"],
    ["Mulanje", "Phalombe"],
    ["Mulanje", "Thyolo"],
    ["Mwanza", "Neno"],
    ["Mzimba", "Nkhata Bay"],
    ["Mzimba", "Rumphi"],
    ["Nkhata Bay", "Nkhotakota"],
    ["Nkhotakota", "Salima"],
    ["Nsanje", "Chikwawa"],
    ["Ntcheu", "Balaka"],
    ["Ntchisi", "Nkhotakota"],
    ["Phalombe", "Mulanje"],
    ["Salima", "Nkhotakota"],
    ["Zomba", "Machinga"],
  ],
};

const layout = new GraphLayout(graphData);
layout.optimizeLayout();
console.log("Optimized positions:", layout.getOptimizedPositions());