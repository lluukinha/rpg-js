class RevealingText {
  constructor(config) {
    this.element = config.element;
    this.text = config.text;
    this.speed = config.speed || 50;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list) {
    const next = list.splice(0, 1)[0];
    next.span.classList.add("revealed");

    if (list.length === 0) {
      this.isDone = true;
      return;
    }

    this.timeout = setTimeout(() => {
      this.revealOneCharacter(list);
    }, next.delayAfter);
  }

  warpToDone() {
    clearTimeout(this.timeout);
    this.isDone = true;
    this.element.querySelectorAll("span")
      .forEach(s => { s.classList.add("revealed"); });
  }

  init() {
    const characters = [];
    this.text.split("").forEach(character => {
      const span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span);

      // Add this span to our internal state array
      const delayAfter = character === " " ? 0 : this.speed;
      characters.push({span, delayAfter});
    });

    this.revealOneCharacter(characters);
  }
}
