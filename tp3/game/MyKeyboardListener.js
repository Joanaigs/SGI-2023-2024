export class MyKeyboardListener {
    constructor(window) {
        this.window = window;
        this.keys = {};
        this.pressedKey = "";
        this.keyPressCallback = null;

        this.window.addEventListener('keydown', this.keyDownHandler);
        this.window.addEventListener('keyup', this.keyUpHandler);
    }

    keyDownHandler = (event) => {
        this.keys[event.code] = true;

        // Check if the pressed key is alphanumeric
        if (/^[a-zA-Z0-9]$/.test(event.key)) {
            this.pressedKey = event.key.toLowerCase();
            if (this.keyPressCallback) {
                this.keyPressCallback(this.pressedKey);
            }
        }
    };

    keyUpHandler = (event) => {
        this.keys[event.code] = false;
        this.pressedKey = "";
    };

    onKeyPress(callback) {
        this.keyPressCallback = callback;
    }

    removeEventListeners() {
        this.window.removeEventListener('keydown', this.keyDownHandler);
        this.window.removeEventListener('keyup', this.keyUpHandler);
    }
}
