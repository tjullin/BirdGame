/**
 * Created by llin on 2016/1/11.
 */


//方向向量的定义

var dx = 0.1;
var dy = 0;
var dz = 0;
var continue_flag = false;

//速度的定义
var v = 0.1;
//旋转速度的定义
var turn_left = 0.05;

//旋转的角度
var angle1= 0;
//俯仰角度
var angle2=0;

function goStraight ( a , keyCode ){
    if ( keyCode == 85 ){
        a.position.x += dx;
        a.position.y += dy;
        a.position.z += dz;
        if ( continue_flag ) return;
        camera.position.x += dx;
        camera.position.y += dy;
        camera.position.z += dz;
    }
}

function turnLeft ( a , keyCode ){
    if ( keyCode == 65 ){
        a.rotation.y += turn_left;
        angle1 += turn_left;
        dx = v*Math.cos(angle2)*Math.cos(angle1);
        dz = -v*Math.cos(angle2)*Math.sin(angle1);
        dy = v*Math.sin(angle2);
    }
}

function turnRight ( a , keyCode ){
    if ( keyCode == 68 ){
        a.rotation.y -= turn_left;
        angle1 -= turn_left;
        dx = v*Math.cos(angle2)*Math.cos(angle1);
        dz = -v*Math.cos(angle2)*Math.sin(angle1);
        dy = v*Math.sin(angle2);
    }
}

function raiseHead ( a , keyCode ){
    if ( keyCode == 87 ){
        if( mode != 1 ){
            console.log ( "Flying first!!!");
            return;
        }
        a.rotation.z += turn_left;
        angle2 += turn_left;
        dx = v*Math.cos(angle2)*Math.cos(angle1);
        dz = -v*Math.cos(angle2)*Math.sin(angle1);
        dy = v*Math.sin(angle2);
    }
}

function downHead ( a , keyCode ){
    if ( keyCode == 83 ){
        if( mode != 1 ){
            console.log ( "Flying first!!!");
            return;
        }
        a.rotation.z -= turn_left;
        angle2 -= turn_left;
        dx = v*Math.cos(angle2)*Math.cos(angle1);
        dz = -v*Math.cos(angle2)*Math.sin(angle1);
        dy = v*Math.sin(angle2);
    }
}

function reset ( ){
    var a = bird;
    a.rotation.z = 0;
    angle2 = 0;
    dx = v*Math.cos(angle2)*Math.cos(angle1);
    dz = -v*Math.cos(angle2)*Math.sin(angle1);
    dy = v*Math.sin(angle2);
}

function do_operate ( keyCode ){
    goStraight( bird , keyCode );
    turnLeft ( bird , keyCode );
    turnRight ( bird , keyCode );
    raiseHead ( bird , keyCode );
    downHead ( bird , keyCode );
}