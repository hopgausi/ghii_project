function drawGraph(canvasId, nodeData, edges, title) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const padding = 30; 
  const drawSize = size - 2 * padding;

  ctx.clearRect(0, 0, size, size);
  if (title) {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(title, size / 2, 5);
  }
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(
      nodeData[a].x * drawSize + padding,
      nodeData[a].y * drawSize + padding
    );
    ctx.lineTo(
      nodeData[b].x * drawSize + padding,
      nodeData[b].y * drawSize + padding
    );
    ctx.stroke();
  });

  ctx.fillStyle = "blue";
  ctx.font = "8px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  for (let node in nodeData) {
    const x = nodeData[node].x * drawSize + padding;
    const y = nodeData[node].y * drawSize + padding;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    const labelX = x + 5;
    const labelY = y;
    const textWidth = ctx.measureText(node).width;
    const finalLabelX = Math.min(labelX, size - textWidth - 5);
    ctx.fillText(node, finalLabelX, labelY);
    ctx.fillStyle = "blue";
  }
}

function createGraphVisualization(graphData, canvasId1, canvasId2) {
  const originalPositions = {};
  graphData.nodes.forEach(node => {
    originalPositions[node.id] = { x: node.x, y: node.y };
  });
  drawGraph(canvasId1, originalPositions, graphData.edges, "Original Layout");
  const layout = new GraphLayout(graphData);
  layout.optimizeLayout();
  const optimizedPositions = layout.getOptimizedPositions();
  drawGraph(canvasId2, optimizedPositions, graphData.edges, "Optimized Layout");
}
