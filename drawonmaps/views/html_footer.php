<?php
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * File: html_footer.php
 * Description: HTML footer
 */
?>


<?php 
	// do not show footer if only map display option is asked
	if (!$vars['map_o']) 
	{ 
?>
	<div id="footer">
		<div class="container">
			<div class="jumbotron">
				<?php echo $lang_msg['HTML_FOOTER_NOTE']; ?>
			</div>
		</div>
	</div>
<?php } ?>

	<!-- JavaScript Code
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->

	<!-- Bootstrap JS -->
	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
	<!--<script type="text/javascript" src="bootstrap/bootstrap-select/bootstrap-select.min.js"></script>-->
	<script type="text/javascript" src="bootstrap/js/validator.min.js"></script>
			
	<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
	<script src="js/ie10-viewport-bug-workaround.js"></script>


	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-35384217-3', 'auto');
	  ga('send', 'pageview');

	</script>	
 
  </body>
</html>
