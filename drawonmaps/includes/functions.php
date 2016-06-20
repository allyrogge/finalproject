<?php
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * Class: SiteConf
 * File: functions.php
 * Description: General functions of the tool
 */

function save_map($post_list) {
	$vars_tmp = array();
	$map_id = $post_list['map_id'];
	
	if ($map_id>0)	{
		try {
			$map = New Map($map_id);
		} catch (Exception $e) {
			$vars_tmp['error_msg'] = $e->getMessage();
		}
	}
	else {
		$map = New Map();
	}
	
	$map->title = trim($post_list['map_title']);
	$map->description = trim($post_list['map_description']);
	$map->center_lat = $post_list['map_center_lat'];
	$map->center_lng = $post_list['map_center_lng'];
	$map->zoom = intval($post_list['map_zoom']);
	$map->typeid = trim($post_list['map_typeid']);
	$map->user_id = 0;
	
	$result = $map->save();
	
	if ($result) {
		//load the new created map
		$map = New Map($result);
		
		$vars_tmp['map'] = $map;
		$vars_tmp['error_msg'] = '';
		
		if ($map_id>0)	{ // delete map objects only for existing maps
			$map->deleteMapObjects();
		}	
		
		if ($post_list['marker_title']) {
			foreach( $post_list['marker_title'] as $key => $n ) {	// new map marker record created
				$get_object_id = $map->updateMapObject($n, $post_list['marker_coords'][$key], 1, null, $post_list['marker_icon'][$key]);

				if (!$get_object_id[0])
						$vars_tmp['error_msg'] .= $get_object_id[1];
			}
		}

		if ($post_list['line_title']) {
			foreach( $post_list['line_title'] as $key => $n ) {	// new map polyline record created
				$get_object_id = $map->updateMapObject($n, $post_list['line_coords'][$key], 2);

				if (!$get_object_id[0])
					$vars_tmp['error_msg'] .= $get_object_id[1];
			}
		}

		if ($post_list['poly_title']) {
			foreach( $post_list['poly_title'] as $key => $n ) {	// new map polygon record created
					$get_object_id = $map->updateMapObject($n, $post_list['poly_coords'][$key], 3);

				if (!$get_object_id[0])
					$vars_tmp['error_msg'] .= $get_object_id[1];
			}
		}

		if ($post_list['rect_title']) {
			foreach( $post_list['rect_title'] as $key => $n ) {	// new map rectagle record created
				$get_object_id = $map->updateMapObject($n, $post_list['rect_coords'][$key], 4);

				if (!$get_object_id[0])
					$vars_tmp['error_msg'] .= $get_object_id[1];
			}
		}

		if ($post_list['circle_title']) {
			foreach( $post_list['circle_title'] as $key => $n ) {	// new map circle record created
				$get_object_id = $map->updateMapObject($n, $post_list['circle_coords'][$key], 5);

				if (!$get_object_id[0])
					$vars_tmp['error_msg'] .= $get_object_id[1];
			}
		}
	}
	
	$vars_tmp['success_msg'] = 'The map <strong>'.$map->title.'</strong> saved successfully';
	$vars_load = load_map($map->id);
	
    if (is_array($vars_load))
		$vars_tmp = array_merge($vars_tmp, $vars_load);
			
	return $vars_tmp;
} 

function delete_map($map_id) {
	$delete_map = false;
	$vars_tmp = array();
	
	if (is_numeric($map_id) && $map_id>0)	{
		try {
			$map = New Map($map_id);
		} catch (Exception $e) {
			$vars_tmp['error_msg'] = $e->getMessage();
		}
		
		if ($map) {
			try {
				$vars_tmp['delete_map'] = $map->delete();
			} catch (Exception $e) {
				$vars_tmp['error_msg'] = $e->getMessage();
			}
		}
	}
	
	return $vars_tmp;
	
} 

function load_map($map_id) {
	$vars_tmp = array();
	
	try {
		$map = New Map($map_id);
	} catch (Exception $e) {
		$map = false;
		$vars_tmp['error_msg'] = $e->getMessage();
	}				
	
	if ($map)	{
		$vars_tmp['map'] = $map;
		$vars_tmp['map_objects'] = $map->getMapObjects();
		$vars_tmp['default_lan'] = $map->center_lat;
		$vars_tmp['default_lng'] = $map->center_lng;
		$vars_tmp['default_zoom'] = $map->zoom;
		$vars_tmp['default_typeid'] = $map->typeid;
	}
	
	return $vars_tmp;
	
} 

function html_map_options($map_id, $lang_msg, $global = false) {
	$map_options = '';
	
	if (!$global) { // single map view
		$map_options .= '<button type="button" class="btn btn-primary btn-xs" id="edit_map_'.$map_id.'" href="#" onclick="doMap('.$map_id.',\'edit\');">'.$lang_msg['MAPS_EDIT_MAP'].'</button>';
		$map_options .= '<a type="button" class="btn btn-danger btn-xs" id="del_map_'.$map_id.'" href="#" onclick="doMap('.$map_id.',\'delete\');">'.$lang_msg['MAPS_DELETE_MAP'].'</a>';
		$map_options .= '<a type="button" class="btn btn-info btn-xs" id="full_map_'.$map_id.'" href="index.php?p=map_view&map_id='.$map_id.'&map_o=1" target="_blank">'.$lang_msg['MAPS_FULL_VIEW'].'</a>';
	}
	else {	// global map view
		$map_options .= '<a type="button" class="btn btn-info btn-xs" id="full_map_global" href="index.php?p=map_global&map_o=1" target="_blank">'.$lang_msg['MAPS_FULL_VIEW'].'</a>';
	}
	
	return $map_options;
	
}  

function is_object_enabled($object, $available_objects) {
	if (in_array($object,$available_objects))
		return true;
	
	return false;
	
}
