function drawGraph(canvasId, nodeData, edges, title) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const padding = 30; // Padding to ensure labels don't get cut off
  const drawSize = size - 2 * padding;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Draw title if provided
  if (title) {
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(title, size / 2, 5);
  }

  // Draw edges
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

  // Draw nodes and labels
  ctx.fillStyle = "blue";
  ctx.font = "8px Arial";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  for (let node in nodeData) {
    const x = nodeData[node].x * drawSize + padding;
    const y = nodeData[node].y * drawSize + padding;

    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Draw label with smart positioning to avoid overlap
    ctx.fillStyle = "black";
    const labelX = x + 5;
    const labelY = y;

    // Ensure label stays within canvas bounds
    const textWidth = ctx.measureText(node).width;
    const finalLabelX = Math.min(labelX, size - textWidth - 5);

    ctx.fillText(node, finalLabelX, labelY);
    ctx.fillStyle = "blue";
  }
}

// Helper function to create a visualization with before/after comparison
function createGraphVisualization(graphData, canvasId1, canvasId2) {
  // Draw original layout
  const originalPositions = {};
  graphData.nodes.forEach(node => {
    originalPositions[node.id] = { x: node.x, y: node.y };
  });
  drawGraph(canvasId1, originalPositions, graphData.edges, "Original Layout");

  // Create and optimize layout
  const layout = new GraphLayout(graphData);
  layout.optimizeLayout();
  const optimizedPositions = layout.getOptimizedPositions();
  
  // Draw optimized layout
  drawGraph(canvasId2, optimizedPositions, graphData.edges, "Optimized Layout");
}
