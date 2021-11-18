class KeyboardMenu {
  constructor() {
    this.options = []; // Set by updater method
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled ? "disabled" : "";
      const right = option.right ? option.right() : "";
      return (`
        <div class="option">
          <button
            data-button="${index}"
            data-description="${option.description}"
            ${disabledAttr}
          >
            ${option.label}
          </button>
        </div>
        <span class="right">${right}</span>
      `);
    }).join("");

    this.element.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => {
        const chosenOption = this.options[ Number(button.dataset.button) ];
        chosenOption.handler();
      });

      button.addEventListener("mouseenter", () => {
        button.focus();
      });

      button.addEventListener("focus", () => {
        this.prevFocus = button;
        this.descriptionElementText.innerText = button.dataset.description;
      });
    });

    setTimeout(() => {
      this.element.querySelector("button[data-button]:not([disabled])").focus();
    }, 10);
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");

    // Description box element
    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("DescriptionBox");
    this.descriptionElement.innerHTML = (`<p>dsd</p>`);
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  end() {
    this.descriptionElementText.remove();
    this.descriptionElement.remove();
    this.element.remove();

    // Clean up bindings
    this.up.unbind();
    this.down.unbind();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.descriptionElement);
    container.appendChild(this.element);

    this.up = new KeyPressListener("ArrowUp", () => {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const prevButton = Array.from(this.element.querySelectorAll("button[data-button]"))
        .reverse()
        .find(el => el.dataset.button < current && !el.disabled);
      prevButton?.focus();
    });

    this.down = new KeyPressListener("ArrowDown", () => {
      const current = Number(this.prevFocus.getAttribute("data-button"));
      const nextButton = Array.from(this.element.querySelectorAll("button[data-button]"))
        .find(el => el.dataset.button > current && !el.disabled);
      nextButton?.focus();
    });
  }
}