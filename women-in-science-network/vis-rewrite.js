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

var graph

var link = container.append("g")
  .attr('class', 'links')
  .selectAll('.link');

var node = container.append('g')
  .attr('class', 'nodes')
  .selectAll('.node')

var label = container.append('g')
  .attr('class', 'labels')
  .selectAll('.label');

// load JSON

d3.json("wis.json", function(error, g) {
  var nodes = g.nodes;
  var links = g.links;

  graph = g;

  update();
});

function update() {
  // update
  node = node.data(graph.nodes, function(d) { return d.id; });
  // exit
  var sizeScale = d3.scaleLinear()
  .range([8, 30]);

  var maxDegree = d3.max(graph.nodes, function(d) { return d.degree; })
  var minDegree = d3.min(graph.nodes, function(d) { return d.degree; })
  sizeScale.domain([minDegree, maxDegree]);
  node.exit().remove();
  // enter
  var nodeEnter = node.enter().append('circle')
    .attr('class', 'node')
    .attr("r", function(d) { return (2 * sizeScale(d.degree)) / Math.sqrt(2); })
    .attr('fill', function(d) { return color(d.modularity); })
    .on('mouseover.fade', fade(0.1))
    .on('mouseout.fade', fade(1))
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
    /* can append title here */

    // enter and update
    node = node.merge(nodeEnter);

    // update
    link = link.data(graph.links);
    // exit
    link.exit().remove()
    // enter
    linkEnter = link.enter().append('line')
      .attr('class', 'link');

    link = link.merge(linkEnter);

    // update simulation nodes and links
    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    simulation.alpha(1).alphaTarget(0).restart();

    // parameters for node filtering, courtesy of Alejandro Suarez: https://bl.ocks.org/almsuarez/4333a12d2531d6c1f6f22b74f2c57102
  const linkedByIndex = {};
  graph.links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  }

  function fade(opacity) {
    return d => {
      node.style('stroke-opacity', function (o) {
      const thisOpacity = isConnected(d, o) ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;
    });
    link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
    };
  }
};


// add zoom capabilities

var zoom = d3.zoom();

svg.call(zoom.on('zoom', zoomed))

// override default behavior to zoom on double click
svg.on("dblclick.zoom", null)

function zoomed() {
          container.attr("transform", "translate(" + d3.event.transform.x + ", " + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
        }

// parameters for drag
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

// control simulation placement
function ticked() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}
