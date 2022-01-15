
var nameOfOperatorToSearch;
var dataWithSourceAndTarget = [];
var outputOfEachOperators = [];
$(document).ready(function(){

  // Set the dimensions and margins of the diagram
  var margin = {top: 20, right: 90, bottom: 30, left: 90},
      width = 960 - margin.left - margin.right,
      height = $(document).height() - margin.top - margin.bottom;
      //height = 600 - margin.top - margin.bottom;

  var colorScale = d3.scaleLinear()
      .domain([0, 1])
      .range(['red', 'green']);
  var widthScale = d3.scaleLinear()
      .domain([1,80])
      .range([1, 10]);

// ****************** Zoomable ***************************

function zoom() {
    svg.attr("transform", d3.event.transform);
}
// Define the zoomListener which calls the zoom function on the "zoom"
// event constrained within the scaleExtents
var zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);
  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3.select(".vs-graph").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom + 300)
      .attr("class", "vs-svg-for-directed-graph")
    .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")")
    .call(zoomListener);
      /*.attr("transform", "translate("
            + margin.left + "," + margin.top + ")");*/

  var i = 0,
      duration = 750,
      root;
  // show information about data by mouseover
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var content;
      if(d.data.hasOwnProperty("name")){
        //console.log("hier 0");
        content =  "<strong>Operator Name:</strong> <span>" + d.data.name + "</span>";
      }
      if(d.data.hasOwnProperty("children")){
        //console.log("hier 5" + d.data.children.length);
        var count_children = d.data.children.length;
        content +=  "<br /><strong>Number of processed data:</strong> <span>" + count_children  + "</span>";
      } else{

        content += "<strong>Information about Node</strong>";
        if(d.data.hasOwnProperty("operator_number")){
          //console.log("hier 1"+ d.data.operator_number);
          content += "<br /><strong>Operator Number:</strong> <span>" + d.data.operator_number + "</span>";
        }
        if(d.data.hasOwnProperty("operator")){
          //console.log("hier 2"+ d.data.operator);
          content += "<br /><strong>Operator Name:</strong> <span>" + d.data.operator + "</span>";
        }
        if(d.data.hasOwnProperty("word")){
          //console.log("hier 3"+ d.data.word);
          content += "<br /><strong>Word:</strong> <span>" + d.data.word + "</span>";
        }
        if(d.data.hasOwnProperty("id")){
          //console.log("hier 4", d.data.id);
          content+= "<br /><strong>ID:</strong> <span>" + d.data.id + "</span>";
        }
      }
      if (content.length > 0 ){
        return content;
      }else{
        return -1;
      }
    })

  svg.call(tip);
  // declares a tree layout and assigns the size
  var treemap = d3.tree().size([height, width]);
  $.getJSON("data/data.json", function(data){
    get_Data(data);
    getDataLinks(outputOfEachOperators);

  });

  d3.json("data/data.json",function(error, treeData){
    // Assigns parent, children, height, depth
    //console.log("correct");
    root= d3.hierarchy(treeData, function(d) {
        return d.children;
    });
    //console.log("root", root.children[1]);
    root.x0 = height / 4;
    root.y0 = 0;

    // Collapse after the second level
    root.children.forEach(collapse);

    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }

    function update(source) {

      // Assigns the x and y position for the nodes
      var treeData = treemap(root);

      // Compute the new tree layout.
      var nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);

      // ****************** Sort Nodes section ***************************

      let processedOperator = [];
      //console.log(count())
      nodes.forEach(function(d, i, array){
        if(d.hasOwnProperty("children")){
          d.y = d.depth * 180;
          d.x = 275;
          if(i==array.length -1 ){
            emptyArray(processedOperator);
          }
        }else{
          //checkExistElement(nameOfAllOperator, d.data.operator);
          var x = checkExistElement(processedOperator, d.data.operator);
          if(x == false){ //Cordinate for the first node
            addElementToArray(processedOperator, d.data.operator);
            //console.log("depth= "+ d.depth + " d.y = " + d.y + " d.x=" + d.x + " d.word= " + d.data.word);
            d.y= (d.depth * 90) + (90 * (d.depth -1)); // example, d.depth =1, 90 + 0 = 90, 180 + 90 = 270
            d.x = 275;
            if(i==array.length -1 ){
              emptyArray(processedOperator);
            }
          }else{
            //d.y = d.depth * 180;
            d.y= (d.depth * 90) + (90 * (d.depth -1));
            if(i==array.length -1 ){
              emptyArray(processedOperator);
            }
          }
        }
      });


      // ****************** Nodes section ***************************
      function centerNode(source) {
          t = d3.zoomTransform(svg.node());
          scale = t.x;
          y = source.x0;
          console.log("source X0 =" + source.x0);
          x = scale;
          //x = x * scale + viewerWidth / 2;
          y = - y * t.k + height / 2;
          d3.select('g').transition()
              .duration(duration)
              .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")")
              .on("end", function(){
                svg.call(zoomListener.transform, d3.zoomIdentity.translate(x,y).scale(t.k));
              });
      }

      // Update the nodes

      var node = svg.selectAll('g.node')
          .data(nodes, function(d) { return d.id || (d.id = ++i);  })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

      // Enter any new modes at the parent's previous position.
      let mainNode =[];
      var nodeEnter = node.enter().append('g')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .attr("class", function(d, i, array){
          if(d.hasOwnProperty("children")){
            return "operator node "
            + "operator("+d.data.name+")";
          }else{
            var x = checkExistElement(mainNode, d.data.operator);
            var operator;
            var id;
            var parent_id;
            var main = "undefined";
            if(x == false){
              addElementToArray(mainNode, d.data.operator);
              main = "main";
              if(i==array.length-1){
                emptyArray(mainNode);
              }
            }else{
              main = "undefined";
            }
            if(typeof d.data.operator != 'undefined'){
              operator = "operator("+d.data.operator+")";
            }if(d.hasOwnProperty("id")){
              id = "id("+d.data.id+")";
            }if(typeof d.data.parent_id != 'undefined'){
              parent_id = "parent_id("+d.data.parent_id+")";
            }
            if(main != 'undefined' && typeof operator != 'undefined' && typeof id != 'undefined' && typeof parent_id != 'undefined'){
              return "data node "
              + "main "
              + operator + " "+ id + " " + parent_id;
            }else{
              if(main != 'undefined' && typeof id != 'undefined' && typeof parent_id == 'undefined' && typeof operator != 'undefined'){
                return "data node "
                + "main "
                + operator + " "+ id;
              }else{
                if( main === 'undefined' && typeof id != 'undefined' && typeof parent_id == 'undefined' && typeof operator != 'undefined'){
                  return "data node "
                  + operator + " "+ id;
                }
              }
            }

          }
        })
        .attr("id", function(d, i, array){
          if(d.hasOwnProperty("children")){
            return "operator "
            + d.data.name;
          }else{
            var x = checkExistElement(mainNode, d.data.operator);
            if(x == false){
              addElementToArray(mainNode, d.data.operator);
              if(i==array.length-1){
                emptyArray(mainNode);
              }
              return "data-produced-by-"+d.data.operator;
            }else{
              if(i==array.length-1){
                emptyArray(mainNode);
              }
              return "data-produced-by-"+d.data.operator;
            }
          }
        })
        .attr("display", function(d){
          if(d.hasOwnProperty("children")){
            return "block";
          }else{
            return "none";
          }
        })
        .on("click", click);

        //$(".operator").on("click", click);

      // Add Circle for the nodes
      var symbolGeneratorSquare = d3.symbol()
        .type(d3.symbolSquare)
        .size(180);
      var pathDatSquare = symbolGeneratorSquare();

      var symbolGeneratorDiamond = d3.symbol()
      	.type(d3.symbolDiamond)
      	.size(180);
      var pathDataDiamond = symbolGeneratorDiamond();

      var symbolGeneratorCircle = d3.symbol()
        .type(d3.symbolCircle)
        .size(180);
      var pathDataCircle = symbolGeneratorCircle();

  // Give shape, if has children then diamond, else circle (is data)

      nodeEnter.append("path")
        .style("stroke", "black")
        .style("fill", "white")
        .attr("d", function(d) {
          if(d.data.name == "input"){
            return pathDataCircle;
          }else{
            if(d.hasOwnProperty("children") && d.name != "input"){
              return pathDataDiamond;
            }if(!d.hasOwnProperty("children") && d.name != "input"){
              return pathDataCircle;
            }
          }
        })
        .style("fill", function(d) {
            return d._children ? "#1c9be3" : "#DDDDDD"; //secondary color
         })

      // Add labels for the nodes
      nodeEnter.append('text')
          .attr("dy", "2em")
          .attr("class", function(d){
            if(d.hasOwnProperty("children")){
              return "uk-h6 uk-text-primary";
            }
          })
          .attr("x", function(d) {
              return d.children || d._children ? 5 : 13;
          })
          .attr("text-anchor", function(d) {
              return d.children || d._children ? "end" : "start";
          })
          .text(function(d) { if(d.data.name )return d.data.name;
          else{
            return d.data.word;
          }  })
          .attr("display", function(d){
            if(d.data.children){
              return "block";
            }else{
              return "none";
            }
          });

      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      let array =[]
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
          if(d.hasOwnProperty("children")){
            d.y = d.depth * 180;
            d.x = 275;
            return "translate(" + d.y + "," + d.x + ")";
          }else{
            var x = checkExistElement(array, d.data.operator);
            if(x == false){ //Cordinate for the first node
              addElementToArray(array, d.data.operator);
              //console.log("depth= "+ d.depth + " d.y = " + d.y + " d.x=" + d.x + " d.word= " + d.data.word);
              d.y= (d.depth * 90) + (90 * (d.depth -1)); // example, d.depth =1, 90 + 0 = 90, 180 + 90 = 270
              d.x = 275;
              return "translate(" + d.y + "," + d.x + ")";
            }else{
              //d.y = d.depth * 180;
              d.y= (d.depth * 90) + (90 * (d.depth -1));
              return "translate(" + d.y + "," + d.x + ")";
            }
          }

         });

      // Update the node attributes and style
      nodeUpdate.select('path')
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');


      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {

            return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('path')
        .attr('r', 1e-6);

      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);

      // ****************** links section ***************************

      // Update the links...
      var link = svg.selectAll('path.link')
          .data(links, function(d) { return d.id; })
      		.style('stroke-width', function(d){
            return widthScale(d.data.value)
          });

      // Enter any new links at the parent's previous position.
      let  mainLink =[];
      var linkEnter = link.enter().insert('path', "g")
          .attr("class", function(d, i, array){
            if(d.hasOwnProperty("children")){
              return "link "
              + d.data.name;
            }else{
              var x = checkExistElement(mainLink, d.data.operator);
              if(x == false){
                addElementToArray(mainLink, d.data.operator);
                if(i==array.length-1){
                  emptyArray(mainLink);
                }
                return "link main "
                + "link-produced-by-"+d.data.operator;
              }else{
                return "link "
                + "link-produced-by-"+d.data.operator;
              }
            }
          })
          .attr("id", function(d, i, array){
            if(d.hasOwnProperty("children")){
              return "link "
              + d.data.name;
            }else{
              return "link-produced-by-"+d.data.operator;
            }
          })
          .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            console.log(source.x0 , source.y0);
            var u = {y: source.y0, x: source.x0}
            return diagonal(o, o);
          })
          .attr("display", function(d){
            if(d.hasOwnProperty("children")){
              return "block";
            }else{
              return "none";
            }
          })
      		.style('stroke-width', function(d){
            return widthScale(d.data.value)
          });

      // UPDATE
      var linkUpdate = linkEnter.merge(link);

      // Transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', function(d){ return diagonal(d, d.parent) });

      // Remove any exiting links
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
      		.style('stroke-width', function(d){
            return widthScale(d.data.value)
          })
          .remove();

      // Store the old positions for transition.
      nodes.forEach(function(d){

        if(d.hasOwnProperty("children")){
          d.y = d.depth * 180;
          d.x = 275;
          d.x0 = d.x;
          d.y0 = d.y;

        }else{
          var x = checkExistElement(array, d.data.operator);
          if(x == false){ //Cordinate for the first node
            addElementToArray(array, d.data.operator)
            d.y= (d.depth * 90) + (90 * (d.depth -1)); // example, d.depth =1, 90 + 0 = 90, 180 + 90 = 270
            d.x = 275;
            d.x0 = d.x;
            d.y0 = d.y;

          }else{
            //d.y = d.depth * 180;
            d.x0 = d.x;
            d.y0 = d.y;

            //return "translate(" + d.y + "," + d.x + ")";
          }
        }
      });

      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {

        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`

        return path
      }

      function click(d) {
        if(d.hasOwnProperty("children")){
          if (d.children) { // have children
              d._children = d.children; // save the his children
              d.children = null; // delet his children
            } else { //no children
              d.children = d._children;
              d._children = null;
            }
          update(d);
        }
      }
      $("#vs-displayGraph").on("click", function(){
        $("svg.vs-svg-for-directed-graph").css("visibility", "visible");
      })
      //Show rest of data
      $(".data.node.main").on("click", function(){
        var getId = this.id;
        var operatorName = getId.split("-")[3];
        console.log(nameOfOperatorToSearch);
        var linkToshow = '*[class*="link-produced-by-'+operatorName+'"]';
        var dataProcessedBy = '*[id*="data-produced-by-'+operatorName+'"]';
        if($(this).hasClass("selected")){
          $(this).removeClass("selected");
          showContent(dataProcessedBy,false);
          showContent(linkToshow, false);
        }else{
          $(this).addClass("selected");
          showContent(dataProcessedBy, true);
          showContent(linkToshow, true);
        }
      });
      // Get Info about Operator node
      $(".operator.node").on("click", function(){
        var getId = this.id;
        var operatorName = getId.split(" ")[1];
        nameOfOperatorToSearch = operatorName;
      })
    }
  })
})
function getDataLinks(outputOfEachOperators){
  console.log(outputOfEachOperators.length)
  var current_forward_operator = "none";

  for(var i = 0 ; i < outputOfEachOperators.length ; i++){
    console.log("hier");
    for(var k = 0 ; k< outputOfEachOperators[i].length; k++ ){
      console.log("hier");
      if(outputOfEachOperators[i][k].hasOwnProperty('operator')){
        var operator = outputOfEachOperators[i][k].operator;
        console.log("hier");
        current_forward_operator = getNeighbourOperator(operator, "forward");
        if(current_forward_operator != "false"){
          outputOfEachOperators[i][k]["source"] = operator;
          outputOfEachOperators[i][k]["target"] = current_forward_operator;
          dataWithSourceAndTarget.push(outputOfEachOperators[i][k]);
        }else{
          outputOfEachOperators[i][k]["source"] = operator;
          outputOfEachOperators[i][k]["target"] = "none";
          dataWithSourceAndTarget.push(outputOfEachOperators[i][k]);
        }
      }
    }
  }
  console.log(dataWithSourceAndTarget.length);
  for(var i = 0 ; i < dataWithSourceAndTarget.length; i++){
    console.log(dataWithSourceAndTarget[i]);
  }
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
