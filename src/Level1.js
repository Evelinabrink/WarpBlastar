class Level1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Level1' });

        this.firing = false;
    }

    preload() {
        this.load.image('sky', 'src/assets/sky.jpg');
        this.load.image('ship', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Ships/spaceShips_001.png');
        this.load.image('missile', 'src/assets/kenney_spaceshooterextension/PNG/Sprites/Missiles/spaceMissiles_001.png');
        this.load.audio('fire', 'src/assets/soundfx/gameburp/TECH WEAPON Gun Shot Phaser Down 02.wav');
    }

    create() {
        console.log(this);
        this.add.image(0, 100, 'sky');
        this.player = this.physics.add.sprite(Math.floor(Math.random() * Math.floor(400)) + 50, Math.floor(Math.random() * Math.floor(500)) + 50, 'ship');
        this.player.angle = -90;
        this.player.setDisplaySize(50, 50);
        this.player.setBounce(0.5);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.addKeyCapture([Phaser.Input.Keyboard.KeyCodes.SPACE]);

        this.fireSound = this.sound.add('fire');
        this.fireSound.volume = 0.1;
    }

    update() {
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

        if (this.fire.isDown) {
            if (!this.firing) {
                this.firing = true;
                this.missile = this.physics.add.image(this.player.x + 30, this.player.y, 'missile');
                this.missile.angle = 90;
                this.missile.setVelocityX(200);
                this.fireSound.play();
            }
        } else if (this.fire.isUp) {
            this.firing = false;
        }
        // if (cursors.up.isDown && player.body.touching.down)
        // {
        //     player.setVelocityY(-330);
        // }
    }
}
