let usersData = [];
const rewardList = [
    { val: -1, label: "5USD" },
    { val: -2, label: "20USD" },
    { val: -3, label: "Discount 10%" },
    { val: 0, label: "Thanks" },
    { val: 1, label: "50 Points" },
    { val: 2, label: "100 Points" }
];

function preload() {
    this.load.audio('introSound', 'assets/audios/intro.mp3');
    this.load.audio('collectSound', 'assets/audios/collect.mp3');
    this.load.audio('spinSound', 'assets/audios/spinSound.mp3');

    this.load.image('background', 'assets/images/background.png');
    this.load.image('wheel', 'assets/images/wheel.png');
    this.load.image('bgWheel', 'assets/images/bgWheel.png');
    this.load.image('pin', 'assets/images/pin.png');
    this.load.image('spinButton', 'assets/images/spinButton.png');
    this.load.image('bgReward', 'assets/images/backgroundReward.png');
    this.load.image('box', 'assets/images/box.png');
    this.load.image('btnClaim', 'assets/images/btnClaim.png');


    // Preload avatars
    this.load.image('avatar1', 'assets/images/user.png');
    this.load.image('avatar2', 'assets/images/user.png');
    this.load.image('avatar3', 'assets/images/user.png');
    this.load.image('avatar4', 'assets/images/user.png');
    this.load.image('avatar5', 'assets/images/user.png');
    
}

