const rewardList = [
    { val: -1, label: "5USD" },
    { val: -2, label: "20USD" },
    { val: -3, label: "Discount 10%" },
    { val: 0, label: "Thanks" },
    { val: 1, label: "50 Points" },
    { val: 2, label: "100 Points" }
];

class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload() {
        // Add a simple loading text or graphic
        // this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Loading...', {
        //     font: '32px Arial', fill: '#ffffff'
        // }).setOrigin(0.5, 0.5);

        this.load.image('loadingBackground', 'assets/images/loadingBackground.png');

        // Load assets for the main scene
        this.load.image('background', 'assets/images/background2.png');
        this.load.image('wheel', 'assets/images/wheel2.png');
        this.load.image('bgWheel', 'assets/images/bgWheel.png');
        this.load.image('pin', 'assets/images/pin.png');
        this.load.image('spinButton', 'assets/images/spinButton2.png');
        this.load.image('bgReward', 'assets/images/backgroundReward.png');
        this.load.image('box', 'assets/images/box.png');
        this.load.image('btnClaim', 'assets/images/btnClaim.png');
    }

    create() {

        const background = this.add.image(0, 0, 'loadingBackground');
        background.setOrigin(0.5, 0.5); // Center origin

        // Set the initial position to the center of the canvas
        background.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);

        // Calculate scale to cover the canvas
        const scaleX = this.sys.game.config.width / background.width;
        const scaleY = this.sys.game.config.height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        // Delay the transition to the main scene by 1 second
        this.time.delayedCall(2000, () => {
            this.scene.start('MainScene');
        });
    }
}

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Preload anything else specific to this scene if needed
        this.load.audio('spinSound', 'assets/audios/spinSound.mp3');
    }

    create() {
        const spinSound = this.sound.add("spinSound");

        // Function to show toast message
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000); // Hide after 3 seconds
        }

        // Set the background image
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background')
            .setOrigin(0.5, 0.5)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        
        
        // Add the wheel
        const wheel = this.add.sprite(this.cameras.main.width / 2, 250, 'wheel');
        wheel.setScale(0.45);
        wheel.setOrigin(0.5, 0.5);

        const bgWheel = this.add.sprite(this.cameras.main.width / 2, 250, 'bgWheel');
        bgWheel.setScale(0.75);
        bgWheel.setOrigin(0.5, 0.5);

        // Add the pin
        const pin = this.add.sprite(wheel.x, wheel.y, 'pin');
        pin.setDisplaySize(50, 50);

        // Add the button below the wheel
        const spinButton = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 100, 'spinButton');
        spinButton.setScale(0.4);
        spinButton.setOrigin(0.5, 0.5);
        spinButton.setInteractive();

        // Set button click to spin the wheel
        spinButton.on('pointerdown', () => {
            spinSound.play();
            spinWheel.call(this, wheel, spinSound,showToast);
        });
    }

    update() {
        // Update the scene if necessary
    }
}

const config = {
    type: Phaser.AUTO,
    width: Math.min(480, window.innerWidth), // Set max-width to 480
    height: window.innerHeight, // Set height to 100%
    parent: 'game-container',
    scene: [LoadingScene, MainScene] // Include both scenes in the game
};

const game = new Phaser.Game(config);

function spinWheel(wheel, spinSound, showToast) {
    const rounds = Phaser.Math.Between(2, 4); // Random rounds to spin
    let degrees = Phaser.Math.Between(0, 360); // Random final position

    // Define the angle range to avoid, e.g., segment 3 between 90 and 135 degrees
    const avoidSegmentStart = 90;
    const avoidSegmentEnd = 135;

    // If the random angle falls within the avoid range, shift it out of that range
    if (degrees >= avoidSegmentStart && degrees <= avoidSegmentEnd) {
        degrees = (degrees + (avoidSegmentEnd - avoidSegmentStart + 1)) % 360;
    }

    const totalAngle = 360 * rounds + degrees;

    this.tweens.add({
        targets: wheel,
        angle: totalAngle,
        ease: 'Cubic.easeOut',
        duration: Phaser.Math.Between(4000, 5000), //Generate a random duration between 4000ms and 5000ms
        onComplete: () => {
            spinSound.stop();
            const winningSegment = determineWinningSegment(wheel.angle % 360);

            let winIndex = rewardList.findIndex(item => item.val == winningSegment);
            console.log("Winning Segment: ", winIndex > -1 ? rewardList[winIndex].label : "Thanks");

            // showToast(`${winIndex > -1 ? rewardList[winIndex].label : "Thanks"}`);
            showPopup.call(this, winIndex > -1 ? rewardList[winIndex].label : "Thanks haha");
        }
    });
}

function determineWinningSegment(angle) {
    // Logic to determine the winning segment based on the angle
    const segmentCount = 6;
    const degreesPerSegment = 360 / segmentCount;
    return Math.floor(angle / degreesPerSegment);
}

function showPopup(reward) {
    // Add the popup background image
    const popupBackground = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bgReward');
    popupBackground.setOrigin(0.5, 0.5);
    popupBackground.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // const box = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'box');
    // box.setOrigin(0.5, 0.5);

    const style = { font: '20px Arial', fill: '#ffffff', align: 'center' };
    const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerX, `Congratulations!\nYou won ${reward}`, style);
    text.setOrigin(0.5, 0.5);

    const btnClaim = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 100, 'btnClaim');
    btnClaim.setOrigin(0.5, 0.5);
    btnClaim.setScale(0.5)
    btnClaim.setInteractive();

    btnClaim.on('pointerdown', () => {
        popupBackground.destroy(); // Remove the popup
        text.destroy();
        btnClaim.destroy();
        // Add more logic here if needed, like moving to another scene
    });
}
