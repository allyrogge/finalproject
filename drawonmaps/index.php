<?php 
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * File: index.php
 * Description: Controller and index file of the site
 */
 
	require_once dirname(__FILE__)."/includes/config.php"; 
	require_once dirname(__FILE__)."/includes/db_connect.php";
	require_once dirname(__FILE__)."/includes/functions.php";
	
	require_once dirname(__FILE__)."/model/sitemaps.php"; 
	require_once dirname(__FILE__)."/model/map.php"; 
	
	$lng = (isset($_GET['lng'])?$_GET['lng']:SiteConf::$DEFAULT_LANG);
	$page = (isset($_GET['p'])?$_GET['p']:SiteConf::$DEFAULT_LANG);
	
	// set default lang if current is not valid
	$lng = SiteConf::getSiteLanguage($lng);
	include_once dirname(__FILE__).'/languages/'.$lng.'.php';	
			
	// set default page if current is not valid
	$page = SiteConf::getSitePage($page);

	// initialize basic map variables
	$vars = array();
	
	$vars['default_lan'] = SiteConf::$DEFAULT_CENTER_LAN;
	$vars['default_lng'] = SiteConf::$DEFAULT_CENTER_LNG;
	$vars['default_zoom'] = SiteConf::$DEFAULT_ZOOM;
	$vars['default_typeid'] = SiteConf::$DEFAULT_TYPEID;

	$vars['error_msg'] = '';
    switch ($page) {
        case "maps":
			if (isset($_POST['map_id']))	{ 
				$vars_tmp = delete_map(intval($_POST['map_id']));
			}
			
			$vars['html_title'] = $lang_msg['MAPS_TITLE'];
			$vars['page_title'] = $lang_msg['MAPS_PAGE_TITLE'];
			$vars['sitemaps'] = SiteMaps::getMaps();
            break;
            
        case "map_view":
			if (isset($_GET['map_id']))	{ 
				$map_id = intval($_GET['map_id']); 
			}			
			
			if ($map_id>0)	
				$vars_tmp = load_map(intval($map_id));
			else  
				$vars['error_msg'] .= 'Not valid map id';
			
			$vars['html_title'] = $lang_msg['MAP_VIEW_TITLE'];
			$vars['page_title'] = $lang_msg['MAP_VIEW_PAGE_TITLE'];
            break;
            
        case "map_global":
			$vars['map_objects'] = SiteMaps::getMapsObjects();
			
			$vars['html_title'] = $lang_msg['MAP_GLOBAL_TITLE'];
			$vars['page_title'] = $lang_msg['MAP_GLOBAL_PAGE_TITLE'];
			
			// redirect the page to map view
			$page = 'map_view';
            break;

        case "map_create":
			$vars['html_title'] = $lang_msg['MAP_CREATE_TITLE'];
			$vars['page_title'] = $lang_msg['MAP_CREATE_PAGE_TITLE'];
            break;
            
        case "map_edit":
			if (isset($_POST['map_id']))	{ 
				$map_id = intval($_POST['map_id']); 
			}	
			
			if ($map_id>0)	
				$vars_tmp = load_map(intval($map_id));
			else  
				$vars['error_msg'] .= 'Not valid map id';
			
			$vars['html_title'] = $lang_msg['MAP_EDIT_TITLE'];
			$vars['page_title'] = $lang_msg['MAP_EDIT_PAGE_TITLE'];
            break;
            
        case "map_save":
			$post_list = array();
			$post_list['map_id'] = isset($_POST['map_id']) ? $_POST['map_id'] : 0;
			$post_list['map_title'] = isset($_POST['map_title']) ? $_POST['map_title'] : '';
			$post_list['map_description'] = isset($_POST['map_description']) ? $_POST['map_description'] : '';
			$post_list['map_center_lat'] = isset($_POST['map_center_lat']) ? $_POST['map_center_lat'] : 0;
			$post_list['map_center_lng'] = isset($_POST['map_center_lng']) ? $_POST['map_center_lng'] : 0;
			$post_list['map_zoom'] = isset($_POST['map_zoom']) ? $_POST['map_zoom'] : '';
			$post_list['map_typeid'] = isset($_POST['map_typeid']) ? $_POST['map_typeid'] : '';
			$post_list['marker_title'] = isset($_POST['marker_title']) ? $_POST['marker_title'] : '';
			$post_list['marker_coords'] = isset($_POST['marker_coords']) ? $_POST['marker_coords'] : '';
			$post_list['marker_icon'] = isset($_POST['marker_icon']) ? $_POST['marker_icon'] : '';
			$post_list['line_title'] = isset($_POST['line_title']) ? $_POST['line_title'] : '';
			$post_list['line_coords'] = isset($_POST['line_coords']) ? $_POST['line_coords'] : '';
			$post_list['poly_title'] = isset($_POST['poly_title']) ? $_POST['poly_title'] : '';
			$post_list['poly_coords'] = isset($_POST['poly_coords']) ? $_POST['poly_coords'] : '';
			$post_list['rect_title'] = isset($_POST['rect_title']) ? $_POST['rect_title'] : '';
			$post_list['rect_coords'] = isset($_POST['rect_coords']) ? $_POST['rect_coords'] : '';
			$post_list['circle_title'] = isset($_POST['circle_title']) ? $_POST['circle_title'] : '';
			$post_list['circle_coords'] = isset($_POST['circle_coords']) ? $_POST['circle_coords'] : '';

			if (trim($post_list['map_title']) == '') {
				$vars['error_msg'] = $lang_msg['ERROR_EMPTY_TITLE'];
			}	
			
			if (empty($vars['error_msg'])) {
				$vars_tmp = save_map($post_list);
				
				// redirect the page to map view
				$page = 'map_view';
			}
			
			$vars['html_title'] = $lang_msg['MAP_VIEW_TITLE'];
			$vars['page_title'] = $lang_msg['MAP_VIEW_PAGE_TITLE'];			
            break;
            
        default:
			$vars['html_title'] = '';
			$vars['page_title'] = $lang_msg['PAGE_TITLE'];
			break;
    }
    
    // check option to show only map
    $vars['map_o'] = false;
    if ($page == 'map_view' && isset($_GET['map_o']) && $_GET['map_o']==1) {
		$vars['map_o'] = true;
	}			    
    
    if (isset($vars_tmp) && is_array($vars_tmp))
		$vars = array_merge($vars, $vars_tmp);
    	
	// include language file
	include_once dirname(__FILE__).'/languages/'.$lng.'.php';
	
	// include html header
	require_once dirname(__FILE__) . "/views/html_head.php";

	// include top menu, do not show top menu if only map display option is asked
	if (!$vars['map_o']) { 
		require_once dirname(__FILE__) . "/views/html_menu_top.php";
	}

	if (!empty($vars['error_msg'])) {
		$vars['page_title'] = $lang_msg['ERROR_PAGE_TITLE'];		
		include_once dirname(__FILE__).'/views/error_page.php';	
	}
	else { 	// include required view as main page
		include_once dirname(__FILE__).'/views/'.$page.'.php';		
	}
		
	// include html footer
	include_once dirname(__FILE__).'/views/html_footer.php';	
	
?>
