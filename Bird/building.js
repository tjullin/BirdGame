/**
 * Created by llin on 2016/1/11.
 */


//创建一个基本的建筑物
//x,y,z 坐标
//w,h,d 长宽高
//c 建筑物的颜色
function createBuilding ( x , y , z , w , h , d  , c ){

    var width= w;
    var height = h;
    var depth = d;
    var segments = 30;
    var building_color = c;
    var cubeGeometry = new THREE.BoxGeometry( width, height , depth);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color : 0x0000ff});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set ( x , y , z );
    others.push ( {
        shape: "building",
        x: cube.position.x,
        y: cube.position.y,
        z: cube.position.z,
        w: width,
        h: height,
        d: depth
    });
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
}

//创建一个塔建筑(尚未加入碰撞集合)
//x,y,z定义为塔中心的坐标
//r定义塔的半径
//h定义塔的高度
//c1,c2分别代表塔体和塔的装饰物的颜色
function createTower ( x , y , z , r , h  , c1 , c2 ){

    //塔的整体
    var entireTower = new THREE.Object3D();
    var thickness = 0.2;
    var radius = r;
    var height = h;
    var bodyColor;
    if (!c1) bodyColor =0xf0f8ff;
    else bodyColor =c1;
    var decColor;
    if ( !c2 ) decColor = 0x545454;
    else  decColor = c2;
    var top = height*0.2;
    var bottom = height*0.8;
    var up = height*0.3;
    var spireHeight = height*0.7;

    //创建塔体
    var points = new Array();
    var k1 = radius*0.7/(bottom*bottom);//底座的二次函数的系数
    var k2 = radius*0.5/(top*top);//腰部的二次函数的系数
    var k3 = radius*0.3/(height*height);//塔尖的二次函数的系数
    var segments = 20;//微分的点的个数


    //创建塔尖
    var part = -spireHeight/(segments);
    for ( i = segments-1 ; i >= 0 ; i-- ){
        var tx = part*i-top-up;
        var tz = k3*(tx+1.2*height)*(tx+1.2*height);
        points.push ( new THREE.Vector3(tz,0,tx));
    }

    //创建塔的顶部
    var part = -up/segments;
    for ( var i = segments-10 ; i >= 0 ; i-- ){
        var tx = part*i-top;
        var tz = (0.5*radius+thickness)*Math.cos((tx+top)/up*(Math.PI/2));
        points.push ( new THREE.Vector3(tz,0,tx));
    }

    //创建塔的底座
    var part = -top/segments;
    for( var i = 0 ; i < segments - 5 ; i++ ){
        var tx = part*i;
        var tz = k2*tx*tx+thickness;
        points.push ( new THREE.Vector3(tz,0,tx));
    }
    part = bottom/segments;
    for ( var i = 0 ; i < segments - 5 ; i++ ){
        var tx = part*i;
        var tz = k1*tx*tx+thickness;
        points.push ( new THREE.Vector3(tz,0,tx));
    }


    //旋转出最终的塔体
    var latheGeometry = new THREE.LatheGeometry( points , segments*2 ,  0 , Math.PI*2 , true  );
    var latheBottom = createMesh ( latheGeometry , bodyColor );
    latheBottom.rotation.y += Math.PI*0.5;
    entireTower.add( latheBottom );
    add_info( x , 0 , z , radius*0.3 , h*0.2 , radius*0.3 );
    add_info ( x , h*0.2 ,z, radius*0.01 , h*0.4 , radius*0.01 );
    add_info ( x , h*0.8 , z , radius*0.3 , h*0.3 , radius*0.3);
    add_info ( x , h*0.8 ,z, radius*0.01 , h*1.5 , radius*0.01 );



   //创建塔的装饰品
    var torusGeometry = new THREE.TorusGeometry( 0.5*radius+thickness , 0.1*radius , 6 , segments );
    var decTower = createMesh ( torusGeometry , decColor );
    decTower.rotation.y += 0.5*Math.PI;
    decTower.position.x -= top;
    entireTower.add(decTower);

    var torusGeometry1 = new THREE.TorusGeometry( 0.2*radius , 0.1*radius , 4 , segments );
    var decTower1 = createMesh ( torusGeometry1 , decColor );
    decTower1.rotation.y += 0.5*Math.PI;
    decTower1.position.x -= top*2.15;
    entireTower.add(decTower1);


    entireTower.rotation.z += -Math.PI*0.5;

    //构造最终的返回值
    var ret = new THREE.Object3D();
    ret.add ( entireTower );
    ret.position.set ( x , y , z );

    return ret;
}

