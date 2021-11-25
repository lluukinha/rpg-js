class ReplacementMenu {
  constructor({ replacements, onComplete }) {
    this.replacements = replacements;
    this.onComplete = onComplete;
  }

  decide() { this.menuSubmit(this.replacements[0]); }

  menuSubmit(replacement) {
    this.keyboardMenu?.end();
    this.onComplete(replacement);
  }

  showMenu(container) {
    const combatants = this.replacements.map(c => ({
      label: c.name,
      description: c.description || "no description",
      handler: () => { this.menuSubmit(c) }
    }));

    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(combatants);
  }

  init(container) {
    if (this.replacements[0].isPlayerControlled) {
      this.showMenu(container);
      return;
    }

    this.decide();
  }
}