var nameOfOperatorToSearch;
var dataWithSourceAndTarget = [];
var links = [];
var nodes = [];
var nodes_operator = [];
var links_operator = [];
var outputOfEachOperatorsForDirectedGraph = [];
var nameOfAllOperatorForDirectedGraph = [];
var colors = ["#0A9396","#94D2BD","#E9D8A6","#EE9B00","#CA6702","#BB3E03","#AE2012","#9B2226"]
var group_by_color = [];

function getDataLinks(outputOfEachOperatorsForDirectedGraph){
  var current_forward_operator = "none";
  var to_compare_operator_name = "none";
  for(var i = 0 ; i < outputOfEachOperatorsForDirectedGraph.length ; i++){

    for(var k = 0 ; k< outputOfEachOperatorsForDirectedGraph[i].length; k++ ){

      if(outputOfEachOperatorsForDirectedGraph[i][k].hasOwnProperty('children')){
        var operator = outputOfEachOperatorsForDirectedGraph[i][k].name;
        var operator_output = outputOfEachOperatorsForDirectedGraph[i][k].name+"-output";
        current_forward_operator = getNeighbourOperatorForDirectedGraph(operator, "forward");
        if(current_forward_operator != "false"){ // conexion between cluster node and next operator
          //links.push({"source":operator,"target":current_forward_operator, "type":"operator_to_operator", "strength": 0.1});
          links.push({"source":operator_output,"target":current_forward_operator, "type":"output_to_operator","strength": 0.1});
        }
        links.push({"source":operator,"target":operator_output ,"type":"output_to_operator", "strength": 0.1});
      }
      if(outputOfEachOperatorsForDirectedGraph[i][k].hasOwnProperty('operator')){
        nodes.push(outputOfEachOperatorsForDirectedGraph[i][k]);
        //outputOfEachOperatorsForDirectedGraph[i][k]["unique_id"] = unique_id;
        var operator = outputOfEachOperatorsForDirectedGraph[i][k].operator;
        var operator_output = outputOfEachOperatorsForDirectedGraph[i][k].operator+"-output";
        //var id = outputOfEachOperatorsForDirectedGraph[i][k].id;
        var parent_id = outputOfEachOperatorsForDirectedGraph[i][k].parent_id;
        var unique_id = outputOfEachOperatorsForDirectedGraph[i][k].unique_id;

        links.push({"source":operator_output,"target":unique_id, "parent_id": parent_id, "type": "output-group-to-element","strength": 0.1});
      }
    }
  }
  for(var i = 0 ; i < nameOfAllOperatorForDirectedGraph.length ; i++){

      var operator = nameOfAllOperatorForDirectedGraph[i];
      var output_of_operator = operator+"-output";
      // Nodes as operator
      nodes.push({"unique_id":operator,"id":operator, "type":"operator_node"});
      if(operator != "input"){
        // Nodes as Output of operator
        var output_of_operator = operator+"-output";
        nodes.push({"unique_id":output_of_operator,"id":output_of_operator, "type":"operator_output"});
      }
      current_forward_operator = getNeighbourOperatorForDirectedGraph(operator, "forward");
      if(current_forward_operator != "false"){
        if(operator != "input"){
          // links
          var output_of_operator = operator+"-output";
          links.push({"source":operator, "target":output_of_operator, "type":"operator_to_output","strength": 0.1})
        }
        links.push({"source":operator , "target":current_forward_operator,"type":"operator_to_operator", "strength": 0.1})
      }

  }


  return [nodes,links, nodes_operator, links_operator];

}

