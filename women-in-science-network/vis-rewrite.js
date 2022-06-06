// set dimensions for graph
var w = window.innerWidth,
    h = window.innerHeight;

// set viewBox dimensions for SVG
var svg = d3.select("div#container")
  .append("svg")
  .attr("preserveAspectRatio", "xMidYMid meet")
  .attr("viewBox", `0 0 ${w} ${h}`)
  .classed("svg-content", true);

svg.append('rect')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', 'transparent');

// set color palette for graph
var color = d3.scaleOrdinal(d3.schemeCategory10);

// configure physics simulation for network animation
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(75))
    .force("charge", d3.forceManyBody().strength(-50).distanceMax(350))
    .force("center", d3.forceCenter(w / 2, h / 2))
    // set collisions to try to separate out nodes more
    // .force("collide", d3.forceCollide(5).strength(30).iterations(1));
    // just dump the nodes
    .force("collide", d3.forceCollide().iterations(1));


    // add fisheye
    // var fisheye = d3.fisheye.circular()
    //   .radius(75)
    //   .distortion(2);

// create single container for visualization

var container = svg.append('g');

// Initialize links, nodes and edges

var link = container.append("g")
  .attr('class', 'links')
  .selectAll('.link');

var node = container.append('g')
  .attr('class', 'nodes')
  .selectAll('.node');

var label = container.append('g')
  .attr('class', 'labels')
  .selectAll('.label');

// load JSON

d3.json("wis.json", function(error, graph) {

  var nodes = graph.nodes
  var links = graph.links
  
})
