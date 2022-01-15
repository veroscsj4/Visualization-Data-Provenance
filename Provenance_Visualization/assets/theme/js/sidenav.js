var nameOfAllOperator = [];
var outputOfEachOperator = [];
var modal_for_table = "table";
var id_for_container_tracing = 1;
var id_for_table_tracing = 1;
var modal_table;
var split_tracing;
modal_table = createModal(modal_for_table);

/* ********** Creade function to get information of the dataset or json file *********** */
/*
The json File has a nested structure,
that is the reason why we need to use the principle of recursion
*/
function sendObject(data){
  getObject(data);
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
function getData(theObject) {
    var result = null;
    if(theObject instanceof Array) {
        for(var i = 0; i < theObject.length; i++) {
            result = getData(theObject[i]);
        }
    }
    else
    {
        for(var prop in theObject) {
            //console.log(prop + ': ' + theObject[prop]);
            if(prop == 'children') {
                //console.log(prop + ': ' + theObject[prop]);
                outputOfEachOperator.push(theObject[prop]);
                if(theObject[prop] == 1) {
                    return theObject;
                }
            }
            if(theObject[prop] instanceof Object || theObject[prop] instanceof Array)
                result = getData(theObject[prop]);
        }
    }
    return result;
}
function getProcessedDataOfOperatorName(outputOfEachOperator, matchValue){
  var output = [];
  for(var i = 0; i<outputOfEachOperator.length; i++){
    for(var k = 0 ; k< outputOfEachOperator[i].length; k++ ){
      if(outputOfEachOperator[i][k].hasOwnProperty('operator')){
        if(outputOfEachOperator[i][k].operator === matchValue){
          output.push(outputOfEachOperator[i][k]);
        }
      }
    }
  }
  return output;
}
function addHeaders(table, keys) {
  var thead = $('<thead></thead>');
  var row = $("<tr></tr>");
  $(thead).append(row);
  for( var i = 0; i < keys.length; i++ ) {
    var content = keys[i].replace("_", " ");
    var cell = $("<th>"+content+"</th>");
    $(row).append(cell);
  }
  $(table).append(thead);
}

function getTable(data, matchValue){
  if($(".vs-result-table ").length > 0){
    $(".vs-result-table ").remove();
    $(".dataTables_length").remove();
    $(".dataTables_filter").remove();
    $(".dataTables_info").remove();
    $(".dataTables_paginate").remove();
    $(".dataTables_wrapper").remove();
    var waitForEl = function(selector, callback) {

      var table = document.getElementsByClassName(selector);
      var table_id="#"+$(table).attr("id");

      if (document.getElementsByClassName(selector).length) {
        callback();
      } else {
        setTimeout(function() {
          waitForEl(selector, callback);
        }, 100);
      }
    };
    var selector = "vs-result-table";
    waitForEl(selector, function() {
      var table = document.getElementsByClassName(selector);
      var table_id="#"+$(table).attr("id");
      $(table_id).DataTable({
        "scrollY":        '50vh',
        "scrollCollapse": true,
        "search":         true,
      });
      $(".dataTables_scrollHeadInner table").removeClass("vs-result-table");
      $(".dataTables_scrollHeadInner table").addClass("vs-get-header");
      // Add modal for row, to show info;
      $(".vs-result-table tbody tr").on("click", function(){
        if($(this).hasClass("vs-row-was-selected")){
          alert("this row was already selected before, please check the 'your selected data' area");
        }else{
          modal_table = createModal(modal_for_table);
          var modal_table_id= modal_table.attr("id");
          var panel_id = "vs-panel-id-"+modal_table_id;
          var span = $("<span class='vs-close vs-close-modal' onClick=closeModal('"+modal_table_id+"'); >&times;</span>");
          var panel = $('<div class="vs-panel" id="'+panel_id+'"></div>');
          var modal_for_table_container = $('<div class="vs-modal-for-table-container">');
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
    });

  }
  var table_id= "vs-result-table-"+matchValue;
  var table = $('<table class="uk-table vs-result-table display '+table_id+'" style="width:100%" id="vs-result-table-'+matchValue+'"></table>');
  var tbody = $("<tbody></tbody>");
  for(var i = 0; i< data.length; i++){
    var object = data[i];
    if(i===0){
      addHeaders(table, Object.keys(object));
    }
    var row = $("<tr></tr>");
    Object.keys(object).forEach(function(k) {
      //console.log(k);
      row.append($('<td>'+object[k]+'</td>'));
      //cell.appendChild(document.createTextNode(child[k]));
    })

    tbody.append(row);
  }
  $(table).append(tbody);

  return [table, table_id] ;

}
// Find position of the Operator, to know in wich direction to look for the next element (back. & forw. Tracing)

function findPositionOfOperator(table){
  var result = [];
  var number_of_th = $(table).find("th").length;
  for(i = 0 ; i< number_of_th; i++){
    if($(".vs-get-header thead tr ").find("th")[i].innerHTML === "operator"){
      var operator_position = i;
    }
  }
  if(operator_position){
    result["operator_position"] = operator_position;
  }
  return result;
}
// Find the position of the ID and Parend Id from the Modal Table to get them and do function back- forward tracing
function findPositionOFId(table){
  var result = [];
  var number_of_th = $(table).find("th").length;
  for(i = 0 ; i< number_of_th; i++){
    if($(".vs-get-header thead tr ").find("th")[i].innerHTML === "id"){
      var id_position = i;
    }
    if($(".vs-get-header thead tr ").find("th")[i].innerHTML === "parent id"){
      var parent_id_position = i
    }
  }
  if(id_position){
    result["id_position"] = id_position;
  }
  if(parent_id_position){
    result["parent_id_position"] = parent_id_position;
  }
  return result;
}
//forward Tracing

function forwardTracing(id,operator){
  var typeOfTracing = "forward";
  document.getElementById("vs-button-forward-tracing").disabled = true;
  var next_operator_name = getNeighbourOperator(operator, typeOfTracing);
  var modal = document.getElementsByClassName("vs-modal")[0];
  var old_height = modal.clientHeight;
  var new_height = modal.clientHeight + 120;
  if( next_operator_name != false){
    var description_container_forwad_tracing = document.createElement("div");
    description_container_forwad_tracing.setAttribute("class","vs-description_container_forwad_tracing");
    var describe_for_forward_tracing_input = document.createElement("input");
    describe_for_forward_tracing_input.setAttribute('type','checkbox');
    describe_for_forward_tracing_input.setAttribute('name','vs-checkbox-forward-tracing');
    describe_for_forward_tracing_input.setAttribute('class','vs-input-forward-tracing');

    var describe_for_forward_tracing_label = document.createElement("label");
    describe_for_forward_tracing_label.setAttribute('for','vs-checkbox-forward-tracing');
    describe_for_forward_tracing_label.setAttribute('class','vs-label-forward-tracing');
    var describe_for_forward_tracing_span_for_text = document.createElement("span");
    describe_for_forward_tracing_span_for_text.innerHTML = 'Forward Tracing';
    var describe_for_forward_tracing_span = document.createElement("span");
    describe_for_forward_tracing_span.setAttribute('class','vs-checkmark-forward');

    describe_for_forward_tracing_label.appendChild(describe_for_forward_tracing_input);
    describe_for_forward_tracing_label.appendChild(describe_for_forward_tracing_span);
    describe_for_forward_tracing_label.appendChild(describe_for_forward_tracing_span_for_text);

    var describe_for_tracing_container = document.getElementsByClassName("vs-container-for-tracing-description")[0];
    description_container_forwad_tracing.appendChild(describe_for_forward_tracing_label);
    describe_for_tracing_container.appendChild(description_container_forwad_tracing);

    var forward_tracing_data = getProcessedDataByData(outputOfEachOperator, id, next_operator_name );
    // If the forward tracing is to big, give the option to display it in a extra table.
    if(forward_tracing_data.length > 3){
      if(document.getElementsByClassName("vs-container-table-tracing").length > 0){
        var alert_to_continue = createAlert("alert_to_continue");
        modal.appendChild(alert_to_continue);
        var modal_height_with_alert = modal.clientHeight + 160
        modal.style.height = modal_height_with_alert + "px";

      }else{
        var alert_container = createAlert("alert_in_modal");
        var modal = document.getElementsByClassName("vs-modal")[0];
        modal.appendChild(alert_container);
        modal.style.height = new_height + "px";
      }
      document.getElementById('vs-display-forward-table').addEventListener("click", function() {
        if(typeof split_tracing != 'undefined'){
          split_tracing.destroy();
        }
        var waitForForwardTable = function(selectorForForwardTable, callback) {
          if (document.getElementsByClassName(selectorForForwardTable).length) {
            callback();
          } else {
            setTimeout(function() {
              waitForForwardTable(selectorForForwardTable, callback);
            }, 100);
          }
        };
        var selectorForForwardTable = "vs-table-forward-tracing";
        waitForForwardTable(selectorForForwardTable, function() {
          var table = document.getElementsByClassName(selectorForForwardTable);
          var table_id="#"+$(table).attr("id");
          $(table_id).DataTable({
            "scrollY":        '50vh',
            "scrollX":true,
            "scrollCollapse": true,
            "search":         true,
          });
          split_tracing = Split(['#vs-table','.vs-container-table-tracing'],{
            direction: 'horizontal',
            cursor:'col-resize',
            gutterSize: 10,
          })
        });

        var table_forward_container = createTracingContainer(typeOfTracing,id,operator);
        var table_forward = document.createElement("table");
        var id_for_table_forward = "vs-table-forward-tracing-"+ id_for_table_tracing;
        id_for_table_tracing++;
        table_forward.setAttribute("class","vs-table-forward-tracing")
        table_forward.setAttribute("id", id_for_table_forward);

        var alert_to_close = "vs-modal-alert";
        addHeaders(table_forward, Object.keys(forward_tracing_data[0]));
        var tbody = document.createElement("tbody");
        for(i=0 ; i<forward_tracing_data.length ; i++){
          var tr = tbody.insertRow();
          tr.setAttribute("class", "vs-forward-tracing-row");
          for(var key in forward_tracing_data[i]){
            var td = tr.insertCell();
            var td_text = document.createTextNode(forward_tracing_data[i][key]);
            td.appendChild(td_text);
          }
        }
        table_forward.append(tbody);
        table_forward_container.append(table_forward);
        table_forward_container.style.width = "50%";
        event.preventDefault();
        document.getElementsByClassName("vs-bottom-splitter")[0].appendChild(table_forward_container);
        document.getElementById("vs-table").style.width = "50%";
        closeAlert(alert_to_close, "id");
        modal.style.height = old_height + "px";

      });
      document.getElementById('vs-not-display-forward-table').addEventListener("click", function() {
        var alert_to_close = "vs-modal-alert";
        closeAlert(alert_to_close, "id");
        modal.style.height = old_height + "px";
      })
    }
    var tbody = document.getElementsByClassName("vs-modal-table")[0].getElementsByTagName("tbody")[0];
    var thead_update = document.getElementsByClassName("vs-modal-table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    var th_current_elements = [];
    var th_get_current_elements = document.getElementsByClassName("vs-modal-table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th");

    for( var i=0 ; i<th_get_current_elements.length; i++){
      var th_current_text = th_get_current_elements[i].innerHTML;
      th_current_elements.push(th_current_text);
    }
    var th_elements_list = [];
    for(i=0 ; i<forward_tracing_data.length ; i++){
      var tr = tbody.insertRow();
      tr.setAttribute("class", "vs-forward-tracing-row");
      for(var key in forward_tracing_data[i]){
        // Insert new Attribute to head
        var new_key = key.replace("_"," ");
        if((th_current_elements.includes(new_key) != true) && (th_elements_list.includes(new_key) != true)){
          var th = document.createElement("th");
          th.setAttribute("class","vs-forward-tracing-th");
          var th_text = document.createTextNode(new_key);
          th.appendChild(th_text);
          thead_update.appendChild(th);
          th_elements_list.push(new_key);
        }
        // Insert new Data into Body
        var td = tr.insertCell();
        var td_text = document.createTextNode(forward_tracing_data[i][key]);
        td.appendChild(td_text);
      }
    }
  }else{
    console.log("this was the last output");
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
  var selector_modal = "vs-forward-tracing-row";
  waitForModalTable(selector_modal, function() {

    $(".vs-modal-table tbody tr.vs-forward-tracing-row").on("click", function(){
      //alert("was")
      $(this).addClass("vs-selected-row");
    })
  })
  //var data = getProcessedDataByData(outputOfEachOperator, id , typeOfTracing)
}
//backward Tracing
function backwardTracing(parent_id,operator){
  var typeOfTracing = "backward";
  document.getElementById("vs-button-backward-tracing").disabled = true;
  var next_operator_name = getNeighbourOperator(operator, typeOfTracing);
  var modal = document.getElementsByClassName("vs-modal")[0];
  if (modal.classList.contains("vs-modal-for-nested-table")) {
    var old_height = modal.clientHeight;
    var new_height = modal.clientHeight + 160;
  }else{
    var old_height = modal.clientHeight;
    var new_height = modal.clientHeight + 120;
  }
  if( next_operator_name != false){
    var description_container_backward_tracing = document.createElement("div");
    description_container_backward_tracing.setAttribute("class","vs-description_container_backward_tracing");
    var describe_for_backward_tracing_input = document.createElement("input");
    describe_for_backward_tracing_input.setAttribute('type','checkbox');
    describe_for_backward_tracing_input.setAttribute('name','vs-checkbox-backward-tracing');
    describe_for_backward_tracing_input.setAttribute('class','vs-input-backward-tracing');

    var describe_for_backward_tracing_label = document.createElement("label");
    describe_for_backward_tracing_label.setAttribute('for','vs-checkbox-backward-tracing');
    describe_for_backward_tracing_label.setAttribute('class','vs-label-backward-tracing');
    var describe_for_backward_tracing_span_for_text = document.createElement("span");
    describe_for_backward_tracing_span_for_text.innerHTML = 'Backward Tracing';
    var describe_for_backward_tracing_span = document.createElement("span");
    describe_for_backward_tracing_span.setAttribute('class','vs-checkmark-backward');

    describe_for_backward_tracing_label.appendChild(describe_for_backward_tracing_input);
    describe_for_backward_tracing_label.appendChild(describe_for_backward_tracing_span);
    describe_for_backward_tracing_label.appendChild(describe_for_backward_tracing_span_for_text);

    var describe_for_tracing_container = document.getElementsByClassName("vs-container-for-tracing-description")[0];
    description_container_backward_tracing.appendChild(describe_for_backward_tracing_label);
    describe_for_tracing_container.appendChild(description_container_backward_tracing);

    var backward_tracing_data = getProcessedDataByData(outputOfEachOperator, parent_id, next_operator_name );

    // If the forward tracing is to big, give the option to display it in a extra table.
    if(backward_tracing_data.length > 3){
      if(document.getElementsByClassName("vs-container-table-tracing").length > 0){
        var alert_to_continue = createAlert("alert_to_continue");
        modal.appendChild(alert_to_continue);
        if (modal.classList.contains("vs-modal-for-nested-table")) {
          var modal_height_with_alert = modal.clientHeight + 200;
          modal.style.height = modal_height_with_alert + "px";
        }else{
          var modal_height_with_alert = modal.clientHeight + 160;
          modal.style.height = modal_height_with_alert + "px";
        }
      }else{
        var alert_container = createAlert("alert_in_modal");
        var modal = document.getElementsByClassName("vs-modal")[0];
        modal.appendChild(alert_container);
        modal.style.height = new_height + "px";
      }
      document.getElementById('vs-display-forward-table').addEventListener("click", function() {
        if(typeof split_tracing != 'undefined'){
          split_tracing.destroy();
        }
        var waitForForwardTable = function(selectorForBackwardTable, callback) {
          if (document.getElementsByClassName(selectorForBackwardTable).length) {
            callback();
          } else {
            setTimeout(function() {
              waitForForwardTable(selectorForBackwardTable, callback);
            }, 100);
          }
        };
        var selectorForBackwardTable = "vs-table-backward-tracing";
        waitForForwardTable(selectorForForwardTable, function() {
          var table = document.getElementsByClassName(selectorForBackwardTable);
          var table_id="#"+$(table).attr("id");
          $(table_id).DataTable({
            "scrollY":        '50vh',
            "scrollX":true,
            "scrollCollapse": true,
            "search":         true,
          });
          split_tracing = Split(['#vs-table','.vs-container-table-tracing'],{
            direction: 'horizontal',
            cursor:'col-resize',
            gutterSize: 10,
          })
        });

        var table_backward_container = createTracingContainer(typeOfTracing,id,operator);
        var table_backward = document.createElement("table");
        var id_for_table_backward = "vs-table-backward-tracing-"+ id_for_table_tracing;
        id_for_table_tracing++;
        table_forward.setAttribute("class","vs-table-backward-tracing")
        table_forward.setAttribute("id", id_for_table_backward);
        var alert_to_close = "vs-modal-alert";
        addHeaders(table_backward, Object.keys(backward_tracing_data[0]));
        var tbody = document.createElement("tbody");
        for(i=0 ; i<forward_backward_data.length ; i++){
          var tr = tbody.insertRow();
          tr.setAttribute("class", "vs-backward-tracing-row");
          for(var key in backward_tracing_data[i]){
            var td = tr.insertCell();
            var td_text = document.createTextNode(backward_tracing_data[i][key]);
            td.appendChild(td_text);
          }
        }
        table_backward.append(tbody);
        table_backward_container.append(table_backward);
        table_backward_container.style.width = "50%";
        document.getElementsByClassName("vs-bottom-splitter")[0].appendChild(table_backward_container);
        document.getElementById("vs-table").style.width = "50%";
        closeAlert(alert_to_close, "id");
        modal.style.height = old_height + "px";

      });
      document.getElementById('vs-not-display-backward-table').addEventListener("click", function() {
        var alert_to_close = "vs-modal-alert";
        closeAlert(alert_to_close, "id");
        modal.style.height = old_height + "px";
      })
    }
    var tbody = document.getElementsByClassName("vs-modal-table")[0].getElementsByTagName("tbody")[0];
    var thead_update = document.getElementsByClassName("vs-modal-table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0];
    var th_current_elements = [];
    var th_get_current_elements = document.getElementsByClassName("vs-modal-table")[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].getElementsByTagName("th");

    for( var i=0 ; i<th_get_current_elements.length; i++){
      var th_current_text = th_get_current_elements[i].innerHTML;
      th_current_elements.push(th_current_text);
    }
    var th_elements_list = [];
    for(i=0 ; i<backward_tracing_data.length ; i++){
      var tr = tbody.insertRow();
      tr.setAttribute("class", "vs-backward-tracing-row");
      for(var key in backward_tracing_data[i]){
        // Insert new Attribute to head
        var new_key = key.replace("_"," ");
        if((th_current_elements.includes(new_key) != true) && (th_elements_list.includes(new_key) != true)){
          var th = document.createElement("th");
          th.setAttribute("class","vs-backward-tracing-th");
          var th_text = document.createTextNode(new_key);
          th.appendChild(th_text);
          thead_update.appendChild(th);
          th_elements_list.push(new_key);
        }
        // Insert new Data into Body
        var td = tr.insertCell();
        var td_text = document.createTextNode(backward_tracing_data[i][key]);
        td.appendChild(td_text);
      }
    }
  }else{
    console.log("this was the first output");
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

    $(".vs-modal-table tbody tr.vs-backward-tracing-row").on("click", function(){
      alert("was")
      $(this).addClass("vs-selected-row");
    })

  })

}
// get next or before operator name
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
function getProcessedDataByData(outputOfEachOperator, id, matchValue ){
  var output = [];
  for(var i = 0; i<outputOfEachOperator.length; i++){
    for(var k = 0 ; k< outputOfEachOperator[i].length; k++ ){
      if(outputOfEachOperator[i][k].hasOwnProperty('operator')){
        if(outputOfEachOperator[i][k].operator === matchValue && outputOfEachOperator[i][k].id === id || outputOfEachOperator[i][k].operator === matchValue && outputOfEachOperator[i][k].parent_id === id ){
          output.push(outputOfEachOperator[i][k]);
          //console.log(outputOfEachOperator[i][k]);
        }
      }
    }
  }
  return output;
}
function createAlert(typeOfAlert){
  if(typeOfAlert === "alert_in_modal"){
    var alert_container = document.createElement("div");
    var alert_content = document.createTextNode("This element has many successors, which makes it difficult to visualise them here. Do you want to see them in another window?")
    var alert_content_buttons = document.createElement("div");
    var button_continue = document.createElement("button");
    var button_stop = document.createElement("button");
    alert_container.setAttribute("class","uk-alert-warning uk-padding-small uk-margin-top uk-margin-bottom");
    alert_container.setAttribute("id","vs-modal-alert");
    alert_content_buttons.setAttribute("class","uk-flex uk-flex-center uk-margin-top");
    button_continue.setAttribute("class", "uk-button-secondary uk-button uk-margin-left");
    button_continue.setAttribute("id", "vs-display-forward-table");
    button_stop.setAttribute("class", "vs-not-display-forward-table uk-button-secondary uk-button");
    button_stop.setAttribute("id", "vs-not-display-forward-table");
    button_continue.innerHTML = "Yes, please";
    button_stop.innerHTML = "No, Thanks";
    alert_container.appendChild(alert_content);
    alert_content_buttons. appendChild(button_stop);
    alert_content_buttons.appendChild(button_continue);
    alert_container.appendChild(alert_content_buttons);
    return alert_container;
  }
  if(typeOfAlert === "alert_to_continue"){
    var modal_for_continue = document.createElement("div");
    modal_for_continue.setAttribute("class", "vs-modal uk-alert-warning uk-padding-small uk-margin-top vs-modal-for-continue");
    var modal_for_continue_container = document.createElement("div");
    modal_for_continue_container.setAttribute("class", "vs-modal-for-continue-container");
    var modal_for_continue_text = document.createElement("p");
    modal_for_continue_text.innerHTML = "This element has many successors, which makes it difficult to visualise them here. You can visuaise them in another window. But you have already displayed a table with forward type content, if you want to display this information, the previous information will be removed. However, do you want to continue?";
    var modal_for_continue_buttons_container = document.createElement("div");
    modal_for_continue_buttons_container.setAttribute("class","uk-flex uk-flex-center");
    var button_continue = document.createElement("button");
    button_continue.setAttribute("class","uk-button uk-button-secondary uk-margin-left");
    button_continue.setAttribute("id","vs-display-forward-table");
    button_continue.innerHTML = "Yes, please";
    var function_to_close = "closeTracingContainer('"+"vs-container-table-tracing"+"')";
    button_continue.setAttribute("onclick",function_to_close);
    var button_stop = document.createElement("button");
    button_stop.setAttribute("class","uk-button uk-button-secondary");
    button_stop.innerHTML = "No, thanks";
    var function_to_close = "closeTracingContainer('"+"vs-modal-for-continue"+"')";
    button_stop.setAttribute("onclick",function_to_close);
    modal_for_continue_buttons_container.appendChild(button_stop);
    modal_for_continue_buttons_container.appendChild(button_continue);
    modal_for_continue_container.appendChild(modal_for_continue_text);
    modal_for_continue.appendChild(modal_for_continue_container);
    modal_for_continue.appendChild(modal_for_continue_buttons_container);
    return modal_for_continue;

  }
}
function closeAlert(alert_to_close, classOrId){
  if(classOrId === "id"){
    document.getElementById(alert_to_close).remove();
  }
  if(classOrId === "class"){
    document.getElementsByClassName(alert_to_close)[0].remove();
    if(split_tracing.length){
      split_tracing.destroy;
    }
  }
}
//Create Container to display Tracing Results
function createTracingContainer(typeOfTracing,id,operator){
  var general_class_of_tracing_container = "vs-container-table-tracing";
  var table_tracing_container = document.createElement("div");
  table_tracing_container.setAttribute("class","vs-container-table-tracing");
  var table_forward_title_container = document.createElement("div");
  table_forward_title_container.setAttribute("class", "uk-flex uk-background-primary uk-padding-small uk-margin-bottom");
  var table_forward_title = document.createElement("p");
  table_forward_title.setAttribute("class","uk-h2 uk-light");
  var button_for_close_function = document.createElement("button");
  button_for_close_function.setAttribute("class", "uk-button uk-button-secondary uk-margin-large-left");
  button_for_close_function.innerHTML = "Close";
  var function_to_close = "closeTracingContainer('"+"vs-container-table-tracing"+"')";
  button_for_close_function.setAttribute("onclick",function_to_close);
  id_for_container_tracing++;
  if(typeOfTracing === "forward"){
    var id_for_table_forward_container = "vs-container-table-forward-tracing-"+operator+"-"+id;
    table_tracing_container.setAttribute("id",id_for_table_forward_container);
    table_forward_title.innerHTML = "Forward Tracing Table from "+operator+" with ID: "+id;
  }
  if(typeOfTracing === "backward"){
    var id_for_table_backward_container = "vs-container-table-backward-tracing-"+id_for_container_tracing;
    table_tracing_container.setAttribute("id",id_for_table_forward_container);
    table_forward_title.innerHTML = "Backward Tracing Table from "+operator+" with ID: "+id;
  }
  table_forward_title_container.appendChild(table_forward_title);
  table_forward_title_container.appendChild(button_for_close_function);
  table_tracing_container.appendChild(table_forward_title_container);
  return table_tracing_container;

}
function closeTracingContainer(general_class_of_tracing_container){
  if(document.getElementsByClassName(general_class_of_tracing_container).length){
    document.getElementsByClassName(general_class_of_tracing_container)[0].remove();
    if(typeof split_tracing != 'undefined'){
      //split_tracing.destroy();
    }
    if(document.getElementsByClassName("vs-modal-for-continue-container").length){
      closeAlert("vs-modal-for-continue-container", "class");
      closeAlert("vs-modal-for-continue", "class");
    }
  }
}

$(document).ready(function(){
  $("#sidenav").append("<div class='vs-select'><select id='select-operator' class='vs-select-field'></select></div>");
  $("#select-operator").append('<option value="0">Select Operator</option>');
  $("#sidenav").append('<div class="vs-droppable-container"><div class="uk-background-secondary uk-padding-small"><p class="uk-margin-remove-bottom uk-light uk-text-center">Your selected Data<p></div><div class="vs-droppable"></div></div>');
  if(existFiletoDisplay > 0 ){
    $.getJSON("data/data.json", function(data){
      sendObject(data);
      getData(data);
      // Read the Operator Names in File and show it in Sidenav
      for(var i = 0; i<nameOfAllOperator.length; i++){
        var x = i+1
        var option = '<option value="'+ x + '">'+nameOfAllOperator[i]+'</option>';
        $("#select-operator").append(option);
      }
      $('#select-operator').change(function(){
        event.preventDefault();
        var matchValue = $('#select-operator option:selected').text();
        var output = getProcessedDataOfOperatorName(outputOfEachOperator, matchValue);
        var values = getTable(output, matchValue);
        var table = values[0];
        var table_id = values[1];
        if($('#vs-table').children().length > 0 ){
          $("#vs-table").empty();
        }
        $('#vs-table').append(table);
      })
    });
    $('.vs-droppable').droppable({
      accept: ".vs-modal", drop: function(event, ui){
        //$(ui.draggable).addClass("vs-accordion");
        //$(ui.draggable).siblings(".vs-panel").addClass("vs-accordion-panel");
        var dropped = ui.draggable;
        var droppedOn= $(this);
        //var dropped_id ="#"+$(dropped).detach().attr("id");
        $(dropped).detach().css({top:0, left: 0}).appendTo(droppedOn);
        $("#content").removeClass("vs-overlay");
        //updateAccordion();
      }
    });

    $('.vs-droppable').accordion({
      active: false,
      collapsible: true
    });

    $('#vs-visualization').droppable({
      accept: ".vs-modal", drop: function(event, ui){
        var dropped = ui.draggable;
        var droppedOn= $(this);
        $(dropped).detach().css({top:0, left: 0}).appendTo(droppedOn);
        $("#content").addClass("vs-overlay");
      }
    });

  }

})
function saveTable(table){
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

    var i = 0
    var j = 0
    var operator;
    var content;
    var container_div = $('<div class="vs-selected-data"></div>')
    var tbody = $('<tbody></tbody>');
    var table_for_accordion = $('<table class="uk-table uk-table-responsive uk-table-divider vs-table-accordion""></table>');
    var thead = $('<thead></thead>');
    var row = $('<tr></tr>');

    $(".vs-modal-table thead tr").find("th").each(function(){
      row.append('<th>'+$(this).text()+'</th>');
    });

    thead.append(row);
    table_for_accordion.append(thead);

    $(".vs-modal-table tbody").find("tr.vs-selected-row").each(function(){
      body_row = $('<tr></tr>')
      $(this).find('td').each(function(){
        body_row.append('<td>'+$(this).text()+'</td>');
      })
      tbody.append(body_row);
    });

    var title = $('<h4><a href="#">Element</a></h4>')




    table_for_accordion.append(tbody);

    //container_div.append(title)
    container_div.append(table_for_accordion)

    $('.vs-droppable').append(title)
    $('.vs-droppable').append(container_div)
    $('.vs-droppable').accordion("refresh");

  })
}