//创建一个钟楼
//x,y,z代表钟楼的坐标
//h代表钟楼的高度
//c1,c2,c3,c4分别是钟楼某一部分的颜色
function createBelfry ( x , y , z , h , c1 , c2 , c3  , c4 ){
    var height = h;
    var size = 6;//钟的边长
    var segments = 20;
    var dialColor = 0xfafad2;
    if( c1 ) dialColor = c1;
    var pointerColor = 0xcd853f;
    if ( c2 ) pointerColor = c2;
    var bodyColor = 0xeee685;
    if ( c3 ) bodyColor = c3;
    var roofColor = 0x8b814c;
    if ( c4 ) roofColor = c4;

    //整个钟楼
    var belfry = new THREE.Object3D();

    //创建钟楼的主体
    var bodyCube = new THREE.BoxGeometry(size ,height , size );
    var berifyBody = createMesh ( bodyCube ,bodyColor );
    berifyBody.position.set ( 0 , 0 , 0 );
    belfry.add(berifyBody);

    //创建四根装饰柱
    var initPhi = Math.PI/4;
    var varyPhi = Math.PI/2;
    var tempRadius = (size/2)*Math.sqrt(2);
    for ( var i = 0 ; i < 4 ; i++ ){
        var ta = initPhi+varyPhi*i;
        var tx = tempRadius*Math.sin(ta);
        var tz = tempRadius*Math.cos(ta);
        var ty = 0;
        var th = height*1.05;
        var pillarGeo = new THREE.CylinderGeometry( size*0.05 , size*0.05 , th , segments , segments , segments , true  );
        var pillar = createMesh ( pillarGeo , bodyColor );
        pillar.position.set ( tx , ty , tz );
        belfry.add( pillar );
    }

    //创建装饰用的条纹
    var stripes = new THREE.Object3D();
    var points = new Array();
    for ( var i = 0 ; i < 4 ; i++ ){
        var ta = initPhi+varyPhi*i;
        var tx = tempRadius*Math.sin(ta);
        var tz = tempRadius*Math.cos(ta);
        points.push ( [tx,tz] );
    }
    for ( var i = 1 ; i < 5 ; i++ ){
        var p1 = points[i-1];
        var p2 = points[i%4];
        var temp = createStripe( p1[0] , p1[1] , p2[0] , p2[1] , -size*0.5 , height-size  , size*0.05 );
        stripes.add(temp);
    }
    belfry.add(stripes);

    function createStripe ( x1,z1 ,x2,z2  , y , h , width , s , e  ){
        var start = 1;
        var count = 6;
        var end = count;
        if ( s ) start = s;
        if ( e ) end = e;
        var dx = (x2-x1)/count;
        var dz = (z2-z1)/count;
        //返回值
        var ret = new THREE.Object3D();

        for ( var i = start ; i < end ; i++ ){
            var tx = x1+dx*i;
            var tz = z1+dz*i;
            var stripeGeo = new THREE.CylinderGeometry( width , width , h , segments , segments , segments , true  );
            var stripe = createMesh ( stripeGeo , dialColor );
            stripe.position.set ( tx , y ,tz );
            ret.add(stripe);
        }
        return ret;
    }

    //创建钟楼的顶
    var roof = createRoof( size );
    belfry.add( roof);

    function createRoof ( size ){
        var ret = new THREE.Object3D();

        //创造屋顶的底部
        var roofBottom = createRoofBottom(size);
        roofBottom.position.set(0, height / 2 + (size / 2 * 0.7) / 2, 0);
        ret.add(roofBottom);
        //创建屋顶的中部
        var roofMiddle = createRoofMiddle(size*0.5);
        roofMiddle.position.set ( 0 ,height / 2 + (size / 2 * 0.7)+size*0.5*0.65/2 , 0 );
        ret.add(roofMiddle);
        //创建屋顶的顶部
        var roofTop = createRoofTop( size*0.5 );
        roofTop.position.set ( 0 ,height / 2 + (size / 2 * 0.7)+size*0.5*0.65/2 + size*0.5 , 0  );
        ret.add( roofTop );

        function createRoofBottom (size) {
            var roofGeo = new THREE.CylinderGeometry(size / 2 * 0.8, size / 2 * 1.5, size / 2 * 0.7, 4, segments, false);
            var roof = createMesh(roofGeo, roofColor);
            roof.rotation.y += Math.PI / 4;

            //构造返回值
            var ret = new THREE.Object3D();
            ret.add(roof);

            return ret;
        }

        function createRoofMiddle ( size ){

            var ret = new THREE.Object3D();

            var middleCeo = new THREE.BoxGeometry( size , size*0.65 , size );
            var middleCube = createMesh ( middleCeo, bodyColor );
            middleCube.position.set ( 0 , 0 , 0 );
            ret.add( middleCube );

            var initPhi = Math.PI/4;
            var varyPhi = Math.PI/2;
            var tempRadius = (size/2)*Math.sqrt(2);
            for ( var i = 0 ; i < 4 ; i++ ){
                var ta = initPhi+varyPhi*i;
                var tx = tempRadius*Math.sin(ta);
                var tz = tempRadius*Math.cos(ta);
                var ty = 0;
                var th = height*1.05;
                var pillarGeo = new THREE.CylinderGeometry( size*0.05 , size*0.05 , th , segments , segments , segments , true  );
                var pillar = createMesh ( pillarGeo , bodyColor );
                pillar.position.set ( tx , ty , tz );
                belfry.add( pillar );
            }

            //创建装饰用的条纹
            var points = new Array();
            for ( var i = 0 ; i < 4 ; i++ ){
                var ta = initPhi+varyPhi*i;
                var tx = tempRadius*Math.sin(ta);
                var tz = tempRadius*Math.cos(ta);
                points.push ( [tx,tz] );
            }
            for ( var i = 1 ; i < 5 ; i++ ){
                var p1 = points[i-1];
                var p2 = points[i%4];
                var temp = createStripe( p1[0] , p1[1] , p2[0] , p2[1] , 0 , size*0.65 , size*0.05 , 0 , 7 );
                ret.add(temp);
            }

            return ret;
        }

        function createRoofTop ( size ){
            var ret = new THREE.Object3D();
            var topGeo = new THREE.CylinderGeometry( 0 , size/2*1.5 , size*1.5 , 4 , segments , segments , false );
            var topMesh = createMesh ( topGeo , roofColor );
            topMesh.rotation.y += Math.PI / 4;
            ret.add( topMesh );
            return ret;
        }

        return ret;
    }
    //创建四面时钟
    var dial = createClock( size*0.9 );
    dial.position.set ( 0 , height/2-size*0.5 , size*0.5 );
    belfry.add(dial);

    var dial1 = createClock( size*0.9 );
    dial1.position.set (   size*0.5 , height/2-size*0.5 , 0 );
    dial1.rotation.y += Math.PI*0.5;
    belfry.add(dial1);

    var dial2 = createClock( size*0.9 );
    dial2.position.set ( 0 , height/2-size*0.5 , -size*0.5 );
    dial2.rotation.y += Math.PI;
    belfry.add(dial2);

    var dial3 = createClock( size*0.9 );
    dial3.position.set (   -size*0.5 , height/2-size*0.5 , 0 );
    dial3.rotation.y += Math.PI*1.5;
    belfry.add(dial3);

    function createClock ( size ){
        var width = size;
        var height = size;
        var innerRadius = size/15;
        var depth = 0.1;

        //整个表
        var clock = new THREE.Object3D();

        //创建一个表盘
        var dialGeo = new THREE.CubeGeometry(width,height,depth);
        var dial = createMesh ( dialGeo , dialColor );
        dial.position.set ( 0 , 0 , 0 );
        clock.add(dial);
        //创建表盘的中心
        var dialCenterGeo = new THREE.CylinderGeometry( innerRadius , innerRadius ,depth , segments , segments );
        var dialCenter = createMesh ( dialCenterGeo , pointerColor );
        dialCenter.position.set ( 0 , 0 , depth );
        dialCenter.rotation.x += -Math.PI*0.5;
        clock.add(dialCenter);
        //创建表盘的刻度
        var segmentPhi = Math.PI/6;
        var radius = size/2-innerRadius;
        for ( var i = 0 ; i < 12 ; i++ ){
            var angle = segmentPhi*i;
            var scaleGeo = new THREE.CubeGeometry( innerRadius , innerRadius*2 , depth );
            var scale = createMesh ( scaleGeo , pointerColor );
            scale.position.set ( radius*Math.sin(angle) , radius*Math.cos(angle) ,depth );
            scale.rotation.z += -angle;
            clock.add( scale );
        }


        //创建表的指针
        var hourPointer = createPointer( size/2*0.4 , innerRadius );
        var minutePointer = createPointer( size/2*0.7 , innerRadius );
        var myDate = new Date();
        console.log ( myDate.getHours());
        hourPointer.rotation.z -= (myDate.getHours()%12)*segmentPhi;
        minutePointer.rotation.z -= (myDate.getMinutes()*segmentPhi/5);
        setInterval( function(){
            minutePointer.rotation.z -= segmentPhi/5;
            hourPointer.rotation.z -= segmentPhi/60;
        },60000 );

        clock.add(hourPointer);
        clock.add(minutePointer);

        function createPointer ( length , width ){
            var shape = new THREE.Shape();
            shape.moveTo(0,0);
            shape.lineTo(-width/2,0);
            shape.lineTo( 0 , length );
            shape.lineTo(width/2,0);
            shape.lineTo(0,0);
            var options = {
                amount: depth,
                bevelThickness: 0.01,
                bevelSize: 0.2,
                bevelSegments: 30,
                bevelEnabled: true,
                curveSegments: 30,
                steps: 2
            };
            var pointerGeo = new THREE.ExtrudeGeometry( shape , options );
            var pointer = createMesh ( pointerGeo , pointerColor );
            pointer.position.set ( 0 , 0 , depth );
            //构造返回值
            var ret = new THREE.Object3D();
            ret.add(pointer);
            return ret;
        }


        //构建返回值
        var ret = new THREE.Object3D();
        ret.add(clock);

        return ret;
    }

    add_info ( x , y , z , size , h , size );
    add_info ( x , y+h , z , size*0.5 , 0.3*h , size*0.5 );

    //构建返回值
    var ret = new THREE.Object3D();
    ret.add(belfry);

    ret.position.set ( x , y , z );

    return ret;
}

