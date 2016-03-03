/**
 * Created by llin on 2016/1/15.
 */

var print_text;

function print_info ( ){

    var options = {
        size: 1,
        height: 1,
        weight: 'normal',
        font: 'helvetiker',
        style: 'normal',
        bevelThickness: 0.2,
        bevelSize: 4,
        bevelSegments: 3,
        bevelEnabled: false,
        curveSegments: 12,
        steps: 0
    };

    print_text = createMesh( new THREE.TextGeometry("Game over!",options));
    print_text.position.set ( birdX , birdY , birdZ );
    print_text.rotation.y += Math.PI;
    scene.add( print_text );
    console.log ( "Game over!");

}