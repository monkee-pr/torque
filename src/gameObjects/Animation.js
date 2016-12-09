class Animation extends GameObject {
    constructor(sprites = [], duration, type = Animation.TYPE_STRAIGHT) {
        this.sprites = sprites;     // the single frames
        this.duration = duration;   // how long a loop should take in ms
        this.type = type;

        this.active = false;
        this.activeSprite = this.sprites[0];
        this.startTime = null;
        this.runningLoops = 0;
    }

    start() {
        this.startTime = Date.now();

        this.active = true;
    }

    run() {
        const now = Date.now();
        const diff = now - this.startTime;
        const progressOfCurrentLoop = diff % this.duration;
        const activeSpriteIndex = Math.floor(sprites.length / duration * progressOfCurrentLoop);

        this.activeSprite = this.sprites[activeSpriteIndex];
    }

    stop() {
        this.pause();
        this.activeSprite = this.sprites[0];
    }

    pause() {
        this.active = false;
    }
}
Animation.TYPE_STRAIGHT;
Animation.TYPE_LOOP;