//创建塔桥
function createBridge ( x , y , z , h ,c ){
    var width = h/3;
    var numFloor = 4;
    var segments = 20;
    var height = h/numFloor;
    var decColor = 0xababab;
    if ( c ) decColor = c;

    //组装桥
    var bridge = new THREE.Object3D();
    var left = createSingle();
    var right = createSingle();
    var distance = 8;
    left.position.x -= distance;
    right.position.x += distance;
    //left.position.z -= distance;
    //right.position.z -= distance;
    bridge.add(left);
    bridge.add(right);

    var stoneBridge = createStoneBridge();
    stoneBridge.position.set ( 0 , 0 , 0 );
    bridge.add(stoneBridge);

    add_info ( x-distance , y , z  , width , h*1.5 , width );
    add_info ( x+distance , y , z , width , h*1.5 , width );
    add_info ( x , y+height*2 , z , distance*2-width , height/5 , width );
    add_info ( x , y+height*2 , z , distance*2-width , height/2 , width/10 );


   /* setInterval ( function(){
        left.rotation.y += 0.1;
    },50);*/


    function createSingle ( ){
        var single = new THREE.Object3D();
        for ( var i = 0 ; i < 3 ; i++ ){
            var tempFloor = createMiddleFloor();
            tempFloor.position.set ( 0 , height*i , 0 );
            single.add(tempFloor);
        }
        var topFloor = createTopFloor();
        topFloor.position.set ( 0 , height*2.8 , 0 );
        single.add(topFloor);

        var bottomFloor = createBottomFloor();
        bottomFloor.position.set ( 0 , -height , 0 );
        single.add(bottomFloor);
        return single;
    }

    function createMiddleFloor ( ){
        var ret = new THREE.Object3D();
        var points = getCorner( width/2*Math.sqrt(2));

        //层的主体
        var cubeGeo = new THREE.BoxGeometry( width , height , width );
        var cubeBody = createStone( cubeGeo );
        cubeBody.position.set ( 0 , 0 , 0 );
        ret.add( cubeBody );

        //层的条纹
        for ( var i = 0 ; i < points.length ; i++ ){
            var j = (i+1)%points.length;
            var vertex = new Array();
            for ( var k = 0 ; k < 4 ; k++ )
                vertex.push( new Array());
            var p1 = points[i];
            var p2 = points[j];
            var dx = (p2[0]-p1[0])/segments;
            var dz = (p2[1]-p1[1])/segments;
            for ( var k = 0 ; k <= segments ; k++ ){
                var tx = dx*k+p1[0];
                var tz = dz*k+p1[1];
                var ty = [height*0.3,height*0.4,-height*0.3,-height*0.4];
                for ( var t = 0 ; t < ty.length ; t++ ){
                    vertex[t].push ( new THREE.Vector3( tx , ty[t] , tz ));
                }
            }
            for ( var k = 0 ; k < vertex.length ; k++ ){
                var tubeGeo = new THREE.TubeGeometry(
                    new THREE.SplineCurve3(vertex[k]),
                    segments , width/6*0.2 ,segments
                );
                var tubeMesh = createMesh( tubeGeo , decColor );
                ret.add(tubeMesh);
            }

        }

        //层的柱子
        for ( var i = 0 ; i < points.length; i++ ) {
            var cylinderGeo = new THREE.CylinderGeometry(width / 6, width / 6, height , segments , segments , false  );
            var cylinder = createStone(cylinderGeo);
            var p = points[i];
            cylinder.position.set (p[0] , 0 , p[1] );
            ret.add( cylinder );

            var torusGeo = new THREE.TorusGeometry( width/6 , width/6*0.2 , segments , segments );
            var torus = createMesh( torusGeo , decColor );
            torus.position.set ( p[0] , height*0.3 , p[1] );
            torus.rotation.x += Math.PI*0.5;
            ret.add( torus);

            var torus1 = createMesh( torusGeo , decColor );
            torus1.position.set ( p[0] , height*0.4 , p[1] );
            torus1.rotation.x += Math.PI*0.5;
            ret.add( torus1);

            var torus2 = createMesh( torusGeo , decColor );
            torus2.position.set ( p[0] , -height*0.4 , p[1] );
            torus2.rotation.x += Math.PI*0.5;
            ret.add( torus2);

            var torus3 = createMesh( torusGeo , decColor );
            torus3.position.set ( p[0] , -height*0.3 , p[1] );
            torus3.rotation.x += Math.PI*0.5;
            ret.add( torus3);
        }

        //层的装饰


        return ret;
    }

    function createTopFloor (){
        var ret = new THREE.Object3D();

        var points = getCorner( width/2*Math.sqrt(2));
        for ( var i = 0 ; i < points.length; i++ ) {
            var cylinderGeo = new THREE.CylinderGeometry(width / 6, width / 6, height/2, segments, segments, false);
            var cylinderGeo1 = new THREE.CylinderGeometry( 0 , width/6 , height/2 , 6 ,segments , false );
            var cylinder = createStone(cylinderGeo,"stone-bump.jpg");
            var cylinder1 = createStone ( cylinderGeo1 , "stone-bump.jpg");
            var p = points[i];
            cylinder.position.set(p[0], 0, p[1]);
            cylinder1.position.set ( p[0] , height/2 , p[1]);
            ret.add(cylinder);
            ret.add(cylinder1);
        }
        var cubeGeo = new THREE.BoxGeometry( width*0.8 , height/2 , width*0.6 );
        var cubeBody = createStone( cubeGeo , "stone-bump.jpg" );
        cubeBody.position.set( 0 , 0 , 0 );
        ret.add( cubeBody );

        var spireCylinder = new THREE.CylinderGeometry( 0 , width*0.55 ,height , 4 , segments ,false );
        var spire = createStone ( spireCylinder );
        spire.rotation.y = Math.PI/4;
        spire.position.set (  0 , height*0.7 , 0 );
        ret.add(spire);

        return ret;
    }

    function createBottomFloor() {
        var ret = new THREE.Object3D();
        var shape = new THREE.Shape();
        var options = {
            amount: width,
            bevelThickness: 0.01,
            bevelSize: 0.2,
            bevelSegments: 30,
            bevelEnabled: true,
            curveSegments: 30,
            steps: 2
        }

        //ret.add(mesh );
        return ret;
    }

    function createStoneBridge(){
        var ret = new THREE.Object3D();

        var cubeGeo = new THREE.BoxGeometry( distance*2-width , height/5 , width );
        var cubeBody = createStone( cubeGeo , "stone-bump.jpg" );
        cubeBody.position.set ( 0 , height*2 , 0 );
        ret.add(cubeBody);

        var wall1 = createWall();
        wall1.position.z += width/2;
        wall1.position.y += height/10;
        ret.add(wall1);
        var wall2 = createWall();
        wall2.position.z -= width/2;
        wall2.position.y += height/10;
        ret.add(wall2);


        function createWall ( ){
            var ret = new THREE.Object3D();
            //var cubeGeo = new THREE.BoxGeometry( distance*2-width , height/2 , width/10 );
            var cubeGeo = new THREE.BoxGeometry( height/2 , height/2 , width/10 );
            var cubeBody = createStone( cubeGeo , "stone-bump.jpg");
            var cubeGeo1 = new THREE.BoxGeometry( height/5 , height/3 , width/10 );
            var cubeBody1 = createStone( cubeGeo1 , "stone-bump.jpg");
            cubeBody.position.set( 0 , height*2 , 0 );
            cubeBody1.position.set ( 0 , height*2.3 , 0 );
            ret.add(cubeBody);
            //add_info ( cubeBody.position.x , cubeBody.position.y , cubeBody.position.z , height/2 , height/2 , width/10 );
            //add_info ( cubeBody1.position.x , cubeBody1.position.y , cubeBody1.position.z , height/5 , height/3 , width/10)
            ret.add(cubeBody1);
            var count = 3;
            for ( var i = 1 ; i < count ; i++  ){

                var tx = height/2*i;
                var tempCube = createStone( cubeGeo , "stone-bump.jpg");
                tempCube.position.set ( tx , height*2 , 0 );
                ret.add( tempCube );
                //add_info ( tempCube.position.x , tempCube.position.y , tempCube.position.z , height/2 , height/2 , width/10 );

                var tx = -height/2*i;
                var tempCube = createStone( cubeGeo ,"stone-bump.jpg");
                tempCube.position.set ( tx , height*2 , 0 );
                ret.add(tempCube);
                //add_info ( tempCube.position.x , tempCube.position.y , tempCube.position.z , height/2 , height/2 , width/10 );

                var tx = height/2*i;
                var tempCube = createStone( cubeGeo1 , "stone-bump.jpg");
                tempCube.position.set ( tx , height*2.3 , 0 );
                ret.add( tempCube );
                //add_info ( tempCube.position.x , tempCube.position.y , tempCube.position.z , height/5 , height/3 , width/10);
                var tx = -height/2*i;
                var tempCube = createStone( cubeGeo1 ,"stone-bump.jpg");
                tempCube.position.set ( tx , height*2.3 , 0 );
                ret.add(tempCube);
                //add_info ( tempCube.position.x , tempCube.position.y , tempCube.position.z , height/5 , height/3 , width/10)
            }
            return ret;
        }

        return ret;
    }

    function getCorner ( radius ){
        var points = new Array();
        var initPhi = Math.PI/4;
        var varyPhi = Math.PI/2;
        for ( var i = 0 ; i < 4 ; i++ ){
            var ta = initPhi+varyPhi*i;
            var tx = radius*Math.sin(ta);
            var tz = radius*Math.cos(ta);
            points.push ( [tx,tz]);
        }
        return points;
    }

    bridge.position.set ( x , y , z );

    var ret = new THREE.Object3D();
    ret.add( bridge );
    return ret;

}

//创建普通的反光材质
function createMesh( geom,color ){
    if ( !color )
        color = 0xffff00;
    var mesh =  new THREE.Mesh( geom , new THREE.MeshLambertMaterial({ color: color }));
    mesh.receiveShadow = true;//所有的立体图形都接受投影
    mesh.castShadow = true;//所有的立体图形都产生投影
    return mesh;
}

//创建石头的材质
function createStone ( geo ,image ,flag ){
    var texture = new THREE.ImageUtils.loadTexture(
        "../textures/general/stone.jpg"
    );
    if ( image ){
        texture = new THREE.ImageUtils.loadTexture(
            "../textures/general/"+image
        );
    }
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;

    var bump;
    if( !flag ){
        bump = THREE.ImageUtils.loadTexture(
            "../textures/general/stone-bump.jpg"
        );
        mat.bumpMap = bump;
        mat.bumpScale = 0.2;
    }

    var mesh = new THREE.Mesh ( geo , mat );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}
