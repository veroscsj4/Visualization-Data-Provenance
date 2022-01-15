<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="description" content="">
	<title>Provenance Visualization</title>
	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<!-- Bootstrap -->
	<link rel="stylesheet" href="uikit-3/css/uikit.min.css" />
	<script src="uikit-3/js/uikit.min.js"></script>
	<script src="uikit-3/js/uikit-icons.min.js"></script>
	<!-- jQueryUI styling -->
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<!-- Custom styling -->
	<link rel="stylesheet" href="assets/theme/css/main.css">

	<!-- External JS libraries -->
	<script src="https://d3js.org/d3.v4.min.js"></script>
	<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="crossorigin="anonymous"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
	<!-- Split -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min.js"></script>
	<!-- DataTables -->
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.0/css/jquery.dataTables.css">
	<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.0/js/jquery.dataTables.js"></script>


	<script src="assets/theme/js/functions.js"></script>

	<!-- button export datei -->
	<?php include("assets/theme/php/php_functions/upload.php") ?>
</head>
<?php include('template/header/center.php'); ?>
<body>
	<div class="uk-grid-collapse uk-flex uk-flex-stretch vs-container-for-visualization-of-data" uk-grid>
		<div class="uk-width-1-4@s uk-width-1-4@m uk-width-1-6@l uk-background-primary" id="sidenav"></div>
		<div class="uk-width-3-4@s uk-width-3-4@m uk-width-5-6@l uk-position-relative" id="content"></div>
	</div>






	<!-- Custom JS -->
	<script src="assets/theme/js/vsDataTable.js"></script>
	<script src="assets/theme/js/sidenav.js"></script>
	<script src="assets/theme/js/directedGraph.js"></script>
	<script src="assets/theme/js/displayTable.js"></script>
	<script src="assets/theme/js/displayFile.js"></script>
	<script src="assets/theme/js/displayTableFunctions.js"></script>
	<script src="assets/theme/js/__displayGraph.js"></script>
	<!-- D3 Tip  -->
	<script src="assets/theme/js/d3-tip.js"></script>




</body>
</html>
