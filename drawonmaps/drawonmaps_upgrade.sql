USE `drawonmaps`;

ALTER TABLE `map_objects` ADD `marker_icon` VARCHAR( 255 ) NOT NULL AFTER `coords` ;

ALTER TABLE `maps` ADD `zoom` INT DEFAULT NULL AFTER `description` ,
ADD `typeid` VARCHAR( 50 ) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL AFTER `zoom` ;

ALTER TABLE `maps` ADD `center_lat` DOUBLE NULL DEFAULT NULL AFTER `description` ,
ADD `center_lng` DOUBLE NULL DEFAULT NULL AFTER `center_lat` ;

