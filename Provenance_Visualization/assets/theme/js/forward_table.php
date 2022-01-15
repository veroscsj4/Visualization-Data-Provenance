<!DOCTYPE html>
<meta charset="utf-8">
<style>
  .links line {
    stroke: #aaa;
    stroke-width: 5px;
  }

  .nodes circle {
    pointer-events: all;
    stroke: none;
  }
</style>
<svg width="600" height="300"></svg>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="https://requirejs.org/docs/release/2.3.5/minified/require.js"></script>
<script>
var nameOfOperatorToSearch;
var dataWithSourceAndTarget = [];
var links = [];
var nodes = [];
var outputOfEachOperators = [];
var nameOfAllOperator = [];



function getDataLinks(outputOfEachOperators){
  console.log(outputOfEachOperators.length)
  var current_forward_operator = "none";

  for(var i = 0 ; i < outputOfEachOperators.length ; i++){

    for(var k = 0 ; k< outputOfEachOperators[i].length; k++ ){

      nodes.push(outputOfEachOperators[i][k]);
      if(outputOfEachOperators[i][k].hasOwnProperty('operator')){
        var operator = outputOfEachOperators[i][k].operator;

        current_forward_operator = getNeighbourOperator(operator, "forward");
        if(current_forward_operator != "false"){
          links.push({"source":operator , "target":current_forward_operator});
        }else{
          links.push({"source":operator , "target":"none"});
        }
      }
    }
  }
  dataWithSourceAndTarget["nodes"] = nodes;
  dataWithSourceAndTarget["links"] = links;
  var json = JSON.stringify(dataWithSourceAndTarget);
  fs =42;
  var fs = require('fs');
  fs.writeFile("../../../data/new_structure.json", js, function(err, result) {
      if(err) console.log('error', err);
  });



}
function get_Data(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = get_Data(theObject[i]);
        }
    }
    else
    {
        for(var prop in theObject) {
            //console.log(prop + ': ' + theObject[prop]);
            if(prop == 'children') {
                //console.log(prop + ': ' + theObject[prop]);
                outputOfEachOperators.push(theObject[prop]);
                if(theObject[prop] == 1) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                result = get_Data(theObject[prop]);
        }
    }
    return result;
}
function getNeighbourOperator(operator, typeOfTracing){
  var result = "false";
  if(typeOfTracing === "forward"){
    var x = 0;
    var z = 0 ;
    for(var i = 0; i<nameOfAllOperator.length; i++){
      if(nameOfAllOperator[i] === operator){
        x = i;
      }
    }
    x = x + 1;
    if(x < nameOfAllOperator.length){
      return nameOfAllOperator[x];
    }else if(x => nameOfAllOperator.length){
      return result;
    }
  }
  if(typeOfTracing === "backward"){
    var y = 0;
    for(var i = 0; i<nameOfAllOperator.length; i++){
      if(nameOfAllOperator[i] === operator){
        y = i;
      }
    }
    y = y - 1;
    if(y < 0){
      return result;
    }else{
      return nameOfAllOperator[y];
    }
  }

}
function getObject(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getObject(theObject[i]);
        }
    }
    else
    {
        for(var prop in theObject) {
            //console.log(prop + ': ' + theObject[prop]);
            if(prop == 'name') {
                //console.log(prop + ': ' + theObject[prop]);
                nameOfAllOperator.push(theObject[prop]);
                if(theObject[prop] == 1) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                result = getObject(theObject[prop]);
        }
    }
    return result;
}
$(document).ready(function(){
  var graph;
  $.getJSON("../../../data/data.json", function(data){
    graph = get_Data(data);
    getDataLinks(outputOfEachOperators);

  });
  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
      return d.id;
    }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("y", d3.forceY())

  /*var graph = {
    "nodes": [{
      "id": 0
    }, {
      "id": 1
    }, {
      "id": 2
    }, {
      "id": 3
    }, {
      "id": 4
    }, {
      "id": 5
    }],
    "links": [{
        "target": 5,
        "source": 1
      }, {
        "target": 2,
        "source": 0
      }, {
        "target": 3,
        "source": 4
      }, {
        "target": 1,
        "source": 2
      }, {
        "target": 1,
        "source": 0
      },

    ]
  };*/

  var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line");

  var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 10);

  node.append("title")
    .text(function(d) {
      return d.id;
    });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {

    var k = 6 * simulation.alpha();

    // Push sources up and targets down to form a weak tree.
    link
      .each(function(d) {
        d.source.y -= k, d.target.y += k;
      })
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });

  }

})


</script>
