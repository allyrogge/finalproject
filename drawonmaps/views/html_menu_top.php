<?php
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * File: html_menu_top.php
 * Description: Site menu
 */
?>
 
	<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
		<div class="container">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="index.php"><?php echo $lang_msg['MENU_LOGO']; ?></a>
			</div>
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav">
					<li<?php echo ($page=='home'?' class="active"':''); ?>><a href="index.php"><?php echo $lang_msg['MENU_HOME']; ?></a></li>
					<li<?php echo ($page=='map_create'?' class="active"':''); ?>><a href="index.php?p=map_create"><?php echo $lang_msg['MENU_CREATE_MAP']; ?></a></li>
					<li<?php echo ($page=='maps'?' class="active"':''); ?>><a href="index.php?p=maps"><?php echo $lang_msg['MENU_BROWSE_MAPS']; ?></a></li>
					<li<?php echo ($page=='map_global'?' class="active"':''); ?>><a href="index.php?p=map_global"><?php echo $lang_msg['MENU_GLOBAL_MAP']; ?></a></li>
					<!--
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span class="caret"></span></a>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#">Action</a></li>
							<li><a href="#">Another action</a></li>
							<li><a href="#">Something else here</a></li>
							<li class="divider"></li>
							<li class="dropdown-header">Nav header</li>
							<li><a href="#">Separated link</a></li>
							<li><a href="#">One more separated link</a></li>
						</ul>
					</li>
					-->
				</ul>

				<ul class="nav navbar-nav navbar-right">
					<li><a href="http://codecanyon.net/item/google-maps-draw-module/9813156" target="_blank"><?php echo $lang_msg['MENU_BUY_NOW']; ?></a></li>
					<li<?php echo ($page=='help'?' class="active"':''); ?>><a href="documentation" target="_self"><?php echo $lang_msg['MENU_DOCUMENTATION']; ?></a></li>
				</ul>
			</div>
		</div>
	</nav>
 
 
