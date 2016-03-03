/**
 * Created by llin on 2016/1/15.
 */


var bird;
var camera;
var scene;
var spotLight;
var directionalLight;

function init ( ){
    //创建一个空的场景
    scene = new THREE.Scene();

    //声明一个透视相机
    //参数说明：（按照前后顺序）
    //视场：从相机位置能够看到的部分场景
    //长宽比：渲染结果输出区的横向长度和纵向长度的比值
    //近面：渲染的场景离摄像机的最近直线距离
    //远面：渲染的场景离摄像机的最远直线距离
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set( 0 , 10 , -30 );
    camera.lookAt( new THREE.Vector3( 0 , 10 , 30) );

    // 创建一个渲染器
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));//设置渲染的颜色
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);//设置渲染的尺寸
    webGLRenderer.shadowMapEnabled = true;//允许阴影的出现

    //创建光照
    //添加ambient环境光
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    //添加实现阴影效果的光源
    /*spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-30, 100, -20);
    spotLight.castShadow = true;
    scene.add(spotLight);*/


    var pointColor = "#ffffff";
    directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.position.set(-40, 40, -10);
    directionalLight.castShadow = true;
    directionalLight.shadowCameraNear = 2;
    directionalLight.shadowCameraFar = 400;
    directionalLight.shadowCameraLeft = -50;
    directionalLight.shadowCameraRight = 50;
    directionalLight.shadowCameraTop = 50;
    directionalLight.shadowCameraBottom = -50;

    directionalLight.distance = 0;
    directionalLight.intensity = 0.8;
    directionalLight.shadowMapHeight = 1024;
    directionalLight.shadowMapWidth = 1024;


    scene.add(directionalLight);
    //设置阳光
    /*spotLight1 = new THREE.DirectionalLight(0xffffff);
    spotLight1.position.set(-30, 10000, -20);
    spotLight1.castShadow = true;
    scene.add(spotLight1);*/



    var groundColor = 0x838b8b;
    //创建一个平面
    var planeGeometry = new THREE.PlaneGeometry( 150 , 150 ,10 , 10 );
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: groundColor
    });
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = -2;
    plane.position.z = 0;

    scene.add( plane );


    bird = createBird();
    //bird.rotation.y -= Math.PI/2;
    scene.add(bird);


    //布置场景
    var bridge1 = createBridge( 30 , 0 , -40 , 20 );
    scene.add( bridge1 );

    var bridge1 = createBridge( -30 , 0 , -40 , 20 );
    scene.add( bridge1 );

    var bridge1 = createBridge( 30 , 0 , 40 , 20 );
    scene.add( bridge1 );

    var bridge1 = createBridge( -20 , 0 , 40 , 20 );
    scene.add( bridge1 );

    var tower1 = createTower( 15 ,  11 , 10 , 4 , 20 );
    scene.add( tower1 );

    var tower2 = createTower( -15 ,  11 , 10 , 4 , 20 );
    scene.add( tower2 );

    var tower3 = createTower( -15 ,  11 , -10 , 4 , 20 );
    scene.add( tower3 );

    var tower4 = createTower( 15 ,  11 , -10 , 4 , 20 );
    scene.add( tower4 );

    var belfry1 = createBelfry( -25 , 8 , 20 , 20 );
    scene.add( belfry1 );

    var belfry2 = createBelfry( 25 , 8 , 20 , 20 );
    scene.add( belfry2 );

    var belfry3 = createBelfry( 25 , 8 , -20 , 20 );
    scene.add( belfry3 );

    var belfry4 = createBelfry( -25 , 8 , -20 , 20 );
    scene.add( belfry4 );


    //生成苹果的函数
    setInterval ( function(){
        var tx = get_random( -55 , 55 );
        var tz = get_random( -55 , 55 );
        var ty = get_random( 5 , 40 );
        var temp = createApple( 1 );
        apples.push ( temp );
        temp.position.set ( tx , ty , tz );
        scene.add( temp );
    },5000 );



    render();

    function render() {
        goStraight ( bird , 85 );
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    document.getElementById("THREE-output").appendChild(webGLRenderer.domElement);
}

window.onload = init;

function get_random( begin,end){
    return Math.floor(Math.random()*(end-begin))+begin;
}