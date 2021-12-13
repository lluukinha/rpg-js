class PauseMenu {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {
    // Case 1: Show the first page of options
    if (pageKey === "root") return this.getRootOptions();

    // Case 2: Show the options for just one pizza (id)
    const unequipped = Object.keys(playerState.pizzas)
      .filter(id => playerState.lineup.indexOf(id) === -1)
      .map(id => {
        const { pizzaId } = playerState.pizzas[id];
        const base = window.Pizzas[pizzaId];
        return {
          label: `Swap for ${base.name}`,
          description: base.description,
          handler: () => {
            playerState.swapLineup(pageKey, id);
            this.keyboardMenu.setOptions(this.getRootOptions());
          }
        };
      });

    return [
      // Swap for any unequipped pizza...
      ...unequipped,
      {
        label: "Move to front",
        description: "Move this pizza to the front of the list",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions(this.getRootOptions());
        },
      },
      {
        label: "Back",
        description: "Back to root menu",
        handler: () => { this.keyboardMenu.setOptions(this.getRootOptions()) }
      }
    ];
  }

  getRootOptions() {
    const lineupPizzas = playerState.lineup.map(id => {
      const { pizzaId } = playerState.pizzas[id];
      const base = window.Pizzas[pizzaId];
      return {
        label: base.name,
        description: base.description,
        handler: () => { this.keyboardMenu.setOptions(this.getOptions(id)) }
      };
    });

    return [
      ...lineupPizzas,
      {
        label: "Save",
        description: "Save your progress",
        handler: () => { /* We will come back to finish this */ }
      },
      {
        label: "Close",
        description: "Close menu",
        handler: () => { this.close() }
      }
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("PauseMenu");
    this.element.innerHTML = (`<h2>Pause Menu</h2>`);
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();

    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => { this.close(); });
  }
}