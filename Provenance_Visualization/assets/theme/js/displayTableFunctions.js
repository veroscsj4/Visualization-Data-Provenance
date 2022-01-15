/* ********** Creade Modal for Information into the Nested Table ********** */
/*
By Karen Verónica Sacotto Cárdenas, Bachelor Arbeit "Visualization of Data Provenance"
Here we create functions to open a window (modal) to see the information of the selected frame of data.

The main thing is the creation of a "modal" with the id of the registered box,
we have a waitForReact, which makes the function
to be called as many times as necessary until the user clicks on one of the boxes.

*/

var modal_for_nested_table = "nested-table";


$(document).ready(function(){

  var waitForRect = function(selector, callback) {
    if (document.getElementsByClassName(selector).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForRect(selector, callback);
      }, 100);
    }
  };
  var selector = "vs-rect";
  waitForRect(selector, function() {
    //Open Menu on right click to show the tracing
    $('.vs-rect').bind("contextmenu" , function(event){
      // Avoid the real one
      event.preventDefault();
      var rectID = $(this).attr("id");
      var rect_class = $(this).attr("class").split(" ");
      var position = $(this).position();
      var position_left = position.left - 200;
      if(position_left > 1250){
        position_left = 1250;
      }
      var position_top = position.top - 130;
      var id_and_parent_of_element = getIdAndOperatorRect(rectID);
      var id_of_element = id_and_parent_of_element[id_and_parent_of_element.length - 1 ];
      var parent_of_element = id_and_parent_of_element[id_and_parent_of_element.length - 2];
      var backward_tracing_operator;
      if(id_and_parent_of_element.length > 2 && rect_class.length >= 2){
        backward_tracing_operator = id_and_parent_of_element[id_and_parent_of_element.length - 3];
        var rect_parent_id = rect_class[1];
        var backward_tracing_button = $('<li><button class="uk-button uk-button-text" onclick=backwardTracingRect('+id_of_element+',"'+backward_tracing_operator+'","'+rect_parent_id+'"); >Backward Tracing</button></li>');
        $('.vs-right-nested-table-menu').append(backward_tracing_button);
      }
      if($('.vs-right-nested-table-menu > li').length){
        $('.vs-right-nested-table-menu > li').remove();
      }

      var forward_tracing_button = $('<li><button class="uk-button uk-button-text" onclick=forwardTracingRect('+id_of_element+',"'+parent_of_element+'")>Forward Tracing</button></li>');
      var see_all_tracing = $('<li><button class="uk-button uk-button-text" onclick=allTracingRect('+id_of_element+',"'+parent_of_element+'")>See All Tracing</button></li>');
      $('.vs-right-nested-table-menu').append(backward_tracing_button);
      $('.vs-right-nested-table-menu').append(forward_tracing_button);
      $('.vs-right-nested-table-menu').append(see_all_tracing);

      // Show contextmenu
      $('.vs-right-nested-table-menu').finish().toggle(100);

      // In the right position (the mouse)
      $('.vs-right-nested-table-menu').css({
          top: position_top + "px",
          left: position_left + "px"
      });
    });
    // If the document is clicked somewhere
    $('.vs-rect').bind("mousedown", function (e) {
        // If the clicked element is not the menu
        if (!$(e.target).parents(".vs-right-nested-table-menu").length > 0) {

            // Hide it
            $(".vs-right-nested-table-menu").hide(100);
        }
    });
    // If the menu element is clicked
  $(".vs-right-nested-table-menu li").click(function(){

      // Hide it AFTER the action was triggered
      $(".vs-right-nested-table-menu").hide(100);
    });
    $('.vs-rect').dblclick(function(){
      var modal_nested_table = createModal(modal_for_nested_table);
      var rectID = $(this).attr("id");
      var panel_id = "vs-panel-id-"+rectID;
      var modal_id = modal_nested_table.attr("id");
      var modal_call_id = "#"+modal_nested_table.attr("id");
      var span = $("<div class='vs-close-container'><span class='vs-close vs-close-modal' onClick=closeModal('"+modal_id+"'); >&times;</span></div>");
      var panel = $('<div class="vs-panel" id="'+panel_id+'"></div>');
      panel.append(span);
      modal_nested_table.append(panel);
      getTimelineAndTable(rectID, panel);
      $("#vs-visualization").append(modal_nested_table);
      $("#content").addClass("vs-overlay");
      $(modal_call_id).css("display", "block");
      $(".vs-modal").draggable();
      adaptHeightForCss(panel_id, modal_id );

      $(".vs-timeline li").mouseover(function(){
        if($(this).hasClass("vs-has-already-been-selected")){
          $(this).find('div.vs-span-modal-nested-table').show();
        }else{
          $(this).addClass("vs-has-already-been-selected")
          var selected_point = $(this).text();
          var number_of_children = getNumberOfChildren(selected_point);
          $(this).append(number_of_children);
          $(this).find('div.vs-span-modal-nested-table').show();
        }
      });

      $(".vs-timeline li").mouseleave(function(){
        if($(this).hasClass("vs-has-already-been-selected")){
          $(this).find('div.vs-span-modal-nested-table').hide();
        }
      });
      if($("#vs-save-color-combination-checkbox").checked){
        //alert("yees");
      }

    });
  })
})
// backward
function backwardTracingRect(id, operator_name, parent_id){

  var waitForColor = function(color_field, callback) {
    if (document.getElementsByClassName(color_field).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForColor(color, callback);
      }, 100);
    }
  };

  var color_field = "vs-input-backward-tracing";

  waitForColor(color_field, function() {
    var color_backward = document.getElementsByClassName(color_field)[0].value;
    var color_selected = document.getElementsByClassName("vs-input-selected-element")[0].value;
    var element_id = "id("+id+")";
    var search_parent_id = parent_id.replace("parentId","id");
    var search_operator = "operator("+operator_name+")";
    var actuall_operator = "operator("+getNeighbourOperator(operator_name, "forward")+")";

    console.log(color_selected )

    $('.vs-nested-table > g ').each( function (e) {
      var attr = $(this).attr("id").split(" ");
      var id = attr[0];
      if(attr.length == 3){
        var operator = attr[2];
        if(id == element_id && operator == actuall_operator){
          $(this).find("rect").attr("fill",color_selected);
        }
        if(id == search_parent_id && operator == search_operator){
          $(this).find("rect").attr("fill",color_backward);
        }
      }else{
        if(attr.length == 2){
          var operator = attr[1];
          if(id == element_id && operator == actuall_operator){
            $(this).find("rect").attr("fill",color_selected);
          }
          if(id == search_parent_id && operator == search_operator){
            $(this).find("rect").attr("fill",color_backward);
            }
          }
        }
      });
    })
}
// fordward
function forwardTracingRect(id, operator_name){
  var waitForColor = function(color_field, callback) {
    if (document.getElementsByClassName(color_field).length) {
      callback();
    } else {
      setTimeout(function() {
        waitForColor(color, callback);
      }, 100);
    }
  };

  var color_field = "vs-input-forward-tracing";

  waitForColor(color_field, function() {
    var color_forward = document.getElementsByClassName(color_field)[0].value;
    var color_selected = document.getElementsByClassName("vs-input-selected-element")[0].value;
    var search_id = "id("+id+")";
    var search_operator = getNeighbourOperator(operator_name, "forward");
    var actuall_operator = "operator("+operator_name+")";
    if(search_operator){
      search_operator = "operator("+search_operator+")";
      $('.vs-nested-table > g ').each( function (e) {
        var attr = $(this).attr("id").split(" ");
        var id = attr[0];
        if(attr.length == 3){
          var operator = attr[2];
          if(id == search_id && operator == actuall_operator){
            $(this).find("rect").attr("fill",color_selected);
          }
          if(id == search_id && operator == search_operator){
            $(this).find("rect").attr("fill",color_forward);
          }
        }if(attr.length == 2){
          var operator = attr[1];
          if(id == search_id && operator == actuall_operator){
            $(this).find("rect").attr("fill",color_selected);
          }
          if(id == search_id && operator == search_operator){
            $(this).find("rect").attr("fill",color_forward);
          }
        }

      });
    }else{
      console.log("this element was the last output")
    }

  });


}
// to get the children number of selected point and display more information
//into modal for nested data

