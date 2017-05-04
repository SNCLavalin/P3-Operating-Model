// ************** Generate the tree diagram   *****************
　
　
//Calculate total nodes, max label length
var totalNodes = 0;
var maxLabelLength = 0;
　
//Panning variables
var panSpeed = 200;
var panBoundary = 20; // Within 20px from edges will pan when dragging
　
　
//Padding for Network
var 	margin = {top: 20, right: 120, bottom: 20, left: 120},
  	width = 2500 - margin.right - margin.left,
  	height = 1400 - margin.top - margin.bottom;
　
//Timer for duration
var 	i = 0,
  	duration = 750;
　
//Root of the tree
var	root;
　
//size of the diagram
var viewerWidth = $(document).width();
var viewerHeight = $(document).height();
　
//Tree layout. Assigns and calculates the data required for the nodes and links for the tree
var tree = d3.layout.tree().size([viewerHeight, viewerWidth]);
　
　
//Declares variable that will draw the lines between nodes (define a d3 diagonal projection for use by the node paths later on.)
//Swap d.x and d.y to make tree horizontal [1/2]
var diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
　
　
　
// load the external data
d3.csv("treeData.csv", function(error, data) {
　
  if (error) throw error;
　
  // *********** Convert flat data into a nice tree ***************
  // create a name: node map
  var dataMap = data.reduce(function(map, node) {
    	map[node.name] = node;
    	return map;
  }, {});
　
  // create the tree array
  var treeData = [];
  data.forEach(function(node) {
    // add to parent
    var parent = dataMap[node.parent];
    if (parent) {
      // create child array if it doesn't exist
      (parent.children || (parent.children = []))
        // add node to child array
        .push(node);
    } else {
      // parent is null or missing
      treeData.push(node);
    }
  });
　
  root = treeData[0];
  root.x0 = viewerHeight / 2;
  root.y0 = viewerWidth / 2;
	
  //collapse all the nodes by default when page is opened
  function collapse(d) {
    		if (d.children) {
			d.all_children = d.children;
      			d._children = d.children;
      			d._children.forEach(collapse);
      			d.children = null;
			d.hidden = true;
    		}
  	}


  root.all_children = root.children;
  root.children.forEach(collapse);
  root.children.forEach(function(d) {d.hidden = false;});
  root.hidden = false;
  
  update(root);
  centerNode(root);
});
　

　
　
//A recursive helper function for performing some setup by walking through all nodes
　
function visit(parent, visitFn, childrenFn) {
	if (!parent) return;
　
	visitFn(parent);
　
	var children = childrenFn(parent);
	if (children) {
		var count = children.length;
		for (var i = 0; i < count; i++) {
			visit(children[i], visitFn, childrenFn);
		}
　
	}
　
}
　
　
// Call visit function to establish maxLabelLength
    visit(root, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);
　
    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });
　
　
// Pan function
　
    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }
　
// Define the zoom function for the zoomable tree
　
    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
　
// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
　
//Define the baseSvg, attaching a class for styling and the zoomListener
//Appends SVG working area to the div with the class ".chart", gives height and width,
var baseSvg = d3.select("#chart").append("svg")
  .attr("width", viewerWidth)
  .attr("height", viewerHeight)
  .attr("class", "overlay")
  .call(zoomListener);
  
　
