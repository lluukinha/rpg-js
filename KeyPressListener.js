class KeyPressListener {
  constructor(keyCode, callback) {
    let keySafe = true;

    this.keydownFunction = ({ code }) => {
      if (code === keyCode && keySafe) {
        keySafe = false;
        callback();
      }
    };

    this.keyupFunction = ({ code }) => {
      if (code === keyCode) keySafe = true;
    };

    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}