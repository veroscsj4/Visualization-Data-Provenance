function emptyArray(array){
  array = [];
  return array;
}
function addElementToArray(array, element){
  array.push(element);
  return array;
}
function checkExistElement(array, element){
  for(var i=0; i<array.length; i++){
    if(array[i]==element){
      return true;
    }
  }
  //addElementToArray(array, element);
  return false;
}
function showContent(element, x){
  if(x==true){
    $(element).show();
  }else{
    $(element).hide();
  }
}
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
var id_for_modal= 1;

function closeModal(id){
  //alert(id)
  $("#content").removeClass("vs-overlay");
  var modal_to_close = "#"+id;
  /*if($(modal_to_close).hasClass("vs-modal-for-table")){
    alert("1")
    var get_id = "#"+id;
    var panel_id = "#"+$(get_id).find("div.vs-panel").attr("id");
    $(panel_id).find("div").each(function(){
      $(this).remove();
    });
    $(panel_id).remove();
  }
  if($(modal_to_close).hasClass("vs-modal-nested-table")){
    alert("2")
    var get_id = "#"+id;
    var panel_id = "#"+$(get_id).find("div.vs-panel").attr("id");
    $(panel_id).find("div").each(function(){
      $(this).remove();
    });
    $(panel_id).remove();
  }else{*/

    $(".vs-result-table tbody").find("tr").each(function(){
      if($(this).attr("id") === id){
        $(this).removeClass("vs-row-was-selected");
        $(this).removeAttr("id");
      }
    });
    var table_to_close = "#"+id+" .vs-modal-table" ;
    //$(table_to_close).remove();
    $(modal_to_close).remove();

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
  //}
  //$(modal_to_close).remove();
}

function createModal(modalFor){
  id_for_modal = id_for_modal+1;
  var id = "vs-modal-for-"+modalFor+"-id-"+i;
  var extraClass = "vs-modal-for-"+modalFor;

  if(extraClass){
    modal =$('<div class="vs-modal '+extraClass+' uk-box-shadow-large"></div>').attr("id",id);
  }else{
    modal = $('<div class="vs-modal uk-box-shadow-large"></div>').attr("id",id);
  }

  return modal;
}
// CSS to adapt the backgroud

function adaptHeightForCss(panel_id, modal){
  var panel_height = document.getElementById(panel_id).clientHeight + 30;
  console.log("modal = "+modal);
  var modal = document.getElementsByClassName(modal);
  /*if($(modal_id).hasClass("vs-modal vs-modal-for-table")){
    $(modal_id).hasClass("vs-modal vs-modal-for-table").css({height: panel_height + "px"});
  }if($(modal_id).hasClass("vs-modal")){
    $(modal_id).css({height: panel_height + "px"});
    $("vs-modal-for-table").css({height: panel_height + "px  !important"});
  }*/
  var has_class = checkIfhasClass(modal, 'vs-modal-for-table');
  if(has_class == true){
  //alert("yees");
    document.getElementById(modal).css({height: panel_height + "px"});
  }
  //$(modal).css({height: panel_height + "px"});
}
function checkIfhasClass(element, cls){
  console.log(element.className);
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


$( document ).ready(function() {

});
