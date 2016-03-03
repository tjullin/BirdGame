 /**
 * Created by llin on 2016/1/10.
 */

var bird;
var spotLight;

function init ( ){
    //创建一个空的场景
    var scene = new THREE.Scene();

    //声明一个透视相机
    //参数说明：（按照前后顺序）
    //视场：从相机位置能够看到的部分场景
    //长宽比：渲染结果输出区的横向长度和纵向长度的比值
    //近面：渲染的场景离摄像机的最近直线距离
    //远面：渲染的场景离摄像机的最远直线距离
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // 创建一个渲染器
    var webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));//设置渲染的颜色
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);//设置渲染的尺寸
    webGLRenderer.shadowMapEnabled = true;//允许阴影的出现

    var planeGeometry = new THREE.PlaneGeometry( 100 , 100 ,10 , 10 );
    var planeMaterial = new THREE.MeshLambertMaterial({
        color: 0x00cc00
    });
    var plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.receiveShadow = true;
    plane.position.set ( 5 , 5 ,5 );

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = -15;
    plane.position.z = 0;

    scene.add( plane );


    bird1 = createBird();
    bird1.position.set ( 3 ,3 ,3 );
    //scene.add( bird1 );

    bird2 = createBird( 0xcccccc , 0x0101ff );
    bird2.position.set ( -3 , 3 ,3 );
    //scene.add( bird2 );

    bird = createBird();
    scene.add ( bird );
    bird.position.y = -13;
    //var cube = createBuilding( 4 ,-4 ,-3 , 3 , 20 , 3 );
    //var cube1 = createBuilding ( -7 , 0 , -2 , 3 , 20 ,3 );
    // position the cube

    // add the cube to the scene
    //scene.add(cube);
    //scene.add(cube1);

    //对塔建筑的测试
    var tower = createTower ( -15,0,0,3,15 );
    //tower.rotation.z += -Math.PI*0.5;
    scene.add( tower );

    //对苹果的测试
    var apple = createApple( 1 );
    apple.position.set ( 16 , 0 , 3 );
    scene.add( apple );

    //对钟楼进行测试
    var belfry = createBelfry( 15 , 0 , -5 , 17);
    /*setInterval( function(){
        belfry.rotation.y += 0.1;
    },50);*/
    //belfry.rotation.x += -Math.PI*0.5;
    scene.add( belfry );


    //对塔桥进行测试
    var bridge = createBridge( -5 , 0 , -6 , 16  );
    /*setInterval ( function(){
        bridge.rotation.y += 0.1;
    },50);*/
    scene.add( bridge );


    // /对石头墙壁的测试
   // var stoneGeo = new THREE.BoxGeometry( 5 , 5 , 5 );
   // var stone = createStone( stoneGeo , "stone.jpg" , "stone-bump.jpg");
    //scene.add( stone );

    function createStone ( geo , imageFile , bump ){
        var texture = new THREE.ImageUtils.loadTexture(
          "../textures/general/" + imageFile
        );
        var mat = new THREE.MeshPhongMaterial();
        mat.map = texture;

        var bump = THREE.ImageUtils.loadTexture(
          "../textures/general/"+ bump
        );

        mat.bumpMap = bump;
        mat.bumpScale = 0.2;

        var mesh = new THREE.Mesh ( geo , mat );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }


    // 设置相机的位置和焦点
    camera.position.x = 0;
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //添加ambient环境光
    var ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    //添加实现阴影效果的光源
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-30, 60, 60);
    spotLight.castShadow = true;
    scene.add(spotLight);

    render();

    function render() {
        bird.rotation.y += 0.01;
        //goStraight ( bird , 85 );
        requestAnimationFrame(render);
        webGLRenderer.render(scene, camera);
    }

    document.getElementById("WebGL-output").appendChild(webGLRenderer.domElement);

}

window.onload = init;1