function getDataForDirectedGraph(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getDataForDirectedGraph(theObject[i]);
        }
    }
    else
    {
        for(var prop in theObject) {
            //console.log(prop + ': ' + theObject[prop]);
            if(prop == 'children') {
                //console.log(prop + ': ' + theObject[prop]);
                outputOfEachOperatorsForDirectedGraph.push(theObject[prop]);
                /*if(theObject[prop] == 1) {
                    return theObject;
                }*/
            }
            if(prop == 'name') {
                console.log(prop + ': ' + theObject[prop]);
                nameOfAllOperatorForDirectedGraph.push(theObject[prop]);

            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                result = getDataForDirectedGraph(theObject[prop]);
        }
    }
    return result;
}
function getNeighbourOperatorForDirectedGraph(operator, typeOfTracing){
  var result = "false";
  if(typeOfTracing === "forward"){
    var x = 0;
    var z = 0 ;
    for(var i = 0; i<nameOfAllOperatorForDirectedGraph.length; i++){
      if(nameOfAllOperatorForDirectedGraph[i] === operator){
        x = i;
      }
    }
    x = x + 1;
    if(x < nameOfAllOperatorForDirectedGraph.length){
      return nameOfAllOperatorForDirectedGraph[x];
    }else if(x => nameOfAllOperatorForDirectedGraph.length){
      return result;
    }
  }
  if(typeOfTracing === "backward"){
    var y = 0;
    for(var i = 0; i<nameOfAllOperatorForDirectedGraph.length; i++){
      if(nameOfAllOperatorForDirectedGraph[i] === operator){
        y = i;
      }
    }
    y = y - 1;
    if(y < 0){
      return result;
    }else{
      return nameOfAllOperatorForDirectedGraph[y];
    }
  }

}
/*function getObjectForDirectedGraph(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getObjectForDirectedGraph(theObject[i]);
        }
    }
    else
    {
        for(var prop in theObject) {
            //console.log(prop + ': ' + theObject[prop]);
            if(prop == 'name') {
                //console.log(prop + ': ' + theObject[prop]);
                nameOfAllOperatorForDirectedGraph.push(theObject[prop]);
                if(theObject[prop] == 1) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                result = getObjectForDirectedGraph(theObject[prop]);
        }
    }
    return result;
}*/
$(document).ready(function(){


  $.getJSON("data/data.json", function(data){
    //getObjectForDirectedGraph(data)
    getDataForDirectedGraph(data);
    structure = getDataLinks(outputOfEachOperatorsForDirectedGraph);
    dataWithSourceAndTarget["nodes"] = structure[0];
    dataWithSourceAndTarget["links"] = structure[1];
    /*dataWithSourceAndTarget.links.forEach(e => {
      if(e.source === "flatmap-output") console.log(e);
    })*/
    links = structure[1];

    var width = window.width
    var height = window.height

    function getNeighbors(node) {
      //console.log("NODE "+ node.id + " par. "+node.parent_id + " cont "+ node.content)
      return links.reduce(function (neighbors, link) {

      if (link.target.id === node.id) {
        neighbors.push(link.source.id)
      }
      if (link.source.id === node.id) {
        neighbors.push(link.target.id)
      }
      if (link.target.id === node.parent_id){
        neighbors.push(link.target.id)
      }
      return neighbors
    },
      [node.id]
    )
    }

    function isNeighborLink(node, link) {
      return link.target.id === node.id || link.source.id === node.id ||  link.target.id === node.parent_id
    }


    function getNodeColor(node, neighbors) {
      if(node.type === "operator_node"){
        return '#12206a';
      }else if(node.type === "operator_output"){
        return '#1c9be3';
      }else{
        console.log("firs "+node.operator)
        if(typeof node.operator != "undefined"){
          if(group_by_color.length === 0){
            group_by_color.push({"operator":node.operator , "color":colors[1]})
            var color = colors[1]
            const index = colors.indexOf(color);
            if (index > -1) {
              colors.splice(index, 1);
            }
            return color;
          }else{
            //console.log(group_by_color.length)
            for(var i = 0; i<group_by_color.length; i++){
              if(group_by_color[i].operator === node.operator){
                return group_by_color[i].color;
              }
              else{
                if( i+1 == group_by_color.length){
                  group_by_color.push({"operator":node.operator , "color":colors[i]})
                  var color = colors[i]
                  const index = colors.indexOf(color);
                  if (index > -1) {
                    colors.splice(index, 1);
                  }
                  return color;
                }
              }
            }
          }
        }
      }
    }

    //function

    function getLinkColor(node, link) {
      //#F3950D #E5E5E5 rgba(50, 50, 50, 0.2)
      return isNeighborLink(node, link) ? '#F3950D' : '#E5E5E5'
    }

    function getTextColor(node, neighbors) {
      return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? '#F3950D' : '#001234'
    }
    function getDisplay(node, neighbors) {
      if(typeof node.type != "undefined"){
        return 'block'
      }else{
        return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'block' : 'none'
      }
    }

  //Container for description

  var div = $("<div class='vs-directed-graph-description-container uk-box-shadow-large uk-margin' ><div class='vs-title uk-padding-small uk-background-primary uk-light'><p class='uk-h4 uk-text-center'>Description</p></div>")
  var div_container_description_operator = $("<div class='vs-directed-graph-description uk-flex uk-padding-small'></div>")
  var div_container_description_operator_output = $("<div class='vs-directed-graph-description uk-flex uk-padding-small uk-padding-remove-vertical'></div>")
  var color_picker_for_operator = $('<div class="vs-color-picker vs-directed-graph-picker"><input type="color" value="#001234" name="vs-checkbox-operator" class="vs-input-operator" id="vs-input-operator"></div><div class="vs-title-color-picker"><span>Operator</span></div>')

  var color_picker_for_operator_output = $('<div class="vs-color-picker vs-directed-graph-picker"><input type="color" value="#1c9be3" name="vs-checkbox-operator-output" class="vs-input-operator-output" id="vs-input-operator"></div><div class="vs-title-color-picker"><span>Output</span></div>')

  div_container_description_operator_output.append(color_picker_for_operator_output)
  div_container_description_operator.append(color_picker_for_operator)
  div.append(div_container_description_operator)
  div.append(div_container_description_operator_output)

  var width = $(".vs-graph").width() + 400;
  var height = $(".vs-graph").height() + 600;

  var svg = $("<svg class='vs-directed-graph' ></div>")
    .attr('width', width)
    .attr('height', height)
    //.attr("viewBox", '0 0 '+ width+200 +' '+ height-800);

  div.appendTo(".vs-graph")
  svg.appendTo(".vs-graph");

  var svg = d3.select(".vs-directed-graph")
  // show information about data by mouseover
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var content;
      if(d.hasOwnProperty("name")){
        //console.log("hier 0");
        content =  "<strong>Operator Name:</strong> <span>" + d.data.name + "</span>";
      }
      if(d.hasOwnProperty("children")){
        //console.log("hier 5" + d.data.children.length);
        var count_children = d.children.length;
        content +=  "<br /><strong>Number of processed data:</strong> <span>" + count_children  + "</span>";
      } else{
        content = "<strong>Information about Node</strong>";
        if(d.hasOwnProperty("operator_number")){
          //console.log("hier 1"+ d.data.operator_number);
          content += "<br /><strong>Operator Number:</strong> <span>" + d.operator_number + "</span>";
        }
        if(d.hasOwnProperty("operator")){
          //console.log("hier 2"+ d.data.operator);
          content += "<br /><strong>Operator Name:</strong> <span>" + d.operator + "</span>";
        }
        if(d.hasOwnProperty("content")){
          //console.log("hier 3"+ d.data.word);
          content += "<br /><strong>content:</strong> <span>" + d.content + "</span>";
        }
        if(d.hasOwnProperty("id")){
          //console.log("hier 4", d.data.id);
          content+= "<br /><strong>ID:</strong> <span>" + d.id + "</span>";
        }
      }
      if (content.length > 0 ){
        return content;
      }else{
        return -1;
      }
    })

  svg.call(tip);

  var graph_container = $(".vs-graph")

  /*svg.call(d3.zoom().scaleExtent([0.5, 5])
              .translateExtent([[0, 0], [width, height]])
              .extent([[0, 0], [width, height]])
              .on("zoom", function(){
        svg.attr("transform", d3.event.transform)
      }))*/


  // build the arrow.
  svg.append("svg:defs").selectAll("marker")
      .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  // simulation setup with all forces
  var linkForce = d3
    .forceLink()
    .id(function (link) { return link.operator, link.unique_id })
    .strength(function (link) { return link.strength })

    var simulation = d3
      .forceSimulation()
      .force('link', linkForce)
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2))

    var dragDrop = d3.drag().on('start', function (node) {
      node.fx = node.x
      node.fy = node.y
    }).on('drag', function (node) {
      simulation.alphaTarget(0.7).restart()
      node.fx = d3.event.x
      node.fy = d3.event.y
    }).on('end', function (node) {
      if (!d3.event.active) {
        simulation.alphaTarget(0)
      }
      node.fx = null
      node.fy = null
    })

    function selectNode(selectedNode) {
      var neighbors = getNeighbors(selectedNode)
      // we modify the styles to highlight selected nodes
      nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
      textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
      textElements.attr('display', function (node) { return getDisplay(node, neighbors) })
      linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
    }

    var linkElements = svg.selectAll("line")
      .data(links)
      .enter().append("line")
        .attr("stroke-width", 2)
    	  .attr("stroke", "rgba(50, 50, 50, 0.2)")
        .attr("marker-end", "url(#end)");


    linkElements
      .attr("class", function(d){
        if(d.hasOwnProperty("type")){
          if(d.type === "output-group-to-element"){
            return "links "+ "link-to-output "+ d.source;
          }
          if(d.type === "operator_to_output"){
            return "links "+ "link-to-output "+ d.source;
          }if(d.type === "output_to_operator"){
            return "links "+ "link-output-to-operator "+ d.source;
          }if(d.type === "operator_to_operator"){
            return "links "+ "link-operator-to-operator "+ d.source;
          }
        }else{
          return "links";
        }
      })
      .attr("id", function(d){
            if(d.hasOwnProperty("type")){
              if(d.type === "output-group-to-element"){
                return "link-output-group-to-element-"+d.source;
              }
              if(d.type === "operator_to_output"){
                return  "link-operator-to-output-"+d.source;
              }
              if(d.type === "output_to_operator"){
                return  "link-output-to-operator-"+d.source;
              }
              if(d.type === "operator_to_operator"){
                return "link-operator-to-operator-"+d.source;
              }
            }else{
              return "links";
            }
          })
      .attr("display", function(d){
        if(d.hasOwnProperty("type")){
          return "block";
        }
        if(d.hasOwnProperty("type")){
          if(d.type === "output_to_operator" || d.type === "operator_to_output"){
            return "block";
          }
        }
      })

    var nodeElements = svg.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", 10)
        .attr("fill", getNodeColor)
        .call(dragDrop)
        .on('click', selectNode)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    nodeElements
      .attr("class",function(d){
        if(d.hasOwnProperty('operator')){
          return "nodes "+ "output-node "+ "output-from-"+d.operator;
        }else if(d.hasOwnProperty("type")){
          if(d.type === "operator_output"){
            return "nodes "+"group-output-node "+"output-group-from-"+d.id;
          }
          if(d.type === "operator_node"){
            return "nodes "+"operator-node "+"operator-node-"+d.id;
          }
        }else{
          return "nodes";
        }
      })
      .attr("id", function(d){
        if(d.hasOwnProperty('operator')){
          return "operator("+d.operator+") "+"id("+d.id+") "+"uniqueId("+d.unique_id+")" + " parentId("+d.parent_id+")";
        }else if(d.hasOwnProperty("type")){
          if(d.type === "operator_output"){
            return d.id;
          }
          if(d.type === "operator_node"){
            return d.id;
          }
        }else{
          return "nodes";
        }
      })
      .attr("display", function(d){
        if(d.hasOwnProperty('operator')){
          return "block";
        }
        if(d.hasOwnProperty("type")){
          if(d.type === "operator_output"){
            return "block";
          }
        }
      })



    var textElements = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
        .text(function (node) {
          return node.type === "operator_node" || node.type === "operator_output" ? node.id : node.content; })
    	  .attr("font-size", function(node){
          return node.type === "operator_node" ? 40 : 15;
        })
    	  .attr("dx", 15)
        .attr("dy", 4)

    textElements
      .attr("display", function(d){
        if(d.hasOwnProperty('operator')){
          return "none";
        }
        if(d.hasOwnProperty("type")){
          return "block";
        }
      })
      .attr("class", function(d){
        if(d.hasOwnProperty('operator')){
          return "texts "+"texts-"+d.operator;
        }if(d.hasOwnProperty("type") && d.type === "operator_output"){
          return "texts "+"texts-"+d.id;
        }else{
          return "texts";
        }
      })

    simulation.nodes(nodes).on('tick', () => {
      nodeElements
        .attr('cx', function (node) { return node.x })
        .attr('cy', function (node) { return node.y })
      textElements
        .attr('x', function (node) { return node.x })
        .attr('y', function (node) { return node.y })
      linkElements
        .attr('x1', function (link) { return link.source.x })
        .attr('y1', function (link) { return link.source.y })
        .attr('x2', function (link) { return link.target.x })
        .attr('y2', function (link) { return link.target.y })
    })

    simulation.force("link").links(links)

    $('.operator-node').on('dblclick',function(d){
      var id = $(this).attr("id")
      if($(this).hasClass("selected")){
        $(this).removeClass("selected");
        showContentOfGraph(id,"operator_node", false)
      }else{
        $(this).addClass("selected");
        showContentOfGraph(id,"operator_node",true)
      }
    })
    $('.group-output-node').on('dblclick', function(d){
      var id = $(this).attr("id")
      if($(this).hasClass("selected")){
        $(this).removeClass("selected");
        showContentOfGraph(id,"output_group", false)
      }else{
        $(this).addClass("selected");
        showContentOfGraph(id,"output_group",true)
      }
    })
    $('.output-node').on('click', function(d){
      var id = $(this).attr("id")
      var group_of_ids = id.split(" ");
      var clean_operator = group_of_ids[0].replace("operator(", "");
      var creade_by_operator = clean_operator.replace(")","");

      var clean_id = group_of_ids[1].replace("id(", "");
      var id_of_element = clean_id.replace(")", "");

      var clean_parent_id = group_of_ids[3].replace("parentId(", "");
      var parent_id_of_element = clean_parent_id.replace(")", "");

      var container = "vs-table"
      getTableDirectedGraph(id_of_element, creade_by_operator, container);
      var waitForTable = function(selector, callback) {
        if (document.getElementsByClassName(selector).length) {
          callback();
        } else {
          setTimeout(function() {
            waitForTable(selector, callback);
          }, 100);
        }
      };
      var selector = "vs-table-for-directed-graph";
      waitForTable(selector, function() {
        var table = document.getElementsByClassName(selector);
        var table_id="#"+$(table).attr("id");
        $(table_id).DataTable({
          "scrollY":        '50vh',
          "scrollCollapse": true,
          "paging":         true
        });

        $(".dataTables_scrollHeadInner table").removeClass("vs-table-for-directed-graph");
        $(".dataTables_scrollHeadInner table").addClass("vs-get-header");

        $(".vs-table-for-directed-graph tbody tr").on("click", function(){

          if($(this).hasClass("vs-row-was-selected")){
            alert("this row was already selected before, please check the 'your selected data' area");
          }else{
            modal_table = createModal(modal_for_table);
            var modal_table_id= modal_table.attr("id");
            var panel_id = "vs-panel-id-"+modal_table_id;
            var span = $("<span class='vs-close vs-close-modal' onClick=closeModal('"+modal_table_id+"'); >&times;</span>");
            var panel = $('<div class="vs-panel" id="'+panel_id+'"></div>');
            var modal_for_table_container = $('<div class="vs-modal-for-table-container uk-box-shadow-small">');
            $(this).addClass("vs-row-was-selected");
            $(this).attr("id", modal_table_id);
            var table_for_modal = $('<table class="uk-table uk-table-responsive uk-table-divider vs-modal-table""></table>');
            var thead = $('<thead></thead>');
            var row = $('<tr></tr>');
            var to_find_position = ".vs-get-header thead tr";
            var find_position_of_ids = findPositionOFId(to_find_position);
            var find_position_of_operator = findPositionOfOperator(to_find_position);

            $(".vs-get-header thead tr").find("th").each(function(){
              row.append('<th>'+$(this).text()+'</th>');
            });
            thead.append(row);
            table_for_modal.append(thead);
            var tbody = $('<tbody></tbody>');
            var body_row = $('<tr></tr>');

            // START :: We need this part to do the forward & back. Tracing

            var modal_for_tracing_container = $('<div class="vs-modal-for-tracing-container  uk-margin-top"></div>');
            var modal_for_tracing_container_buttons = $('<div class="vs-modal-for-tracing-buttons uk-flex uk-flex-center"></div>');
            var describe_for_tracing_container = $('<div class="vs-container-for-tracing-description uk-flex uk-flex-center uk-margin-top"></div>');
            var position_of_id = find_position_of_ids["id_position"];
            var position_of_parent_id = find_position_of_ids["parent_id_position"];
            var operator_position = find_position_of_operator["operator_position"];


            if(Object.keys(find_position_of_ids).length === 2 || Object.keys(find_position_of_ids).length ===1 ){
              var button_for_backward_tracing;
              var button_for_forward_tracing;

              // Search for the content of the desired id for back. & forward Tracing

              var parent_id_for_backward_tracing = $(this).find("td").eq(position_of_parent_id).text();
              var id_for_forward_tracing = $(this).find("td").eq(position_of_id).text();
              var operator_for_tracing = $(this).find("td").eq(operator_position).text();
              var has_forward = getNeighbourOperator(operator_for_tracing, "forward");
              var has_backward = getNeighbourOperator(operator_for_tracing, "backward");
              if(has_backward != "false"){
                button_for_backward_tracing = $('<button class="uk-button uk-button-secondary uk-margin-right vs-button-backward-tracing" id="vs-button-backward-tracing" onClick=backwardTracing('+parent_id_for_backward_tracing+',"'+operator_for_tracing+'"); >Backward Tracing</button>');
                modal_for_tracing_container_buttons.append(button_for_backward_tracing);
              }
              if(has_forward != "false"){
                button_for_forward_tracing = $('<button class="uk-button uk-button-secondary uk-margin-right vs-button-forward-tracing" id="vs-button-forward-tracing" onClick=forwardTracing('+id_for_forward_tracing+',"'+operator_for_tracing+'"); >Forward Tracing</button>');
                modal_for_tracing_container_buttons.append(button_for_forward_tracing);
              }

              // Get the right position for the Buttons ( first back. and then forw. Tracing)

              modal_for_tracing_container.append(modal_for_tracing_container_buttons);
              modal_for_tracing_container.append(describe_for_tracing_container);


            }else{
              if(Object.keys(find_position_of_ids).length > 2 || Object.keys(find_position_of_ids).length == 0){
                modal_for_tracing_container.append('<p>Something went wrong, please check the data format</p>');
              }
            }
            // END :: Up to this point is end for the forward & back. Tracing
            $(this).find("td").each(function(){
              body_row.append('<td>'+$(this).text()+'</td>');
            });

            panel.append(span);
            tbody.append(body_row);
            table_for_modal.append(tbody);

            var save_this_data_from_table = $('<button class="uk-button uk-button-secondary  vs-button-save-rows" id="vs-button-save-rows" onClick=saveTable("vs-modal-table"); >Save</button>')
            modal_for_tracing_container_buttons.append(save_this_data_from_table );

            modal_for_table_container.append(table_for_modal);
            panel.append(modal_for_table_container);
            panel.append(modal_for_tracing_container);
            modal_table.append(panel);
            $("#vs-visualization").append(modal);
            $("#content").addClass("vs-overlay");
            $(".vs-modal").css("display", "block");
            $(".vs-modal").draggable();
            adaptHeightForCss(panel_id, modal_table_id);
          }
        });
      })
    })
    $('.group-output-node').on('click', function(d){
      var id = $(this).attr("id")
      var creade_by_operator = id.replace("-output","");
      var container = "vs-table"
      getTableDirectedGraphOfGroup(creade_by_operator);

      var waitForTable = function(selector, callback) {
        if (document.getElementsByClassName(selector).length) {
          callback();
        } else {
          setTimeout(function() {
            waitForTable(selector, callback);
          }, 100);
        }
      };
      var selector = "vs-table-for-directed-graph";
      waitForTable(selector, function() {
        var table = document.getElementsByClassName(selector);
        var table_id="#"+$(table).attr("id");
        $(table_id).DataTable({
          "scrollY":        '50vh',
          "scrollCollapse": true,
          "paging":         true
        });

        $(".dataTables_scrollHeadInner table").removeClass("vs-table-for-directed-graph");
        $(".dataTables_scrollHeadInner table").addClass("vs-get-header");

        $(".vs-table-for-directed-graph tbody tr").on("click", function(){

          if($(this).hasClass("vs-row-was-selected")){
            alert("this row was already selected before, please check the 'your selected data' area");
          }else{

            modal_table = createModal(modal_for_table);
            var modal_table_id= modal_table.attr("id");
            var panel_id = "vs-panel-id-"+modal_table_id;
            var span = $("<span class='vs-close vs-close-modal' onClick=closeModal('"+modal_table_id+"'); >&times;</span>");
            var panel = $('<div class="vs-panel" id="'+panel_id+'"></div>');
            var modal_for_table_container = $('<div class="vs-modal-for-table-container uk-box-shadow-small">');

            $(this).addClass("vs-row-was-selected");
            $(this).attr("id", modal_table_id);

            var table_for_modal = $('<table class="uk-table uk-table-responsive uk-table-divider vs-modal-table""></table>');
            var thead = $('<thead></thead>');
            var row = $('<tr></tr>');
            var to_find_position = ".vs-get-header thead tr";
            var find_position_of_ids = findPositionOFId(to_find_position);
            var find_position_of_operator = findPositionOfOperator(to_find_position);

            $(".vs-get-header thead tr").find("th").each(function(){
              row.append('<th>'+$(this).text()+'</th>');
            });
            thead.append(row);
            table_for_modal.append(thead);
            var tbody = $('<tbody></tbody>');
            var body_row = $('<tr></tr>');

            // START :: We need this part to do the forward & back. Tracing

            var modal_for_tracing_container = $('<div class="vs-modal-for-tracing-container  uk-margin-top"></div>');
            var modal_for_tracing_container_buttons = $('<div class="vs-modal-for-tracing-buttons uk-flex uk-flex-center"></div>');
            var describe_for_tracing_container = $('<div class="vs-container-for-tracing-description uk-flex uk-flex-center uk-margin-top"></div>');
            var position_of_id = find_position_of_ids["id_position"];
            var position_of_parent_id = find_position_of_ids["parent_id_position"];
            var operator_position = find_position_of_operator["operator_position"];


            if(Object.keys(find_position_of_ids).length === 2 || Object.keys(find_position_of_ids).length ===1 ){
              var button_for_backward_tracing;
              var button_for_forward_tracing;

              // Search for the content of the desired id for back. & forward Tracing

              var parent_id_for_backward_tracing = $(this).find("td").eq(position_of_parent_id).text();
              var id_for_forward_tracing = $(this).find("td").eq(position_of_id).text();
              var operator_for_tracing = $(this).find("td").eq(operator_position).text();
              var has_forward = getNeighbourOperator(operator_for_tracing, "forward");
              var has_backward = getNeighbourOperator(operator_for_tracing, "backward");

              if(has_backward != "false"){
                button_for_backward_tracing = $('<button class="uk-button uk-button-secondary uk-margin-right vs-button-backward-tracing" id="vs-button-backward-tracing" onClick=backwardTracing('+parent_id_for_backward_tracing+',"'+operator_for_tracing+'"); >Backward Tracing</button>');
                modal_for_tracing_container_buttons.append(button_for_backward_tracing);
              }
              if(has_forward != "false"){
                button_for_forward_tracing = $('<button class="uk-button uk-button-secondary uk-margin-right vs-button-forward-tracing" id="vs-button-forward-tracing" onClick=forwardTracing('+id_for_forward_tracing+',"'+operator_for_tracing+'"); >Forward Tracing</button>');
                modal_for_tracing_container_buttons.append(button_for_forward_tracing);
              }

              // Get the right position for the Buttons ( first back. and then forw. Tracing)

              modal_for_tracing_container.append(modal_for_tracing_container_buttons);
              modal_for_tracing_container.append(describe_for_tracing_container);


            }else{
              if(Object.keys(find_position_of_ids).length > 2 || Object.keys(find_position_of_ids).length == 0){
                modal_for_tracing_container.append('<p>Something went wrong, please check the data format</p>');
              }
            }
            // END :: Up to this point is end for the forward & back. Tracing
            $(this).find("td").each(function(){
              body_row.append('<td>'+$(this).text()+'</td>');
            });

            panel.append(span);
            tbody.append(body_row);
            table_for_modal.append(tbody);

            var save_this_data_from_table = $('<button class="uk-button uk-button-secondary uk-margin-right vs-button-save-rows" id="vs-button-save-rows" onClick=saveTable('+1+'); >Save</button>')
            modal_for_tracing_container_buttons.append(save_this_data_from_table );

            modal_for_table_container.append(table_for_modal);
            panel.append(modal_for_table_container);
            panel.append(modal_for_tracing_container);
            modal_table.append(panel);
            $("#vs-visualization").append(modal);
            $("#content").addClass("vs-overlay");
            $(".vs-modal").css("display", "block");
            $(".vs-modal").draggable();
            adaptHeightForCss(panel_id, modal_table_id);
          }
          var waitForModalTable = function(selector_modal, callback) {
            if (document.getElementsByClassName(selector_modal).length) {
              callback();
            } else {
              setTimeout(function() {
                waitForModalTable(selector_modal, callback);
              }, 100);
            }
          };
          var selector_modal = "vs-modal-table";
          waitForModalTable(selector_modal, function() {

            $(".vs-modal-table tbody tr").on("click", function(){
              if($(this).hasClass("vs-selected-row")){
                $(this).removeClass("vs-selected-row")
              }else{
                $(this).addClass("vs-selected-row")
              };
            })
          })
        });
      })
    });
  });
  var waitForModalTable = function(selector_modal, callback) {
    if (document.getElementsByClassName(selector_modal).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForModalTable(selector_modal, callback);
      }, 100);
    }
  };
  var selector_modal = "vs-modal-table";
  waitForModalTable(selector_modal, function() {

    $(".vs-modal-table tbody tr").on("click", function(){
      if($(this).hasClass("vs-selected-row")){
        $(this).removeClass("vs-selected-row")
      }else{
        $(this).addClass("vs-selected-row")
      };
    })
  })

})

