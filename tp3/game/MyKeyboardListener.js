/**
 * MyKeyboardListener
 */
export class MyKeyboardListener {
    /**
     * the constructor of the class
     * @param {*} window 
     */
    constructor(window) {
        this.window = window;
        this.keys = {};
        this.pressedKey = "";
        this.keyPressCallback = null;

        this.window.addEventListener('keydown', this.keyDownHandler);
        this.window.addEventListener('keyup', this.keyUpHandler);
    }

    /**
     * The function called when a key is pressed
     * @param {*} event 
     */
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

    /**
     * The function called when a key is released
     * @param {*} event 
     */
    keyUpHandler = (event) => {
        this.keys[event.code] = false;
        this.pressedKey = "";
    };

    /**
     * The function that checks if a key is pressed
     * @param {*} callback 
     */
    onKeyPress(callback) {
        this.keyPressCallback = callback;
    }

    /**
     * The function that checks if a key is pressed
     */
    removeEventListeners() {
        this.window.removeEventListener('keydown', this.keyDownHandler);
        this.window.removeEventListener('keyup', this.keyUpHandler);
    }
}
