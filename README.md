# Malawi District Graph Layout Visualization

This project visualizes the connections between Malawi’s 28 districts using a graph layout optimization algorithm. It takes initial node positions and adjacency data, applies a **force-directed layout algorithm**, and outputs a clean, optimized layout with minimal node overlap and edge crossings.


## 📌 Objectives

- Visualize Malawi's district connections as a graph
- Use physics-inspired layout algorithm to reduce clutter
- Maintain all coordinates within a 1x1 unit square
- Optional: Render the graph in an HTML canvas for interactive viewing


## ⚙️ How It Works

We used a **force-directed layout algorithm** (like Fruchterman-Reingold):

- Nodes (districts) repel each other to avoid overlap
- Edges act as springs to pull connected nodes closer
- The system simulates these forces over several iterations
- Final positions are normalized to fit inside a 1x1 unit square


## Requirements
1. node 12+
2. Browser


## How To Run It
1. To view console output of list of districts with optimized (X, Y) coordinates:
```
  node GraphOptimization.js
```
2. Open graph-visualization.html file with the browser of your choice to view a visual rendering showing nodes (districts) as points and edges as lines, with minimal overlap and clear connections (has both original and optimized visual layouts).

