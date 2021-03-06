let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'container',
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: { y: 10 },
            debug: false,
            setBounds: {
                x: 0,
                y: 0,
                height: 600,
                width: 800,
                thickness: 16
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            createAsteroids: createAsteroids,
            shootAsteroid: shootAsteroid,
            hitAsteroid: hitAsteroid
        }
    }
};

let game = new Phaser.Game(config);

let asteroids = [];
let missiles = [];
let firing = false;
let score = 0;

function preload() {
    this.load.image('space', 'src/assets/space.jpg');
    this.load.image('ship', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Ships/spaceShips_001.png');
    this.load.image('missile', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Missiles/spaceMissiles_001.png');
    this.load.image('asteroid', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Meteors/spaceMeteors_001.png');
    this.load.audio('fire', 'src/assets/soundfx/gameburp/TECH WEAPON Gun Shot Phaser Down 02.wav');
    this.load.audio('explode', 'src/assets/soundfx/gameburp/EXPLOSION Bang 04.wav');
    this.load.audio('gameover', 'src/assets/soundfx/gameburp/NEGATIVE Failure Descending Chime 05.wav');
}

function create() {
    this.add.image(0, 100, 'space');
    scoreText = this.add.text(10, 10, 'score: 0', { fontSize: '16px', fill: '#fff' });

    this.player = this.physics.add.sprite(Phaser.Math.RND.integerInRange(50, 750), Phaser.Math.RND.integerInRange(50, 450), 'ship');
    this.player.angle = -90;
    this.player.setDisplaySize(50, 50);
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.addKeyCapture([Phaser.Input.Keyboard.KeyCodes.SPACE]);

    this.fireSound = this.sound.add('fire');
    this.fireSound.volume = 0.04;

    this.explosionSound = this.sound.add('explode');
    this.explosionSound.volume = 0.1;

    this.gameoverSound = this.sound.add('gameover');
    this.gameoverSound.volume = 0.2;

    this.createAsteroids();
    this.time.addEvent({ delay: 2000, callback: this.createAsteroids, callbackScope: this, loop: true });
}

function update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
    }
    else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
    }
    else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.player.setVelocityY(-160);
    }
    else if (this.cursors.down.isDown) {
        this.player.setVelocityY(160);
    }
    else {
        this.player.setVelocityY(0);
    }

    asteroids.map((asteroid) => this.physics.add.overlap(this.player, asteroid, this.hitAsteroid, null, this));

    if (this.fire.isDown) {
        if (!firing) {
            firing = true;
            this.fireSound.play();
            const missile = this.physics.add.image(this.player.x + 30, this.player.y, 'missile');
            missile.angle = 90;
            missile.setVelocityX(300);
            asteroids.map((asteroid) => this.physics.add.overlap(missile, asteroid, this.shootAsteroid, null, this));
            missiles.push(missile);

        }
    } else if (this.fire.isUp) {
        firing = false;
    }
}

function createAsteroids() {
    console.log('adding');
    for (let i = 0; i < Phaser.Math.RND.integerInRange(0, 5); i++) {
        const scale =  Phaser.Math.RND.integerInRange(30, 100);
        const speed = Phaser.Math.RND.integerInRange(1, 5);
        const asteroid = this.physics.add.sprite(850, Phaser.Math.RND.integerInRange(scale, 600 - scale), 'asteroid');
        asteroid.setVelocityX(-50 * speed);
        asteroid.setDisplaySize(scale, scale);
        missiles.map((missile) => this.physics.add.overlap(missile, asteroid, this.shootAsteroid, null, this));
        asteroids.push(asteroid);
    }
}

function shootAsteroid(missile, asteroid) {
    missile.disableBody(true, true);
    asteroid.disableBody(true, true);

    this.explosionSound.play();

    score += 10;
    scoreText.setText('score: ' + score);
    missiles.filter((item) => item !== missile);
}

function hitAsteroid(player, asteroid) {
    player.disableBody(true, true);
    asteroid.disableBody(true, true);

    this.explosionSound.play();
    this.gameoverSound.play();

    gameOver = this.add.text(400, 300, 'GAME OVER').setDepth(1000).setFont('64px Arial').setColor('#ff6666').setShadow(2, 2, "#333333", 2).setAlign('center');
    gameOver.setOrigin(0.5);
}
