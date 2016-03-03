/**
 * Created by llin on 2016/1/10.
 */
//飞行操作的pid
var pid;
var pid1;
//飞行操作的角度控制
var angle = 0;
//模式监控
var mode = 0;
//检测次数
var times = 0;

function createBird ( c1 , c2 , c3   ) {

    //颜色
    var featherColor = 0xffff00;
    var bodyColor = 0xffc125;
    var hairColor = 0xff0000;
    var white = 0xffffff;
    var black = 0x000001;

    if ( c1 ) featherColor = c1;
    if ( c2 ) hairColor = c2;
    if ( c3 ) bodyColor = c3;

    //放大缩小的比例
    var scale = 0.3;
    function getValue ( a ){
        return a*scale;
    }
    //尺寸
    var bodySize = 4*scale;//身体的半径
    var headSize = 3*scale;//头的半径
    var mouthSize = 2.6*scale;//嘴的底部的半径
    var mouthLength = 5*scale;//嘴的长度
    var eyeWhiteSize = 1*scale;//眼白的半径
    var eyeBlackSize = 0.5*scale;//瞳孔的半径
    var legSize = 0.4*scale;//腿的半径
    var legLength = 2*scale;//大腿的长度
    var calfLength = 2*scale;//小腿的长度
    var segments = 20;//分段的数目(段数越多，越圆滑)
    var change1 = 0.2*scale;
    var change2 = 1*scale;
    var change3 = -1*scale;



    //位置
    var bodyLoc = {//身体的位置
        x: getValue(5),
        y: getValue(0),
        z: getValue(0)
    };

    var headLoc = {//头的位置
        x: getValue(8),
        y: getValue(3),
        z: getValue(0)
    };

    var mouthLoc = {//嘴的位置
        x: getValue(10),
        y: getValue(3),
        z: getValue(0)
    }

    var tailLoc = {
        x: getValue(1.5),
        y: getValue(0) ,
        z: getValue(1.5)
    }

    var eyeLoc = new Array();
    eyeLoc.push ( {//眼睛(晶状体和瞳孔的位置)
        x1: getValue(10),
        y1: getValue(4),
        z1: getValue(1),
        x2: getValue(Math.sqrt(0.25)+10),
        y2: getValue(4.5),
        z2: getValue(1)
    });
    eyeLoc.push({
        x1: getValue(10),
        y1: getValue(4),
        z1: getValue(-1),
        x2: getValue(Math.sqrt(0.25)+10),
        y2: getValue(4.5),
        z2: getValue(-1)
    });

    var hairLoc = {//头发的位置
        x: getValue(8-Math.sqrt(5)+0.5) ,
        y: getValue(5.5),
        z: getValue(0)
    }

    var swingLoc = new Array();//翅膀的位置
    swingLoc.push( {
        x: getValue(5),
        y: getValue(1),
        z: getValue(4)
    });
    swingLoc.push({
        x: getValue(5),
        y: getValue(0),
        z: getValue(-4)
    })

    var thighLoc = new Array();//大腿的位置
    thighLoc.push({
        x: getValue(3),
        y: getValue(-Math.sqrt(16-Math.pow( 2 ,2 ) - Math.pow( 2.7 , 2 )))-legLength/2+getValue(0.2),
        z: getValue(2.3)
    });
    thighLoc.push({
        x: getValue(3),
        y: getValue(-Math.sqrt(16-Math.pow( 2 ,2 ) - Math.pow( 2.3 , 2 )))-legLength/2+getValue(0.2),
        z: getValue(-2.3)
    });

    var legCenter = new Array();//屁股
    legCenter.push({
        x: getValue(3),
        y: getValue(-Math.sqrt(16-Math.pow( 2 ,2 ) - Math.pow( 2.7 , 2 ))),
        z: getValue(2.3)
    });
    legCenter.push({
        x: getValue(3),
        y: getValue(-Math.sqrt(16-Math.pow( 2 ,2 ) - Math.pow( 2.3 , 2 ))),
        z: getValue(-2.3)
    });

    var calfLoc = new Array();//小腿的位置
    for ( var i = 0 ; i < legCenter.length ; i++ ){
        calfLoc.push ({
            x: legCenter[i].x +  Math.sin(Math.PI*1/6)*calfLength/2,
            y: legCenter[i].y-legLength-calfLength/2 + (1-Math.cos(Math.PI*1/6))*calfLength/2,
            z: legCenter[i].z
        })
    };

    var footLoc = new Array();//脚的位置
    footLoc.push ({
        x: legCenter[0].x + Math.sin(Math.PI*1/6)*calfLength,
        y: legCenter[0].y-legLength-calfLength/2 + (1-Math.cos(Math.PI*1/6))*calfLength+change3,
        z: getValue(1.5)
    });
    footLoc.push ({
        x: legCenter[1].x + Math.sin(Math.PI*1/6)*calfLength,
        y: legCenter[1].y-legLength-calfLength/2 + (1-Math.cos(Math.PI*1/6))*calfLength+change3,
        z: getValue(-3)
    });


    //矫正角度
    function createRot ( x,y,z){
        return {
            xRot: x,
            yRot: y,
            zRot: z
        };
    }

    var mouthRot = createRot ( 0 , 0 , Math.PI*0.5);//嘴巴的矫正角度
    var tailRot = createRot ( Math.PI*0.5 , 0 , Math.PI*1.5 );//尾巴的矫正角度
    var hairRot = createRot ( 0 , Math.PI*0.5 , Math.PI*0.5 );//头发的矫正角度
    var swingFlyRot = new Array();//飞行时翅膀的矫正角度
    swingFlyRot.push( createRot( -Math.PI*0.5 , Math.PI , 0 ));
    swingFlyRot.push( createRot( Math.PI*0.5 , Math.PI, 0 ));
    var swingRunRot = new Array();//奔跑时翅膀的矫正角度
    swingRunRot.push ( createRot ( Math.PI , 0 , Math.PI*1.5 ));
    swingRunRot.push ( createRot ( Math.PI , 0 , Math.PI*1.5 ));
    var thighFlyRot = new Array();//飞行时大腿的矫正角度
    thighFlyRot.push ( createRot ( 0 , 0 , -Math.PI*0.5 ));
    thighFlyRot.push ( createRot ( 0 , 0 , -Math.PI*0.5 ));
    var thighRunRot = new Array();//奔跑时大腿的矫正角度
    thighRunRot.push ( createRot ( 0 , 0 , 0 ));
    thighRunRot.push ( createRot ( 0 , 0 , 0 ));
    var calfRunRot = new Array();//奔跑时小腿的矫正角度
    calfRunRot.push ( createRot ( 0 , 0 , Math.PI*1/6));
    calfRunRot.push ( createRot ( 0 , 0 , Math.PI*1/6));
    var calfFlyRot = new Array();//飞行时小腿的矫正角度
    calfFlyRot.push ( createRot ( 0 , 0 , -Math.PI*0.5));
    calfFlyRot.push ( createRot ( 0 , 0 , -Math.PI*0.5));
    var footFlyRot = new Array();//飞行时脚的矫正角度
    footFlyRot.push ( createRot ( 0 , 0 , -Math.PI*0.5));
    footFlyRot.push ( createRot ( 0 , 0 , -Math.PI*0.5));
    var footRunRot = new Array();//奔跑时脚的矫正角度
    footRunRot.push ( createRot ( 0 , 0 , 0));
    footRunRot.push ( createRot ( 0 , 0 , 0));



    //身体部位
    var bird = new THREE.Object3D();//整只鸟
    var bodySphere = createBody();//设置用于构造身体的球
    var headSphere = createHead();//设置用于构造头的球
    var mouthCylinder = createMouth();//用于构造嘴的圆锥
    var eyes = createEye()//眼睛
    var arms = createArms();//四肢
    var tail = createTail();//尾巴
    var hair = createHair();//头发

    //组装身体
    bird.add(bodySphere);
    bird.add(headSphere);
    bird.add(mouthCylinder);
    bird.add( eyes );
    bird.add(tail);
    bird.add(hair);
    bird.add(arms);


    //构造身体的函数
    function createBody() {
        var body = createMesh(new THREE.SphereGeometry(bodySize, segments, segments), featherColor);
        body.position.set(bodyLoc.x, bodyLoc.y, bodyLoc.z);
        return body;
    }

    //构造头的函数
    function createHead() {
        var head = createMesh(new THREE.SphereGeometry(headSize, segments, segments), featherColor);
        head.position.set(headLoc.x, headLoc.y, headLoc.z);
        return head;
    }

    //构造嘴的函数
    function createMouth() {
        var mouth = createMesh(new THREE.CylinderGeometry(mouthSize, 0, mouthLength, segments, segments), bodyColor);
        mouth.position.set(mouthLoc.x, mouthLoc.y, mouthLoc.z);
        make_rotate(mouth, mouthRot);
        return mouth;
    }

    //构造眼睛的函数
    function createEye(){
        var eyes = new THREE.Object3D();
        for ( var i = 0 ; i < eyeLoc.length ; i++ ){
            var loc = eyeLoc[i];
            var eyeBall = createMesh ( new THREE.SphereGeometry( eyeWhiteSize , segments , segments ), white );
            var blackEye = createMesh ( new THREE.SphereGeometry( eyeBlackSize ,segments ,segments ),black );
            eyeBall.position.set ( loc.x1  , loc.y1 , loc.z1 );
            blackEye.position.set ( loc.x2 , loc.y2 , loc.z2 );
            eyes.add( eyeBall );
            eyes.add( blackEye );
        }
        return eyes;
    }

    //构造尾巴的函数
    function createTail ( ){

        //构造尾巴的二维形状
        var shape = new THREE.Shape();
        var vertex = new Array();
        vertex.push ( [getValue(0.25),getValue(-3), getValue(0.5), getValue(-4)]);
        vertex.push ( [getValue(0.75),getValue(-3), getValue(1), getValue(0) ]);
        shape.moveTo( getValue(0) , getValue(0) );
        for ( var i = 0 ; i < vertex.length ; i++ ){
            shape.quadraticCurveTo( vertex[i][0], vertex[i][1] , vertex[i][2] , vertex[i][3] );
        }
        shape.lineTo( getValue(0) , getValue(0) );

        //二维转三维的参数
        var options = {
            amount: 0.2,
            bevelThickness: 0.01,
            bevelSize: 0.2,
            bevelSegments: 30,
            bevelEnabled: true,
            curveSegments: 30,
            steps: 2
        };

        //生成尾巴的三维立体模型
        vertex = [];
        for ( var i = 0 ; i < 3 ; i++ ){
            vertex.push( [getValue(i),getValue(0),getValue(0)]);
        }
        var tail = new THREE.Object3D();
        for ( var i = 0 ; i < vertex.length ; i++ ){
            var feather = createMesh ( new THREE.ExtrudeGeometry( shape , options ), featherColor );
            feather.position.set ( vertex[i][0] , vertex[i][1] , vertex[i][2] );
            tail.add( feather );
        }
        tail.position.set ( tailLoc.x , tailLoc.y , tailLoc.z );
        make_rotate( tail , tailRot );
        return tail;
    }

    //构造头发的函数
    function createHair ( ){
        var max = getValue(3);
        var count = 20;
        var points = new Array();
        for ( var i = 0 ; i < count ; i++ ){
            points.push( new THREE.Vector3( getValue(Math.sin( Math.PI/(max-0.1)* max/count*i )), 0 , max/count*i  ));
        }
        var latheGeometry = new THREE.LatheGeometry( points , segments , 0 ,2*Math.PI );
        var hair = createMesh( latheGeometry, hairColor );
        hair.position.set ( hairLoc.x , hairLoc.y , hairLoc.z );
        make_rotate( hair , hairRot );
        return hair;
    }

    //翅膀的构造和运动函数
    function createArms ( ){

        //翅膀的部分
        var swing = new THREE.Object3D();
        var front = new Array();
        //组装翅膀
        front.push ( createFront());
        front.push ( createFront());
        for( var i = 0 ; i < front.length ; i++ ){
            var loc = swingLoc[i];
            var rot = swingRunRot[i];
            front[i].position.set ( loc.x , loc.y , loc.z );
            set_rotate( front[i] , rot );
            swing.add( front[i] );
        }
        //构造前翅的函数
        function createFront (){

            //定义二维图形变三维立体图形的参数
            var options = {
                amount: 0.2,
                bevelThickness: 0.2,
                bevelSize: 1,
                bevelSegments: 4,
                bevelEnabled: false,
                curveSegments: 20,
                steps: 1
            };

            //绘制前翅
            var vertex = new Array();
            var front = new THREE.Object3D();
            vertex.push ( [getValue(-4) ,getValue( -4) , getValue(0) , getValue(-8)]);
            vertex.push ( [getValue(-3) , getValue(-4) , getValue(2) , getValue(-6)]);
            vertex.push ( [getValue(-2) , getValue(-3) , getValue(3) , getValue(-4)]);
            for ( var i = 0 ; i < vertex.length ; i++ ){
                var temp = new THREE.Shape();
                var point = vertex[i];
                temp.moveTo( getValue(0),getValue(0) );
                temp.quadraticCurveTo( point[0] , point[1] , point[2] , point[3] );
                temp.lineTo( getValue(0),getValue(0) );
                var feather = createMesh( new THREE.ExtrudeGeometry( temp , options ),featherColor );
                front.add( feather );
            }
            var shape4 = new THREE.Shape();
            shape4.moveTo( getValue(0) ,getValue(0) );
            shape4.lineTo( getValue(3), getValue(-4) );
            shape4.quadraticCurveTo( getValue(3) , getValue(-1) , getValue(0) , getValue(0)  );
            var feather4 = createMesh( new THREE.ExtrudeGeometry( temp , options ) ,featherColor );
            front.add( feather4 );
            return front;
        }

        //腿的部分
        var legs = new THREE.Object3D();
        var thigh = new Array();
        var calf = new Array();
        //组装腿
        thigh.push ( createThigh());
        thigh.push( createThigh());
        for ( var i = 0 ; i < thigh.length ; i++ ){
            var loc = thighLoc[i];
            var temp = thigh[i];
            temp.position.set ( loc.x , loc.y , loc.z );
            legs.add( temp );
        }
        calf.push ( createCalf());
        calf.push ( createCalf());
        for ( var i = 0 ; i < calf.length ; i++ ){
            var loc = calfLoc[i];
            var temp = calf[i];
            var rot = calfRunRot[i];
            temp.position.set ( loc.x , loc.y , loc.z );
            make_rotate( temp , rot );
            legs.add( temp );
        }

        //构造大腿的函数
        function createThigh ( ){
            return createMesh ( new THREE.CylinderGeometry( legSize , legSize , legLength , segments , segments ) , bodyColor );
        }

        //构造小腿的函数
        function createCalf ( ){
            return createMesh ( new THREE.CylinderGeometry( legSize , legSize , calfLength , segments , segments ) , bodyColor );
        }

        //脚的部分
        var foot = new THREE.Object3D();

        //组装脚
        var sole = new Array();
        sole.push ( createFoot());
        sole.push ( createFoot());
        console.log( sole.length  );
        for ( var i = 0 ; i < sole.length ; i++ ){
            var loc = footLoc[i];
            var temp = sole[i];
            temp.position.set ( loc.x , loc.y , loc.z  );
            foot.add( temp );
        }

        function createFoot ( ){
            //二维转三维图形的参数
            var options = {
                amount: 0.1,
                bevelThickness: 0.2,
                bevelSize: 1,
                bevelSegments: 4,
                bevelEnabled: false,
                curveSegments: 20,
                steps: 1
            };
            //绘制脚趾
            var toe_line = new THREE.Shape();
            toe_line.moveTo(getValue(0),getValue(0));
            toe_line.lineTo(getValue(0.25),getValue(-2));
            toe_line.lineTo(getValue(0.5), getValue(0));
            toe_line.lineTo(getValue(0), getValue(0));
            var group = new THREE.Object3D();
            var toe1 = createMesh(new THREE.ExtrudeGeometry( toe_line , options),bodyColor);
            var toe2 = createMesh(new THREE.ExtrudeGeometry( toe_line , options),bodyColor);
            var toe3 = createMesh(new THREE.ExtrudeGeometry( toe_line , options),bodyColor);
            toe1.position.set(getValue(0),getValue(0), getValue(0));
            toe2.position.set(getValue(0.5),getValue(0), getValue(0));
            toe3.position.set(getValue(1), getValue(0), getValue(0));
            group.add(toe1);
            group.add(toe2);
            group.add(toe3);
            //绘制脚掌
            var sole_line = new THREE.Shape();
            sole_line.moveTo(getValue(0), getValue(0));
            sole_line.quadraticCurveTo( getValue(0.75), getValue(1) ,getValue(1.5), getValue(0));
            sole_line.lineTo(getValue(0), getValue(0));
            var sole = createMesh ( new THREE.ExtrudeGeometry( sole_line , options ),bodyColor);
            group.add(sole);
            group.rotation.z += Math.PI*0.5;
            group.rotation.x += Math.PI*0.5;
            var out = new THREE.Object3D();
            out.add(group);
            return out;
        }


        //对于小鸟的操作
        document.onkeydown = function ( e ){
            var keyCode = e.keyCode;
            if( keyCode == 70 ) {
                if ( mode == 1 ){
                    console.log ( "I'm flying !!!");
                    return;
                }
                mode = 1;
                console.log("ready fly!!!");
                for ( var i = 0 ; i < front.length; i++ ){
                    var flyRot = swingFlyRot[i];
                    var rot = createRot( flyRot.xRot-front[i].rotation.x,
                        flyRot.yRot-front[i].rotation.y,
                        flyRot.zRot-front[i].rotation.z);
                    make_rotate ( front[i] , rot );
                    flyRot = thighFlyRot[i];
                    var rot2 = createRot( flyRot.xRot-thigh[i].rotation.x,
                        flyRot.yRot-thigh[i].rotation.y,
                        flyRot.zRot-thigh[i].rotation.z);
                    make_rotate ( thigh[i] , rot2 );
                    thigh[i].position. y += legLength/2;
                    thigh[i].position.x -= legLength/2;
                    flyRot = calfFlyRot[i];
                    var rot3= createRot( flyRot.xRot-calf[i].rotation.x,
                        flyRot.yRot-calf[i].rotation.y,
                        flyRot.zRot-calf[i].rotation.z);
                    make_rotate ( calf[i] , rot3 );
                    calf[i].position.y += legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength/2+change1;
                    calf[i].position.x  += -Math.sin(Math.PI*1/6)*calfLength/2-calfLength/2-legLength;
                    flyRot = footFlyRot[i];
                    var rot4= createRot( flyRot.xRot-sole[i].rotation.x,
                        flyRot.yRot-sole[i].rotation.y,
                        flyRot.zRot-sole[i].rotation.z);
                    make_rotate ( sole[i] , rot4 );
                    sole[i].position.y += legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength+change1-change3;
                    sole[i].position.x  += -Math.sin(Math.PI*1/6)*calfLength-calfLength-legLength;
                }
                angle = 0;
                pid = setInterval ( function (){
                    angle += 0.3;
                    var rot = new Array ();
                    rot.push ( createRot (  -0.03*Math.PI*Math.sin( angle ) , 0 , 0 ));
                    rot.push ( createRot (  0.03*Math.PI*Math.sin( angle ) , 0 , 0 ));
                    for ( var i = 0 ; i < front.length ; i++ ){
                        make_rotate ( front[i] , rot[i] );
                    }
                } ,100);
            }
            else if ( keyCode == 84 ){
                if ( mode != 1 ){
                    console.log( "no fly! how take off!!!")
                    return;
                }
                if ( bird.position.y > -12 ){
                    console.log( "too high, can't take off ");
                    return;
                }
                mode = 0;
                bird.position.y = -13;
                reset();
                console.log( "ready take off!!!");
                for ( var i = 0 ; i < front.length; i++ ){
                    var runRot = swingRunRot[i];
                    var rot = createRot( runRot.xRot-front[i].rotation.x,
                        runRot.yRot-front[i].rotation.y,
                        runRot.zRot-front[i].rotation.z);
                    make_rotate ( front[i] , rot );
                    runRot = thighRunRot[i];
                    var rot2 = createRot( runRot.xRot-thigh[i].rotation.x,
                        runRot.yRot-thigh[i].rotation.y,
                        runRot.zRot-thigh[i].rotation.z);
                    make_rotate ( thigh[i] , rot2 );
                    thigh[i].position. y -= legLength/2;
                    thigh[i].position.x += legLength/2;
                    runRot = calfRunRot[i];
                    var rot2 = createRot( runRot.xRot-calf[i].rotation.x,
                        runRot.yRot-calf[i].rotation.y,
                        runRot.zRot-calf[i].rotation.z);
                    make_rotate ( calf[i] , rot2 );
                    calf[i].position.y -= legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength/2+change1;
                    calf[i].position.x -= -Math.sin(Math.PI*1/6)*calfLength/2-calfLength/2-legLength;
                    runRot = footRunRot[i];
                    var rot4 = createRot( runRot.xRot-sole[i].rotation.x,
                        runRot.yRot-sole[i].rotation.y,
                        runRot.zRot-sole[i].rotation.z);
                    make_rotate ( sole[i] , rot4 );
                    sole[i].position.y -= legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength+change1-change3;
                    sole[i].position.x -= -Math.sin(Math.PI*1/6)*calfLength-calfLength-legLength;
                }
                clearInterval ( pid );

            }
            else if ( keyCode == 82 ){
                if ( mode == 1 ){
                    console.log( "flying!!How to run!!!!");
                    return;
                }
                mode = 2;
                times = 0;
                pid1 = setInterval ( function (){
                    if ( times == 0  ){
                        raiseThigh ( thigh[0]);
                        raiseCalf( calf[0]);
                        raiseSole ( sole[0]);
                    }
                    else if ( times%2 == 1 ){
                        leftThigh( thigh[0] );
                        leftCalf( calf[0]);
                        leftSole ( sole[0]);
                        raiseThigh( thigh[1] );
                        raiseCalf ( calf[1]);
                        raiseSole ( sole[1]);
                        //console.log ( "odd");
                    }
                    else{
                        leftThigh( thigh[1] );
                        leftCalf ( calf[1] );
                        leftSole ( sole[1] );
                        raiseThigh( thigh[0] );
                        raiseCalf ( calf[0] );
                        raiseSole ( sole[0] );
                        //console.log ( "even" );
                    }
                    //console.log (  thigh[0].position.y + "  " +  thigh[0].position.x );
                    times++;
                },300);
            }
            else if ( keyCode == 71 ){
                if ( mode != 2){
                    console.log ( "no run!!! How to stop!!!");
                    return;
                }
                mode = 0;
                clearInterval ( pid1 );
                for ( var i = 0 ; i < thigh.length ; i++ ){
                    var loc1 = thighLoc[i];
                    var rot1 = thighRunRot[i];
                    thigh[i].position.set( loc1.x , loc1.y , loc1.z );
                    set_rotate( thigh[i] , rot1 );
                    var loc2 = calfLoc[i];
                    var rot2 = calfRunRot[i];
                    calf[i].position.set ( loc2.x , loc2.y , loc2.z );
                    set_rotate ( calf[i] , rot2 );
                    var loc3 = footLoc[i];
                    var rot3 = footRunRot[i];
                    sole[i].position.set ( loc3.x , loc3.y , loc3.z );
                    set_rotate ( sole[i] , rot3 );
                }
            }
            else {
                //do nothing
            }
            do_operate( keyCode );
        }

        //对于小鸟的操作
        document.onkeydown = function ( e ){
            var keyCode = e.keyCode;
            if ( keyCode == 70 ){
                if ( mode == 1 ){
                    console.log ( "I'm flying !!!");
                    return;
                }
                mode = 1;
                clearInterval ( pid1 );
                for ( var i = 0 ; i < thigh.length ; i++ ){
                    var loc1 = thighLoc[i];
                    var rot1 = thighRunRot[i];
                    thigh[i].position.set( loc1.x , loc1.y , loc1.z );
                    set_rotate( thigh[i] , rot1 );
                    var loc2 = calfLoc[i];
                    var rot2 = calfRunRot[i];
                    calf[i].position.set ( loc2.x , loc2.y , loc2.z );
                    set_rotate ( calf[i] , rot2 );
                    var loc3 = footLoc[i];
                    var rot3 = footRunRot[i];
                    sole[i].position.set ( loc3.x , loc3.y , loc3.z );
                    set_rotate ( sole[i] , rot3 );
                }
                console.log("ready fly!!!");
                for ( var i = 0 ; i < front.length; i++ ){
                    var flyRot = swingFlyRot[i];
                    var rot = createRot( flyRot.xRot-front[i].rotation.x,
                        flyRot.yRot-front[i].rotation.y,
                        flyRot.zRot-front[i].rotation.z);
                    make_rotate ( front[i] , rot );
                    flyRot = thighFlyRot[i];
                    var rot2 = createRot( flyRot.xRot-thigh[i].rotation.x,
                        flyRot.yRot-thigh[i].rotation.y,
                        flyRot.zRot-thigh[i].rotation.z);
                    make_rotate ( thigh[i] , rot2 );
                    thigh[i].position. y += legLength/2;
                    thigh[i].position.x -= legLength/2;
                    flyRot = calfFlyRot[i];
                    var rot3= createRot( flyRot.xRot-calf[i].rotation.x,
                        flyRot.yRot-calf[i].rotation.y,
                        flyRot.zRot-calf[i].rotation.z);
                    make_rotate ( calf[i] , rot3 );
                    calf[i].position.y += legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength/2+change1;
                    calf[i].position.x  += -Math.sin(Math.PI*1/6)*calfLength/2-calfLength/2-legLength;
                    flyRot = footFlyRot[i];
                    var rot4= createRot( flyRot.xRot-sole[i].rotation.x,
                        flyRot.yRot-sole[i].rotation.y,
                        flyRot.zRot-sole[i].rotation.z);
                    make_rotate ( sole[i] , rot4 );
                    sole[i].position.y += legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength+change1-change3;
                    sole[i].position.x  += -Math.sin(Math.PI*1/6)*calfLength-calfLength-legLength;
                }
                angle = 0;
                pid = setInterval ( function (){
                    angle += 0.3;
                    var rot = new Array ();
                    rot.push ( createRot (  -0.03*Math.PI*Math.sin( angle ) , 0 , 0 ));
                    rot.push ( createRot (  0.03*Math.PI*Math.sin( angle ) , 0 , 0 ));
                    for ( var i = 0 ; i < front.length ; i++ ){
                        make_rotate ( front[i] , rot[i] );
                    }
                } ,100);
            }
            else if ( keyCode == 84 ){
                if ( mode != 1 ){
                    console.log( "no fly! how take off!!!")
                    return;
                }
                if ( bird.position.y > 2 ){
                    console.log( "too high, can't take off ");
                    return;
                }
                mode = 0;
                bird.position.y = 0;
                reset();
                console.log( "ready take off!!!");
                for ( var i = 0 ; i < front.length; i++ ){
                    var runRot = swingRunRot[i];
                    var rot = createRot( runRot.xRot-front[i].rotation.x,
                        runRot.yRot-front[i].rotation.y,
                        runRot.zRot-front[i].rotation.z);
                    make_rotate ( front[i] , rot );
                    runRot = thighRunRot[i];
                    var rot2 = createRot( runRot.xRot-thigh[i].rotation.x,
                        runRot.yRot-thigh[i].rotation.y,
                        runRot.zRot-thigh[i].rotation.z);
                    make_rotate ( thigh[i] , rot2 );
                    thigh[i].position. y -= legLength/2;
                    thigh[i].position.x += legLength/2;
                    runRot = calfRunRot[i];
                    var rot2 = createRot( runRot.xRot-calf[i].rotation.x,
                        runRot.yRot-calf[i].rotation.y,
                        runRot.zRot-calf[i].rotation.z);
                    make_rotate ( calf[i] , rot2 );
                    calf[i].position.y -= legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength/2+change1;
                    calf[i].position.x -= -Math.sin(Math.PI*1/6)*calfLength/2-calfLength/2-legLength;
                    runRot = footRunRot[i];
                    var rot4 = createRot( runRot.xRot-sole[i].rotation.x,
                        runRot.yRot-sole[i].rotation.y,
                        runRot.zRot-sole[i].rotation.z);
                    make_rotate ( sole[i] , rot4 );
                    sole[i].position.y -= legLength+calfLength/2 - (1-Math.cos(Math.PI*1/6))*calfLength+change1-change3;
                    sole[i].position.x -= -Math.sin(Math.PI*1/6)*calfLength-calfLength-legLength;
                }
                clearInterval ( pid );
                if ( mode == 1 ){
                    console.log( "flying!!How to run!!!!");
                    return;
                }
                times = 0;
                pid1 = setInterval ( function (){
                    if ( times == 0  ){
                        raiseThigh ( thigh[0]);
                        raiseCalf( calf[0]);
                        raiseSole ( sole[0]);
                    }
                    else if ( times%2 == 1 ){
                        leftThigh( thigh[0] );
                        leftCalf( calf[0]);
                        leftSole ( sole[0]);
                        raiseThigh( thigh[1] );
                        raiseCalf ( calf[1]);
                        raiseSole ( sole[1]);
                        //console.log ( "odd");
                    }
                    else{
                        leftThigh( thigh[1] );
                        leftCalf ( calf[1] );
                        leftSole ( sole[1] );
                        raiseThigh( thigh[0] );
                        raiseCalf ( calf[0] );
                        raiseSole ( sole[0] );
                        //console.log ( "even" );
                    }
                    //console.log (  thigh[0].position.y + "  " +  thigh[0].position.x );
                    times++;
                },300);
            }
            else{
                //do nothing
            }
            do_operate( keyCode );
            do_camera_operate( keyCode );
        }


        //奔跑时腿抬起的高度
        var raiseAngle = Math.PI* 1/6;

        //奔跑时抬起大腿的操作
        function raiseThigh ( a ){
            make_rotate ( a ,  createRot( 0 , 0 , -raiseAngle ) );
            a.position.x -= legLength/2*Math.sin(raiseAngle);
            a.position.y += legLength/2*Math.cos(raiseAngle);
        }

        //奔跑时抬起小腿的操作
        function raiseCalf ( a ){
            make_rotate ( a ,  createRot( 0 , 0 , -raiseAngle ) );
            a.position.x -= (legLength+calfLength/2*Math.cos(1/6*Math.PI))*Math.sin(raiseAngle);
            a.position.y += (legLength+calfLength/2*Math.cos(1/6*Math.PI))*Math.cos(raiseAngle)-change2;
        }

        //奔跑时抬起脚掌
        function raiseSole ( a ){
            //make_rotate ( a ,  createRot( 0 , 0 , -raiseAngle ) );
            a.position.x -= (legLength*Math.cos(1/6*Math.PI))*Math.sin(raiseAngle)+change2;
            a.position.y += (legLength*Math.cos(1/6*Math.PI))*Math.cos(raiseAngle);
        }

        //奔跑时落下大腿的操作
        function leftThigh ( a ){
            make_rotate ( a , createRot( 0 , 0 , raiseAngle ) );
            a.position.x += legLength/2*Math.sin(raiseAngle);
            a.position.y -= legLength/2*Math.cos(raiseAngle);
        }

        //奔跑时落下小腿的操作
        function leftCalf ( a ){
            make_rotate ( a , createRot( 0 , 0 , raiseAngle ) );
            a.position.x += (legLength+calfLength/2*Math.cos(1/6*Math.PI))*Math.sin(raiseAngle);
            a.position.y -= (legLength+calfLength/2*Math.cos(1/6*Math.PI))*Math.cos(raiseAngle)-change2;
        }

        //奔跑时落下脚掌
        function leftSole ( a ){
            //make_rotate ( a ,  createRot( 0 , 0 , raiseAngle ) );
            a.position.x += (legLength*Math.cos(1/6*Math.PI))*Math.sin(raiseAngle)+change2;
            a.position.y -= (legLength*Math.cos(1/6*Math.PI))*Math.cos(raiseAngle);
        }

        //组装四肢
        var arms = new THREE.Object3D();
        arms.add(swing);
        arms.add(legs);
        arms.add(foot);
        return arms;
    }

    //创建三维立体图形的函数
    function createMesh( geom,color ){
        if ( !color )
            color = 0xffff00;
        var mesh =  new THREE.Mesh( geom , new THREE.MeshLambertMaterial({ color: color }));
        mesh.receiveShadow = true;//所有的立体图形都接受投影
        mesh.castShadow = true;//所有的立体图形都产生投影
        return mesh;
    }

    //对三维立体图形进行旋转的函数
    function make_rotate ( a , rot ){
        a.rotation.x += rot.xRot;
        a.rotation.y += rot.yRot;
        a.rotation.z += rot.zRot;
    }

    //三维立体图形的旋转度的函数
    function set_rotate ( a , rot ){
        a.rotation.x = rot.xRot;
        a.rotation.y = rot.yRot;
        a.rotation.z = rot.zRot;
    }

    return bird;

}

