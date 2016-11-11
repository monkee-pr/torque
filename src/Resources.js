let resources = {};
let sounds = {};

function loadResources(doneFunc) {

    let imageQueue = [
        {name: "sand", src: "res/textures/sand.png"},
        {name: "charakter", src: "res/textures/charakter.png"},
    ];

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
