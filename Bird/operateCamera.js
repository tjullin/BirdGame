/**
 * Created by llin on 2016/1/15.
 */

var dd = 0.1;
var locY = 10;
var camera_radius = 30;

var camera_angle = 0;

function frontView(  keyCode ){
    if ( keyCode != 74 ) return;
    camera.rotation.y += 0.05;
    camera_angle += 0.05;
    var tz = birdZ-camera_radius*Math.cos(camera_angle);
    var tx = birdX+camera_radius*Math.sin(camera_angle);
    var ty = birdY+locY;
    camera.position.set ( tx , ty , tz );
}

function test1 ( keyCode ){
    if ( keyCode != 75 ) return;
    camera.rotation.y -= 0.05;
    camera_angle -= 0.05;
    var tz = birdZ-camera_radius*Math.cos(camera_angle);
    var tx = birdX+camera_radius*Math.sin(camera_angle);
    var ty = birdY+locY;
    camera.position.set ( tx , ty , tz );
}

//操作的集合
function do_camera_operate ( keyCode ){
    frontView ( keyCode );
    test1( keyCode );
}