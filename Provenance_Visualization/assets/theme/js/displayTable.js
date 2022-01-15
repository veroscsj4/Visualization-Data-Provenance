var range_of_deep = [];
var max_depth;
//var min_deep = [];
$(document).ready(function(){
  $('#vs-displayTable').click(function(){
    //var right_menu = getEmptyRightMenu();

    var div_nav_nested_table = $("<div class='vs-nav-nested-table uk-padding-small uk-background-primary uk-light' style='display:none;'><div><p class='uk-h2'>Nested Table</p></div></div>");
    //form.append('<label><input type="radio" name="mode" value="sumBySize" checked> Size</label>');
    //form.append('<label><input type="radio" name="mode" value="sumByCount"> Count</label>');
    // Description of Color for Tracing nested Table

    var div_nav_description_tracing = $("<div class='vs-nav-for-tracing-description uk-flex uk-flex-end uk-margin-top'></div>");

    var div_nav_description_backward = $("<div class='vs-description-container-backward-tracing uk-margin-right uk-flex'></div>");
    var div_nav_description_forward = $("<div class='vs-description-container-forward-tracing uk-margin-right uk-flex'></div>");
    var div_nav_description_selected_element = $("<div class='vs-description-container-selected-element uk-margin-right uk-flex'></div>");
    var div_nav_color_combination = $("<div class='vs-save-color-combination-container uk-margin-right uk-margin-right uk-flex'></div>");

    var description_selected_element_color_picker = $("<div class='vs-color-picker' id='colors'><input type='color' value='#08bb93' name='vs-checkbox-selected-element-tracing' class='vs-input-selected-element' id='vs-color-picker-selected-element'></div>");
    var description_selected_element_title = $("<div class='vs-title-color-picker'><span>Selected Element</span></div>");

    var description_forward_color_picker = $("<div class='vs-color-picker'><input type='color' value='#efcc6b' name='vs-checkbox-forward-tracing' class='vs-input-forward-tracing' id='vs-color-picker-forward-tracing'></div>");
    var description_forward_title = $("<div class='vs-title-color-picker'><span>Forward Tracing</span></div>");

    var description_backward_color_picker = $("<div class='vs-color-picker'><input type='color' value='#a59ce9' name='vs-checkbox-backward-tracing' class='vs-input-backward-tracing' id='vs-color-picker-backward-tracing'></div>");
    var description_backward_title = $("<div class='vs-title-color-picker'><span>Backward Tracing</span></div>");

    var save_color_combination_check = $("<div class='vs-save-color-combination-checkbox'><input type='checkbox' id='vs-save-color-combination-checkbox' class='vs-save-color-combination-checkbox'></div>");
    var save_color_combination_title = $("<div class='vs-save-color-combination-title'><span>Save this combination</span></div>");

    var save_color_combination_group = $("<div class='vs-save-color-combination-group vs-select'><select class='vs-save-color-combination-group vs-select-field' id='vs-save-color-group'><option value='0'>Color Group</option></select></div>");

    div_nav_description_selected_element.append(description_selected_element_color_picker);
    div_nav_description_selected_element.append(description_selected_element_title);

    div_nav_description_forward.append(description_forward_color_picker);
    div_nav_description_forward.append(description_forward_title);

    div_nav_description_backward.append(description_backward_color_picker);
    div_nav_description_backward.append(description_backward_title);

    div_nav_color_combination.append(save_color_combination_check);
    div_nav_color_combination.append(save_color_combination_title);

    div_nav_description_tracing.append(div_nav_description_forward);
    div_nav_description_tracing.append(div_nav_description_selected_element);
    div_nav_description_tracing.append(div_nav_description_backward);
    div_nav_description_tracing.append(div_nav_color_combination);
    div_nav_description_tracing.append(save_color_combination_group);

    div_nav_nested_table.append(div_nav_description_tracing);

    div_nav_nested_table.appendTo("#vs-pie");

    $(".vs-nav-nested-table").css("display","block");
    var width_window = $("#vs-pie").width();
    var height_window = $("#vs-pie").height();
    var svg = $("<svg class='vs-nested-table'></div>")
      .attr("viewBox", '0 0 '+ width_window +' '+ height_window);

    svg.appendTo("#vs-pie");
    $("#vs-pie").append($("<ul class='vs-right-nested-table-menu'></ul>"));
    var svg = d3.select(".vs-nested-table"),
        width = +width_window,
        height = +height_window - 50;


    var treemap = d3.treemap()
        .tile(d3.treemapResquarify)
        .size([width, height])
        .round(true)
        .paddingInner(1);

    d3.json("data/data.json", function(error, data){
    if (error) throw error;
    // Since we are dealing with hierarchical data, need to convert the data to the right format
    var root = d3.hierarchy(data)
        .eachBefore(function(d) {
          if(typeof d.data.name =='undefined'){
            d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.id;
          }else{
            d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
          }
        })
        .sum(sumByCount)
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

      // Computes x0, x1, y0, and y1 for each node (where the rectangles should be)
      treemap(root);

      var cell = svg.selectAll("g")
          .data(root.leaves())
          .enter().append("g")
              .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
              .attr("id", function(d){
                //console.log(d.data.parent_id);
                var split_new_id = d.data.id.split(".");
                var name = "id("+split_new_id[split_new_id.length-1]+")";

                if(d.data.hasOwnProperty("parent_id")){
                  name = name + " parentId("+ d.data.parent_id+")";
                }
                if(d.data.hasOwnProperty("operator")){
                  name = name + " operator("+ d.data.operator+")";

                }
                return name;
              });

      var element_to_find_max = 0;
      for(var i = 0; i<root.leaves().length ; i++){
        var current = root.leaves()[i].depth;
        if(!checkExistElement(range_of_deep,current)){
          range_of_deep.push(current);
          if(current > element_to_find_max){
            element_to_find_max = current;
          }
        }
      }
      max_depth = element_to_find_max;

      var get_range = getNumbersForRange(range_of_deep);
      var get_first_range = get_range[2];
      var get_between_range = get_range[1];
      var get_last_range = get_range[0];


      /*var fader = function(color, depth) {
        return color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

      },*/

      // Give Color by range
      var color_first = d3.scaleOrdinal().range(["#59559e","#156f8f"]),
          color_between = d3.scaleOrdinal().range(["#8dbffa","#00f4ff"]),
          color_last =  d3.scaleOrdinal().range(["#d4dded","#d0ffff"]),
          format = d3.format(",d");

      // Add rectanges for each of the boxes that were generated
      cell.append("rect")
          .attr("id", function(d) { return d.data.id ;})
          .attr("class",function(d) {
            var name = "vs-rect ";
            if(d.data.hasOwnProperty("parent_id")){
              name = name + "parentId("+d.data.parent_id+")";
            }
            return  name; })
          .attr("width", function(d) { return d.x1 - d.x0; })
          .attr("height", function(d) { return d.y1 - d.y0; })
          .attr("fill", function(d) {
            if(get_first_range.includes(d.depth)){
              return color_first(d.parent.data.id,d.depth);
            }
            if(get_between_range.includes(d.depth)){
              return color_between(d.parent.data.id,d.depth);
              //return d3.interpolateRgb(color_between, "#fff")(0.2);
            }
            if(get_last_range.includes(d.depth)){
              return color_last(d.parent.data.id,d.depth);
            }
          });

      // Make sure that text labels don't overflow into adjacent boxes
      cell.append("clipPath")
          .attr("id", function(d) { return "clip-" + d.data.id ; })
          .append("use")
              .attr("xlink:href", function(d) { return "#" + d.data.id; });

      // Add text labels - each word goes on its own line
      cell.append("text")
          .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
          .selectAll("tspan")
          .data(function(d) {
            if(typeof d.data.name != 'undefined'){
                return d.data.name.split(/(?=[A-Z][^A-Z])/g);
            }else{
              return d.data.content.split(/(?=[A-Z][^A-Z])/g);
            }
          })
          .attr("color", function(d){
            if(get_first_range.includes(d.depth)){
              return "#fff";
            }
          })
          .enter().append("tspan")
              .attr("x", 4)
              .attr("y", function(d, i) { return 13 + i * 10; })
              .text(function(d) { return d; });

      // Simple way to make tooltips
      cell.append("title")
          .text(function(d) { return d.data.id + "\n" + format(d.value); });

      // Add an input to select between different summing methods
      d3.selectAll("input")
          .data([sumByCount], function(d) { return d ? d.name : this.value; })
          .on("change", changed);

      function changed(sum) {
          // Give the treemap a new root, which uses a different summing function
          treemap(root.sum(sum));

          // Update the size and position of each of the rectangles
          cell.transition().duration(750)
              .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
              .select("rect")
                  .attr("width", function(d) { return d.x1 - d.x0; })
                  .attr("height", function(d) { return d.y1 - d.y0; });
      }
    });
    // Return the number of descendants that the node has
    function sumByCount(d) {
        return d.children ? 0 : 1;
    }

  });
})
// Right Menu
function getEmptyRightMenu(){
  var ul = $("<ul class='vs-right-nested-table-menu'></ul>");
  return ul;
}
function getNumbersForRange(range_of_deep){
  var numbers_for_range = [];
  var first_range = [];
  var between_range = [];
  var last_range = [];
  if(range_of_deep.length === 3){
    first_range.push(range_of_deep[0]);
    between_range.push(range_of_deep[1]);
    last_range.push(range_of_deep[2]);
    numbers_for_range.push(first_range);
    numbers_for_range.push(between_range);
    numbers_for_range.push(last_range);
  }
  if(range_of_deep.length === 2){
    first_range.push(range_of_deep[0]);
    last.push(range_of_deep[1]);
    numbers_for_range.push(first_range);
    numbers_for_range.push(last_range);
  }
  if(range_of_deep.length > 3){
    var sequence_for_range = Math.round((range_of_deep.length + 1) / 3);
    console.log("sequence_for_range = "+ sequence_for_range);
    for(var i = 0 ; i<range_of_deep.length ; i++){
      console.log("i = "+i + "range_of_deep[i] = "+range_of_deep[i]);
      if(first_range.length < sequence_for_range){
        first_range.push(i)
        first_range.push(range_of_deep.length[i]);
      }else if(between_range.length < sequence_for_range){
        between_range.push(range_of_deep.length[i])
      }else{
        if(last_range.length < sequence_for_range){
          last_range.push(range_of_deep.length[i])
        }
      }
    }
    numbers_for_range.push(first_range);
    numbers_for_range.push(between_range);
    numbers_for_range.push(last_range);
  }
  return numbers_for_range;
}