//Moves the SVG canvas with the margins set earlier
//Creates group elements "g" which contains all the objects (nodes/links/text etc)
var svgGroup = baseSvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
　
　
　
　
　
　
function update(source) {
　
  //Runs the tree layout, returning the array of nodes associated with the specified root node
  var nodes = tree.nodes(root).filter(function(d) { return !d.hidden; }).reverse(),
    //Given the specified array of nodes, such as those returned by nodes,
    //returns an array of objects representing the links from parent to child for each node.
    links = tree.links(nodes);
　
  // //Spacing for each node. Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 275; });
　
  //Declare node variable, so that each node has its own unique ID
  var node = svgGroup.selectAll("g.node")
    .data(nodes, function(d) { return d.id || (d.id = ++i); });
　
　
  //Declares nodeEnter to the action of appending a node a particular position
  //Swap d.x and d.y to make it horizontal [2/2]
  //Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {return "translate(" + source.y0 + "," + source.x0 + ")"; });
    
　
  //Appends circle to each node; radius 10, white fill
  //Other attributes of nodes can be appended (color,level,etc)
  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("stroke", function(d) { return d.LINE; })
    .style("fill", function(d) {return d._children ? "lightsteelblue" : "#fff"; })
    .on("click", function(d) {
       click(d);
       div.transition()
           .duration(1)
	   .style("opacity",0)
	   .style('pointer-events', 'none'); 
      })
      // add tool tip 
      .on("mouseover", function(d) {
	div.transition()
	  .duration(duration)
	  .style("opacity", .9)
	  .style('pointer-events', 'auto');
        div.html(
            //"Index: ".bold() + d.name + "<br/>" +  "<br/>" +
            //"Name: ".bold() + d.LABEL + "<br/>" +  "<br/>" +
            "Description: ".bold() + "<br/>" + d.DESCRIPTION + "<br/>" + "<br/>" +
            "Lead: ".bold() + d.LEAD + "<br/>" + "<br/>" +
	    "Participants: ".bold() + "<br/>" + d.PARTICIPANTS.split(";").join("<br/>") + "<br/>" + "<br/>" +
  	    '<a href=' + d.LINK + ' target=' + d.LINK_TYPE + '>' + d.HYPERLINK  +"</a>"
            )
          .style("left", (d3.event.pageX + 18) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        div.transition()
          .duration(1)
          .style("opacity", 0)
	  .delay(75)
	  .style('pointer-events', 'none');
        });
　
　
	
   //Appends text to each node; sets distance away text is
   nodeEnter.append("text")
    //Calculate y-location of text, where if it has children, make it -15, else make it +15
    .attr("y", function(d) {return d.children || d._children ? -5 : -4; })
    //Calculate x-location of text, where if it has children, make it +15, else make it -15
    .attr("x", function(d) {return d.children || d._children ? -15 : 15; })
    .attr("text-anchor", function(d) {return d.children || d._children ? "end" : "start"; })
    //Where to source the text from
    .text(function(d) { return d.LABEL; })
    //Text styling
    .style("fill-opacity", 1e-6);
　
    //add the tooltip
   var div = d3.select("#chart").append("div")
       .attr("class", "tooltip") // apply the "tooltip" class
       .style("opacity",0) // set to invisible
       // add tool tip 
	.on("mouseover", function(d) {
	div.transition()
	  .duration(duration)
	  .style("opacity", .9)
          .style('pointer-events', 'auto');
        div .html(
            //"Index: ".bold() + d.name + "<br/>" +  "<br/>" +
            //"Name: ".bold() + d.LABEL + "<br/>" +  "<br/>" +
            "Description: ".bold() + "<br/>" + d.DESCRIPTION + "<br/>" + "<br/>" +
            "Lead: ".bold() + d.LEAD + "<br/>" + "<br/>" +
	    "Participants: ".bold() + "<br/>" + d.PARTICIPANTS.split(";").join("<br/>") + "<br/>" + "<br/>" +
	    '<a href=' + d.LINK + ' target=' + d.LINK_TYPE + '>' + d.HYPERLINK  +"</a>"                           
	    )
          .style("left", (d3.event.pageX + 18) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        div.transition()
          .duration(1)
          .style("opacity", 0)
          .delay(1)
          .style('pointer-events', 'none');
        });
    
　
  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
      });
　
  nodeUpdate.select("circle")
    .attr("r", 10)
    .style("fill", function(d) { 
	  return d._children ? "lightsteelblue" : "#fff"; });
　
  nodeUpdate.select("text")
    .style("fill-opacity", 1);
　
  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) { return "translate(" + source.y + 
                                             "," + source.x + ")"; })
    .remove();
　
  nodeExit.select("circle")
    .attr("r", 1e-6);
　
  nodeExit.select("text")
    .style("fill-opacity", 1e-6);
　
  // //Draws links(edges) to nodes
  var link = svgGroup.selectAll("path.link")
    .data(links, function(d) { return d.target.id; });
　
  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .style("stroke", function(d) { return d.target.LINE; })
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
    });
　
  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal);
　
  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
    })
    .remove();
　
  // Stash the old positions for transition.
  nodes.forEach(function(d) {
  d.x0 = d.x;
  d.y0 = d.y;
  });
}
　
// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of data
　
  function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 3.1;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }
　
　
　
// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
        if (d._children) {
            d._children.forEach(function(n) { n.hidden = true; });

            if (d.parent) {
                d.parent.children = d.parent.all_children;
                d.parent.children.forEach(function(n) {
                    n.hidden = false;
                });
            }
        }
	
	update(d);
	if (d != root ){ centerNode(d.parent); }
    	
	
	
	
    } else {
        d.children = d._children;
        d._children = null;
        if (d.children) {
            d.children.forEach(function(n) { n.hidden = false; });

            if (d.parent) {
                d.parent.children = [d,];
                d.parent.children.filter(function(n) { return n !== d; }).forEach(function(n) {
                    n.hidden = true;
                });
            }
        }

	update(d);
    	centerNode(d);
	
    }
    
    
}
