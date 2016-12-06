let resources = {};
let sounds = {};

function loadResources(doneFunc) {

    let imageQueue = [
        {name: "sand", src: "res/textures/sand.png"},
        {name: "tileHoleOpenedRed", src: "res/tiles/tile_goal_red_open.png"},
        {name: "tileHoleOpenedBlue", src: "res/tiles/tile_goal_blue_open.png"},
        {name: "tileHoleClosedRed", src: "res/tiles/tile_goal_red.png"},
        {name: "tileHoleClosedBlue", src: "res/tiles/tile_goal_blue.png"},
        {name: "tilePit", src: "res/tiles/tile_pit.png"},
        {name: "tileMidfield", src: "res/tiles/tile_middle.png"},
        {name: "tileAroundBlueDown", src: "res/tiles/tile_around_blue_down.png"},
        {name: "tileAroundBlueUp", src: "res/tiles/tile_around_blue_up.png"},
        {name: "tileAroundRedDown", src: "res/tiles/tile_around_red_down.png"},
        {name: "tileAroundRedUp", src: "res/tiles/tile_around_red_up.png"},
        {name: "tileSpecialBlueDown", src: "res/tiles/tile_special_blue_down.png"},
        {name: "tileSpecialBlueUp", src: "res/tiles/tile_special_blue_up.png"},
        {name: "tileSpecialRedDown", src: "res/tiles/tile_special_red_down.png"},
        {name: "tileSpecialRedUp", src: "res/tiles/tile_special_red_up.png"},
        {name: "playerDartBlueRegular", src: "res/objects/c_b_dart_01.png"},
        {name: "playerBladeBlueRegular", src: "res/objects/c_b_blade_01.png"},
        {name: "playerMaulBlueRegular", src: "res/objects/c_b_maul_01.png"},
        {name: "playerDartRedRegular", src: "res/objects/c_r_dart_01.png"},
        {name: "playerBladeRedRegular", src: "res/objects/c_r_blade_01.png"},
        {name: "playerMaulRedRegular", src: "res/objects/c_r_maul_01.png"},
        {name: "playerDartBlueBashed", src: "res/objects/c_b_dart_02.png"},
        {name: "playerBladeBlueBashed", src: "res/objects/c_b_blade_02.png"},
        {name: "playerMaulBlueBashed", src: "res/objects/c_b_maul_02.png"},
        {name: "playerDartRedBashed", src: "res/objects/c_r_dart_02.png"},
        {name: "playerBladeRedBashed", src: "res/objects/c_r_blade_02.png"},
        {name: "playerMaulRedBashed", src: "res/objects/c_r_maul_02.png"},
        {name: "torque", src: "res/objects/torque.png"},
        {name: "directionTopLeft", src: "res/directions/tile_direction_01.png"},
        {name: "directionTopRight", src: "res/directions/tile_direction_02.png"},
        {name: "directionRight", src: "res/directions/tile_direction_03.png"},
        {name: "directionBottomRight", src: "res/directions/tile_direction_04.png"},
        {name: "directionBottomLeft", src: "res/directions/tile_direction_05.png"},
        {name: "directionLeft", src: "res/directions/tile_direction_06.png"},
    ]

    let soundQueue = [
        {name: "bomp", src: "Sounds/bomp.wav"},
    ];

    function loadImage(src, imgDoneFunc) {
        let img = new Image();
        img.onload = () => imgDoneFunc(img);
        img.src = src;
    }

    function loadNextImage() {
        if (imageQueue.length == 0) {
            initAudio();
        } else {
            let item = imageQueue[0];
            imageQueue.splice(0, 1);
            loadImage(item.src, img => {
                resources[item.name] = img;
                loadNextImage();
            })
        }
    }

    function initAudio() {
        if (document.location.origin.indexOf("file:") != -1) {
            doneFunc();
            return;
        }
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            sounds.webAudioContext = new AudioContext();
            loadNextSample();
        } catch (e) {
            doneFunc();
        }
    }

    function loadSample(src, sampleDoneFunc) {
        var request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
            sounds.webAudioContext.decodeAudioData(request.response, function (buffer) {
                sampleDoneFunc(buffer);
            }, function () {
                sampleDoneFunc(null);
            });
        };
        request.send();
    }

    function loadNextSample() {
        if (soundQueue.length == 0) {
            doneFunc();
        } else {
            let item = soundQueue[0];
            soundQueue.splice(0, 1);
            loadSample(item.src, buffer => {
                sounds[item.name] = buffer;
                loadNextSample();
            })
        }
    }

    loadNextImage();
}

function playSound(buffer) {
    if (sounds.webAudioContext == null) {
        return;
    }
    var source = sounds.webAudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(sounds.webAudioContext.destination);
    source.start(0);
}
