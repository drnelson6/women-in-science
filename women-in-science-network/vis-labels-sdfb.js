// set dimensions for graph
// var svg = d3.select("svg"),
//      w = +svg.attr("width"),
//      h = +svg.attr("height")


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

// load JSON

d3.json("wis.json", function(error, graph) {
  if (error) throw error

  // initialize the links. Append to container for zoom to work
  var link = container.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  // create tooltip for hover effect for names
  // set style in CSS
  // var tooltip = d3.select("body")
  //   .append("div")
  //   .attr("class", "tooltip");

  var biobox = d3.select("body")
    .append("div")
    .attr("class", "biobox")
    .on("click", function(d) {
      d3.select(this)
        .transition()
        .style("visibility", "hidden");
     })

  // Create size scale for sizing nodes proportionally
  var sizeScale = d3.scaleLinear()
  .range([8, 30]);

  var maxDegree = d3.max(graph.nodes, function(d) { return d.degree; })
  var minDegree = d3.min(graph.nodes, function(d) { return d.degree; })
  sizeScale.domain([minDegree, maxDegree]);

  // Initialize the nodes
  var node = container.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")

    // hover effect for names
    // .on("mouseover", function(d) {
    //   return tooltip.style("visibility", "visible").text(d.name);
    // })
    // .on("mousemove", function(){return tooltip.style("top",
    //   (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
    // .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
    // make bios appear on click
    .on("click", function(d, i) {
      biobox.html(d.bio)
        // .style("left", d3.select(this).attr("cx") + "px")
        // .style("top", d3.select(this).attr("cy") + "px")
        .style("visibility", "visible");
    })
    // .on("click", function(d, i) {
    //   return biobox.style("visibility", "visible").html(d.bio);
    // })
    // add click transformation
    // .on('mouseover', function(d, i){
    //   d3.select(this)
    //   .transition()
    //   .attr('fill', '#ff0000');
    // })
      // Make nodes proportional to number of degrees
      .attr("r", function(d) { return (2 * sizeScale(d.degree)) / Math.sqrt(2); })
      // Set fill color based on community dete
      .attr("fill", function(d) { return color(d.modularity); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  var label = container.append("g")
    .attr("class", "labels")
    .selectAll('.label')
    .data(graph.nodes)
    .enter().append('label')

  // placeholder rect to reposition later
  label.append('rect')

  // get text. Data was already associated with label above
  label.append('text')
    // .selectAll('.label')
    // .data(graph.nodes)
    // .enter().append('text')
    .text( function (d) {
      return d.name;
  });

  label.selectAll('rect')
      .attr("x", function(d) {return this.parentNode.getBBox().x;})
  /*d3.selectAll('label text').each(function(d, i) {
     d.labelBBox = this.getBoundingClientRect()
     console.log('I exist!')
     console.log(d.labelBBox);
  });

  // set position for rect based on BBox
  d3.selectAll("label rect")
    .attr("x", function(d) {
      return 0 - d.labelBBox.width / 2;
    })
    .attr("y", function(d) {
      return 0 + 3 - d.labelBBox.height;
    })
    .attr('width', function(d) {
      return d.labelBBox.width
    })
    .attr('height', function(d) {
      return d.labelBBox.height
    });*/

  // get bounding box for text


    // .on("mouseover", function(d) {
    //   return tooltip.style("visibility", "visible");
    // })
  // initialize fisheye effect for nodes and links
  // svg.on("mousemove", function() {
  //   fisheye.focus(d3.mouse(this));

  //  node.each(function(d) { d.fisheye = fisheye(d); })
  //    .attr("cx", function(d) { return d.fisheye.x; })
  //    .attr("cy", function(d) { return d.fisheye.y; })
  //    .attr("r", function(d) { return d.fisheye.z * 4.5; });

  //   link.attr("x1", function(d) { return d.source.fisheye.x; })
  //       .attr("y1", function(d) { return d.source.fisheye.y; })
  //       .attr("x2", function(d) { return d.target.fisheye.x; })
  //       .attr("y2", function(d) { return d.target.fisheye.y; })
  // });
  // add hover text to nodes
  // node.append("title")
  //     .text(function(d) { return d.name; });


  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        label.attr("transform", function(d) {
              return "translate(" + (d.x) + "," + (d.y + 2.5) + ")"
            });
  }



});



//add zoom capabilities

var zoom = d3.zoom();

svg.call(zoom.on('zoom', zoomed))

function zoomed() {
          container.attr("transform", "translate(" + d3.event.transform.x + ", " + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
        }

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
