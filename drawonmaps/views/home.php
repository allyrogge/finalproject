<?php 
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * File: home.php
 * Description: Home page
 */
?>

	<div class="container">
		<h3 class="doc_title"><?php echo $vars['page_title']; ?></h3>
		
		<div class="jumbotron">
			<div>&nbsp;</div>
			<img src="images/drawonmaps.png" alt="Google Maps Draw Module" class="img-rounded home">
			<p>Google Maps Draw Module is a useful tool for web developers who want to build web apps for creating maps and draw shapes in the front end. It is based on modern tools such as Google API v3, jQuery, Javascript, Bootstrap, HTML5 and CSS3.</p>
			<p>This module provides a responsive web interface to users for adding markers and drawing polygons, rectangles, polylines and circles in order to create maps online. Users are able to add/edit/delete objects on Google Maps. Also users can enter title and description for all objects they create.</p>
			<p>Basic information of all objects added (title, coords) are located in HTML input elements, so developers can use them  in any way by submitting the form.</p>
			<p>The module has a geocoding tool for searching an area and center map on this location.</p>
			<p>For a full demonstration of Google Maps Draw Module, PHP and Mysql was used for storing maps created in database, for loading objects to display on map, editing and deletings maps.</p>
			<p><a href="index.php?p=map_create" class="btn btn-primary active" role="button">Create Map</a> <a href="index.php?p=maps" class="btn btn-primary active" role="button">Browse Maps</a></p>
		</div>
	</div> <!-- /container -->


