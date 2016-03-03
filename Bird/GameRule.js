/**
 * Created by llin on 2016/1/11.
 */

var birdX = 0;
var birdY = 0;
var birdZ = 0;
var birdR = 2.5;

var others = new Array();
var apples = new Array();
var drugs = new Array();

//监听鸟的变化的监听器
var listener_pid = setInterval ( function(){
    birdX = bird.position.x;
    birdY = bird.position.y;
    birdZ = bird.position.z;
    //console.log ( birdX + " " + birdY +" "+ birdZ );

    //超出地图则游戏结束
    if ( Math.abs(birdX) > 65 || Math.abs(birdZ) > 65 || birdY < 0 || birdY > 50 || check_drug() || check_collide() ){
        scene.remove(bird);
        continue_flag = true;
        print_info();
        clearInterval(listener_pid);
    }
    //检查是否碰撞到水果
    check_fruit();
},50);

function square (  a ){
    return a*a;
}

function check ( ){
    for ( var i = 0 ; i < others.length ; i++ ){
        var temp = others[i];
        if ( temp.shape == "building" && check_building( temp ) )
            return false;
    }
    return true;
}

function check_building ( a ){
    if ( Math.abs(a.x-birdX ) > birdR + a.w/2 )
        return false;
    //console.log( Math.abs(a.x-birdX) + " " + (birdR+ a.w/2)  );
    if ( Math.abs(a.y-birdY ) > birdR + a.h/2 )
        return false;
    if ( Math.abs(a.z-birdZ ) > birdR + a.d/2 )
        return false;
    console.log ( a  );
    console.log ( bird.position  );
    return true;
}

//判断是否吃到水果
function check_fruit ( ){
    for ( var i = 0 ; i < apples.length ; i++ ){
        var tx = apples[i].position.x;
        var ty = apples[i].position.y;
        var tz = apples[i].position.z;
        var dis = Math.sqrt ( Math.pow ( tx-birdX ,2 ) + Math.pow ( ty-birdY , 2 ) + Math.pow ( tz-birdZ , 2 ) );
        if ( dis < birdR+1 ) {
            scene.remove(apples[i]);
            apples.splice(i, 1);
            console.log("RETURN:  " + apples.length);
            var nx = get_random ( -55 , 55 );
            var nz = get_random ( -55 , 55 );
            var ny = get_random ( 0 , 55 );
            var drug = createApple( 3 , 0x9b30ff );
            drug.position.set ( nx , ny , nz );
            drugs.push ( drug );
            scene.add( drug );
            console.log ( "new drug !!");
            return;
        }
    }
}

//判断是否吃到毒苹果
function check_drug ( ){
    for ( var i = 0 ;  i < drugs.length ; i++ ){
        var tx = drugs[i].position.x;
        var ty = drugs[i].position.y;
        var tz = drugs[i].position.z;
        var dis = Math.sqrt ( Math.pow ( tx-birdX ,2 ) + Math.pow ( ty-birdY , 2 ) + Math.pow ( tz-birdZ , 2 ) );
        if ( dis < birdR+3 ){
            scene.remove ( drugs[i] );
            drugs.splice( i , 1 );
            return true;
        }
    }
    return false;
}

//添加碰撞信息
function add_info ( xx , yy , zz , ww , hh , dd ){
    others.push ({
        x: xx,
        y: yy,
        z: zz,
        w: ww,
        h: hh,
        d: dd
    })
}

//检查是否发生碰撞
function check_collide ( ){
    for ( var i = 0 ; i < others.length ; i++ ){
        if ( check_building( others[i])) return true;
    }
    return false;
}