function create() {
    const introSound = this.sound.add("introSound");
    const collectSound = this.sound.add("collectSound");
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

    // Position the wheel at the top of the screen
    const bgWheel = this.add.sprite(this.cameras.main.width / 2, 200, 'bgWheel');
    bgWheel.setScale(0.51);
    bgWheel.setOrigin(0.5, 0.5);

    const wheel = this.add.sprite(this.cameras.main.width / 2, 200, 'wheel');
    wheel.setScale(0.33);
    wheel.setOrigin(0.5, 0.5);

    // Add the pin
    const pin = this.add.sprite(wheel.x, wheel.y, 'pin');
    pin.setDisplaySize(100, 100);

    // Calculate the total height of the user list block
    const users = [
        { name: 'Kim Joung Un', avatar: 'avatar1', value: 6202 },
        { name: 'Kim Joung Un', avatar: 'avatar2', value: 6202 },
        { name: 'Kim Joung Un', avatar: 'avatar3', value: 6202 },
        { name: 'Kim Joung Un', avatar: 'avatar4', value: 6202 },
        { name: 'Kim Joung Un', avatar: 'avatar5', value: 6202 },
    ];

    const userRowHeight = 55;
    const userBlockHeight = users.length * userRowHeight;

    // Calculate the start Y position for the user block
    const startY = this.cameras.main.height - userBlockHeight - 20; // Positioned above the bottom with some margin
    const startX = 20; // Adjust X position as needed

    // Create a Graphics object for the background of the entire user block
    const userBlockBackground = this.add.graphics();
    userBlockBackground.fillStyle(0xFFFFFF, 1); // Set the background color (white here)
    userBlockBackground.fillRoundedRect(startX, startY, this.cameras.main.width - 40, userBlockHeight, 10); // Rounded rectangle with border radius

    // Set the background's depth to ensure it's rendered behind other elements
    userBlockBackground.setDepth(0);

    // Position the spinButton above the user list block
    const spinButton = this.add.sprite(this.cameras.main.width / 2, startY - 15, 'spinButton'); // Adjust Y position as needed
    spinButton.setScale(0.4);
    spinButton.setOrigin(0.5, 1); // Set origin to bottom center so it aligns to the top of the block
    spinButton.setInteractive();

    // Set button click to spin the wheel
    spinButton.on('pointerdown', () => {
        spinSound.play();
        spinWheel.call(this, wheel, spinSound, collectSound, showToast);
    });

    fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(items => {
                console.log("usersData", items)
                // usersData = users;
               // Add each user to the block
                items.slice(0, 5).forEach((user, index) => {
                    // Create a container for each user
                    const userContainer = this.add.container(startX, startY + index * userRowHeight); // Position userContainer within the user block
                
                    // Add avatar (using dynamically loaded image)
                    const avatar = this.add.image(10, userRowHeight / 2, `avatar5`).setOrigin(0, 0.5).setDisplaySize(42, 42); // Vertically center avatar
                    userContainer.add(avatar);
                
                    // Add name
                    const name = this.add.text(60, userRowHeight / 2 - 10, user.name, { font: '20px Arial', fill: '#7f5539' });
                    userContainer.add(name);
                
                    // Add email as value
                    const value = this.add.text(this.cameras.main.width - 60, userRowHeight / 2 - 10, user.id, { font: '20px Arial', fill: '#7f5539' });
                    userContainer.add(value);
                });

                showStartDialog.call(this, introSound);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    
}




function update() {
    // Update the scene if necessary
}

const config = {
    type: Phaser.AUTO,
    width: Math.min(480, window.innerWidth), // Set max-width to 480
    height: window.innerHeight, // Set height to 100%
    parent: 'game-container',
    scene: { preload, create, update } // Use the functions directly as scene methods
};

const game = new Phaser.Game(config);

function spinWheel(wheel, spinSound, collectSound, showToast) {
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
            collectSound.play();
            const winningSegment = determineWinningSegment(wheel.angle % 360);

            let winIndex = rewardList.findIndex(item => item.val == winningSegment);
            // console.log("Winning Segment: ", winIndex > -1 ? rewardList[winIndex].label : "Thanks");

            // showToast(`${winIndex > -1 ? rewardList[winIndex].label : "Thanks"}`);
            showPopup.call(this, winIndex > -1 ? rewardList[winIndex].label : "Thanks");
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

    const box = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'box');
    box.setOrigin(0.5, 0.5);

    const style = { font: '20px Arial', fill: '#ffffff', align: 'center' };
    const text = this.add.text(this.cameras.main.centerX, box.y - box.displayHeight + 30, `Congratulations!\nYou won ${reward}`, style);
    text.setOrigin(0.5, 0.5);

    const btnClaim = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 50, 'btnClaim');
    btnClaim.setOrigin(0.5, 0.5);
    btnClaim.setInteractive();

    btnClaim.on('pointerdown', () => {
        popupBackground.destroy(); // Remove the popup
        text.destroy();
        box.destroy();
        btnClaim.destroy();
        // Add more logic here if needed, like moving to another scene
    });
}
function showStartDialog(introSound) {
    // Create a semi-transparent black overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.5);
    overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Create a white dialog box
    const dialogBox = this.add.graphics();
    dialogBox.fillStyle(0xFFFFFF, 1);
    dialogBox.fillRoundedRect(50, 200, this.cameras.main.width - 100, 200, 10);

    // Add dialog text
    const dialogText = this.add.text(this.cameras.main.centerX, 250, "LUCKY SPIN", { font: '24px Arial', fill: '#000000' });
    dialogText.setOrigin(0.5, 0.5);

    const dialogDesc = this.add.text(this.cameras.main.centerX, 280, "Click on button to start.", { font: '16px Arial', fill: '#999' });
    dialogDesc.setOrigin(0.5, 0.5);

    // Create a button background
    const startButtonBackground = this.add.graphics();
    const buttonWidth = 100;
    const buttonHeight = 40;
    startButtonBackground.fillStyle(0x007BFF, 1);
    startButtonBackground.fillRoundedRect(this.cameras.main.centerX - buttonWidth / 2, 340, buttonWidth, buttonHeight, 5);

    // Add the start button text
    const startButton = this.add.text(this.cameras.main.centerX, 360, "Start", { font: '20px Arial', fill: '#FFFFFF' });
    startButton.setOrigin(0.5, 0.5);
    startButton.setInteractive();

    // Function to remove all dialog elements
    const closeDialog = () => {
        overlay.destroy();
        dialogBox.destroy();
        dialogText.destroy();
        dialogDesc.destroy();
        startButtonBackground.destroy();
        startButton.destroy();
        introSound.play({ loop: true });
    };

    // Set interactive for overlay to close the dialog when clicked
    overlay.setInteractive().on('pointerdown', closeDialog);

    // Set interactive for button and close dialog on click
    startButton.on('pointerdown', closeDialog);
}
