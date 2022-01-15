<?php
$formats = array(".json");
$true = 0;
$fileName = 'Please upload a File';
if(isset($_POST['button'])){ //si existe memoria en boton es porque alguien subio un archivo
  $fileName = $_FILES['data']['name'];//obtener el nombre del archivo
  $tmpFileName = $_FILES['data']['tmp_name'];//obtener un nombre temporal del archivo
  $ext = substr($fileName, strrpos($fileName,'.')); //con strrpos miras el ultimo punto , substr(donde emieza, donde termina), para ver si el archivo es en el formato esperado
  if(in_array($ext, $formats)){
    if(move_uploaded_file($tmpFileName, "data/data.json")){
      $true = 1; ?>
      <div class="vs-advert uk-alert-success uk-padding-small">
        <p class="uk-margin-remove-bottom">You file <strong><?php echo $fileName ?></strong> was successfully uploaded</p>
      </div>
    <?php }else
    {
      $true = 0;
      echo '<div class="vs-advert uk-alert-warning uk-padding-small"><p class="uk-margin-remove-bottom">An error has occurred</p></div>';
    }

  }else{
    $true = -1;
    echo '<div class="vs-advert uk-alert-danger uk-padding-small"><p class="uk-margin-remove-bottom">File not allowed, please upload only json files.</p></div>';
  }

}else{
  //echo "nothing";
}
?>
<script>
var existFiletoDisplay = <?php echo $true; ?>;
$(document).ready(function(){
  var dataName = <?php echo "'".$fileName."'"?>;
  if(existFiletoDisplay>0){
    $('.vs-main-menu').append('<li><div class="uk-background-muted" ><div class="uk-background-secondary uk-padding-small"><p class="uk-margin-remove-bottom">You are analyzing:</p></div><div class="uk-padding-small vs-text-color"><p class="uk-text-center uk-margin-remove-bottom">'+dataName+'</p></div></div></li>');
    $('#content').append('<div class="vs-splitter uk-grid uk-margin-remove-left" id="vs-visualization" uk-grid></div>');
    $('.vs-splitter').append('<div class="vs-top-splitter uk-width-1-1 uk-padding-remove-left"></div>');
    $('.vs-splitter').append('<div class="vs-bottom-splitter uk-width-1-1 uk-padding-remove-left"></div>');
    $('.vs-bottom-splitter').append('<div id="vs-table"></div>');
    $('.vs-top-splitter').append('<div id="vs-graph" class="vs-graph"></div>');
    $('.vs-top-splitter').append('<div id="vs-pie"></div>');

    $('#sidenav').append('<ul class="sidena"></ul>');

    Split(['#vs-graph','#vs-pie'],{
      direction: 'horizontal',
      cursor:'col-resize',
      gutterSize: 10,
    })
    Split(['.vs-top-splitter','.vs-bottom-splitter'],{
      direction: 'vertical',
      cursor:'row-resize',
      gutterSize: 10,
    })

  }
  setTimeout(function() {
      $(".vs-advert").fadeOut(1500);
  },3000);


})

</script>