function getTableDirectedGraphOfGroup(creade_by_operator){
  if($("#vs-table").children().length > 0){
    $("#vs-table").empty();
  }
  var data_from_tupel = getDataFromGroup(creade_by_operator)
  var table_information = getTableForDataOfTupel(data_from_tupel, "table_for_directed_graph")
  var table = table_information[0];

  var row_for_content = $('<div class="vs-directed-graph-table-tracing"></div>');
  var buttons_for_tracing_container = $('<div class="vs-directed-graph-container-for-tracing-buttons uk-margin-medium-top uk-flex uk-flex-center"></div>');
  var description_for_tracing = $('<div class="vs-container-for-tracing-description uk-flex uk-flex-center uk-margin-top"></div>');
  var row_for_table = $('<div class="vs-directed-graph-table-container">'+table.outerHTML+'</div>');


  row_for_content.append(row_for_table);

  $('#vs-table').append(row_for_content);


}
function getTableDirectedGraph(id_of_element, creade_by_operator, container){

  var div = document.getElementById(container);

  if($("#vs-table").children().length > 0){
    $("#vs-table").empty();
  }

  var data_from_tupel = getDataFromTupel(id_of_element, creade_by_operator)
  var table_information = getTableForDataOfTupel(data_from_tupel, "table_for_directed_graph")
  var table = table_information[0];

  var row_for_content = $('<div class="vs-directed-graph-table-tracing"></div>');
  var buttons_for_tracing_container = $('<div class="vs-directed-graph-container-for-tracing-buttons uk-margin-medium-top uk-flex uk-flex-center"></div>');
  var description_for_tracing = $('<div class="vs-container-for-tracing-description uk-flex uk-flex-center uk-margin-top"></div>');
  var row_for_table = $('<div class="vs-directed-graph-table-container">'+table.outerHTML+'</div>');


  row_for_content.append(row_for_table);

  $('#vs-table').append(row_for_content);

}
function showContentOfGraph(id, type, x){
  if(type == "operator_node"){
    var node_group_id = "#"+id+"-output";
    var nodes_id = ".output-from-"+id;
    var link_group_to_next_id = "#link-output-to-operator-"+id
    var link_operator_to_output = "#link-operator-to-output-"+id+"-output"
    var link_output_to_operator = "#link-output-to-operator-"+id+"-output"
    var link_operator_to_output_group = "#link-operator-to-output-"+id
    var link_output_group_to_element = ".link-to-output."+id+"-output"
    var link_operator_to_operator =".link-operator-to-operator."+id;
    var texts = ".texts-"+id;
    var texts_group = ".texts-"+id+"-output";
    if(x==true){
      $(node_group_id).hide();
      $(nodes_id).hide();
      $(link_group_to_next_id).hide();
      $(link_operator_to_output).hide();
      $(link_operator_to_output_group).hide();
      $(link_output_group_to_element).hide();
      $(link_operator_to_operator).show();
      $(link_output_to_operator).hide();
      $(texts).hide();
      $(texts_group).hide();
    }else{
      $(node_group_id).show();
      $(nodes_id).show();
      $(link_group_to_next_id).show();
      $(link_operator_to_output).show();
      $(link_operator_to_output_group).show();
      $(link_output_group_to_element).show();
      $(link_operator_to_operator).hide();
      $(link_output_to_operator).show();
      $(texts).show();
      $(texts_group).show();
    }
  }
  if(type == "output_group"){
    var split = id.split("-");
    var search_id = split[0];
    var nodes_id = ".output-from-"+search_id;
    var link_output_group_to_element = ".link-to-output."+id;
    console.log("search_id "+search_id)
    var link_operator_to_operator = ".link-operator-to-operator."+search_id;
    var texts = ".texts-"+search_id;
    if(x==true){
      $(nodes_id).hide();
      $(link_output_group_to_element).hide();
      $(link_operator_to_operator).hide();
      $(texts).hide();

    }else{
      $(nodes_id).show();
      $(link_output_group_to_element).show();
      $(texts).show();

    }
  }
}
function getDataFromGroup(create_by_operator){
  var result =[];
  for(i = 0; i<outputOfEachOperator.length; i++){
    outputOfEachOperator[i].forEach((e) => {
      if(e.hasOwnProperty("children") && e.name === create_by_operator){
          e.children.forEach((item) => {
            if(!item.hasOwnProperty("children")){
              result.push(item);
            }
        });
      }
    });
  }
  return result;
}
