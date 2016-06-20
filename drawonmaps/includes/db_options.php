<?php
/**
 * Google Maps Draw Module
 * @package drawonmaps
 * 
 * Class: SiteConf
 * File: db_options.php
 * Description: Database connection parameters
 */

function dcb_callback($script, $line, $message) {
    echo "<h1>Condition failed!</h1><br />
        Script: <strong>$script</strong><br />
        Line: <strong>$line</strong><br />
        Condition: <br /><pre>$message</pre>";
}

class Options {
    public static $DBHOST = 'HOST';
    public static $DBUSER = 'USERNAME';
    public static $DBPASSWORD = 'PASSWORD';
    public static $DBNAME = 'DBNAME';
    public static $SESSION_MAX_LIFETIME = 57600;
}