function getNumberOfChildren(selected_point){
  var count = 0;
  var result;
  for(i=0; i<outputOfEachOperator.length; i++){
    outputOfEachOperator[i].forEach((e) => {
      if(e.hasOwnProperty("children") && e.name == selected_point){
        if(e.children.length === 1){
          result = "<div class='vs-span-modal-nested-table'>This is your input, which means that you have no data that would have been modified here</div>";
          return result;
        }else{
          e.children.forEach((item) => {
            if(typeof item.operator != "undefined"){
              count = count + 1;
            }
          });
          result = "<div class='vs-span-modal-nested-table'>The output number of this operator were "+count+"</div>";
        }
      }
    });
  }
  return result;
}
// get ID of element
function getIdAndOperatorRect(id){
  var id_provenance = id.split(".");
  return id_provenance ;
}
// to get the provenance workflow trought the id
function getTimelineAndTable(id, container){
  var timeline = id.split(".");
  var creade_by_operator;
  var id_of_element;
  var parent_id_of_element;
  var ul = $('<ul class="vs-timeline" id="#vs-timeline"></ul>');
  for( i=0; i<timeline.length;i++){
    if(i==timeline.length-2){
      creade_by_operator = timeline[i];
      //console.log("creade_by_element "+ timeline[i]);
    }
    if(i<timeline.length-1){
      $(ul).append('<li>'+timeline[i]+'</li>');
    }else{
      if (i<timeline.length){
      $(ul).append('<li>ID: '+timeline[i]+'</li>');
      id_of_element = timeline[i]
      var data_from_tupel = getDataFromTupel(timeline[i], creade_by_operator);
      console.log("data_from_tupel ="+data_from_tupel.length)
      var table_information = getTableForDataOfTupel(data_from_tupel, "table-for-modal")
      var table = table_information[0];
      var parent_id_of_element = table_information[1][1];

      }
    }
  }
  var grid = $('<div class="vs-modal-nested-table-content uk-grid" uk-grid></div>');
  var row_for_content = $('<div class="vs-modal-nested-table-tracing uk-width-2-3 uk-padding-remove"></div>');
  var buttons_for_tracing_container = $('<div class="vs-modal-for-tracing-buttons uk-margin-medium-top uk-flex uk-flex-center"></div>');
  var description_for_tracing = $('<div class="vs-container-for-tracing-description uk-flex uk-flex-center uk-margin-top"></div>');
  var row_for_table = $('<div class="vs-modal-nested-table-container uk-box-shadow-medium ">'+table.outerHTML+'</div>');

  row_for_content.append(row_for_table);
  // Get Backward Tracing & Forward Tracing Buttons TODOOO
  // START :: We need this part to do the forward & back. Tracing

  var button_for_backward_tracing;
  var button_for_forward_tracing;

  // Search for the content of the desired id for back. & forward Tracing

  var id_for_forward_tracing = id_of_element;
  var operator_for_tracing = creade_by_operator;
  var has_forward = getNeighbourOperator(operator_for_tracing, "forward");
  var has_backward = getNeighbourOperator(operator_for_tracing, "backward");
  if(has_backward != "false"){
    button_for_backward_tracing = $('<button class="uk-button uk-button-secondary uk-margin-right vs-button-backward-tracing" id="vs-button-backward-tracing" onClick=backwardTracing('+parent_id_of_element+',"'+operator_for_tracing+'"); >Backward Tracing</button>');
    buttons_for_tracing_container.append(button_for_backward_tracing);
  }
  if(has_forward != "false"){
    button_for_forward_tracing = $('<button class="uk-button uk-button-secondary vs-button-forward-tracing" id="vs-button-forward-tracing" onClick=forwardTracing('+id_for_forward_tracing+',"'+operator_for_tracing+'"); >Forward Tracing</button>');
    buttons_for_tracing_container.append(button_for_forward_tracing);
  }

  // Get the right position for the Buttons ( first back. and then forw. Tracing)
  row_for_content.append(buttons_for_tracing_container);
  row_for_content.append(description_for_tracing);


  // END :: Up to this point is end for the forward & back. Tracing
  var row =$('<div class="vs-timeline-container uk-width-1-3 "><h3 class="uk-text-primary">Workflow</h3></div>');
  row.append(ul);
  grid.append(row);
  grid.append(row_for_content);
  container.append(grid);

}
function getDataFromTupel(data_from_tupel, create_by_operator){
  var result =[];
  console.log("data_from_tupel "+data_from_tupel+" "+create_by_operator+ " from getDataFromTupel")
  for(i = 0; i<outputOfEachOperator.length; i++){
    outputOfEachOperator[i].forEach((e) => {
      if(e.hasOwnProperty("children") && e.name === create_by_operator){
        console.log(e);
          e.children.forEach((item) => {
            if(typeof item.operator != "undefined" && item.operator == create_by_operator && item.id == data_from_tupel){
              result.push(item);
            }
        });
      }
    });
  }
  return result;
}
function addHeadersTable(table, keys) {
  var title_duplicate = [];
  var header = table.createTHead();
  var row = table.insertRow(0);
  console.log("keys = "+keys.length);
  keys.forEach(function(key){
    var cell = row.insertCell();
    var text = key.replace("_"," ");
    cell.outerHTML = "<th>"+text+"</th>";
    //console.log(key)

  });
  header.appendChild(row);
}
function getTableForDataOfTupel(data_from_tupel, type){

  var table = document.createElement('table');
  var operator = data_from_tupel[0].operator;
  console.log("operator = "+operator);
  if(type === "table_for_directed_graph"){
    table.setAttribute("class", "vs-table-for-directed-graph");
    var id_for_table = "vs-table-for-directed-graph-"+operator;
    table.setAttribute("id",id_for_table)
  }else{
    table.setAttribute("class", "uk-table uk-table-responsive uk-table-divider vs-modal-table");
  }
  for( var i = 0; i < data_from_tupel.length; i++ ) {

    var child = data_from_tupel[i];
    var get_information_parent_id = getPositionAndElement("parent_id", child);

    var row = table.insertRow();
    Object.keys(child).forEach(function(k , i ) {
      //console.log(i);
      var cell = row.insertCell();
      cell.appendChild(document.createTextNode(child[k]));
    });
  }
  addHeadersTable(table, Object.keys(data_from_tupel[0]));
  return [table, get_information_parent_id] ;
}
function getPositionAndElement(item, array){
  var position;
  var element;
Object.keys(array).forEach((elem, i) => {
    if(elem === item){
      position = i;
      element = array[elem];
    }
  });
  return [position,element];

}
