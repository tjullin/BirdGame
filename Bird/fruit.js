/**
 * Created by llin on 2016/1/14.
 */

//创建一个苹果（获得积分的碰撞物）
function createApple ( r ,c1 ,c2 ) {

    //整个苹果
    var entireApple = new THREE.Object3D();
    var appleColor = 0xff0000;
    var leafColor = 0x00ff00;
    if ( !c1 ) appleColor = 0xff0000;
    else appleColor = c1;
    if ( !c2 ) leafColor = 0x00ff00;

    //苹果的主体部分
    var radius = 3;
    var height = radius/3;
    var segments = 20;
    if (r) radius = r;
    var torusGeometry = new THREE.TorusGeometry(radius/2, radius, segments, segments);
    var torusTop = createMesh(torusGeometry, appleColor );
    torusTop.rotation.x += 0.5 * Math.PI;
    torusTop.position.set ( 0 , 0 , 0 );
    entireApple.add( torusTop );

    //苹果上边的叶子的根茎
    var cylinder = new THREE.CylinderGeometry( radius/20 , radius/20 , radius*2.5 , segments , segments );
    var leafBottom = createMesh ( cylinder , leafColor );
    leafBottom.position.set ( 0 , 0 , 0 );
    entireApple.add( leafBottom );

    //苹果上边的叶子
    var leaf = createLeaf( radius );
    leaf.position.set ( 0 , radius*1.15  , 0);
    entireApple.add(leaf);

    function createLeaf ( length ){
        var shape = new THREE.Shape();
        shape.moveTo( 0,0 );
        shape.quadraticCurveTo( -length/3 , -length/2 , 0 , -length );
        shape.quadraticCurveTo( length/3 , -length/2 , 0 , 0 );
        var options = {
            amount: 0.1,
            bevelThickness: 0.01,
            bevelSize: 0.2,
            bevelSegments: 30,
            bevelEnabled: true,
            curveSegments: 30,
            steps: 2
        };
        var geo = new THREE.ExtrudeGeometry( shape , options );
        var leaf = createMesh ( geo , leafColor );
        leaf.rotation.x += 0.6*Math.PI;
        //leaf.rotation.y += 0.5*Math.PI;
        leaf.rotation.z += 0.5*Math.PI;
        return leaf;
    }

    entireApple.rotation.x -= 0.2;

    setInterval ( function(){
        entireApple.rotation.y -= 0.1;
    },50 );

    var ret = new THREE.Object3D();
    ret.add(entireApple);

    return ret;
}

