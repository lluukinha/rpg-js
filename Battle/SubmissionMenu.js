class SubmissionMenu {
  constructor({ caster, enemy, onComplete }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  getPages() {
    const backOption = {
      label: "Go Back",
      description: "Return to previous page",
      handler: () => {
        this.keyboardMenu.setOptions(this.getPages().root);
      }
    };

    return {
      root: [
        {
          label: "Attack",
          description: "Choose an attack",
          handler: () => {
            // Do something when chosen...
            this.keyboardMenu.setOptions(this.getPages().attacks);
          }
        },
        {
          label: "Items",
          description: "Choose an item",
          // disabled: true,
          handler: () => {
            // Go to items page...
            this.keyboardMenu.setOptions(this.getPages().items);
          }
        },
        {
          label: "Swap",
          description: "Change to another pizza",
          handler: () => {
            // See pizza options
          }
        }
      ],
      attacks: [
        ...this.caster.actions.map(key => {
          const action = Actions[key];
          return {
            label: action.name,
            description: action.description,
            handler: () => { this.menuSubmit(action); }
          };
        }),
        backOption
      ],
      items: [ backOption ]
    }
  }

  menuSubmit(action, instanceId = null) {
    this.keyboardMenu?.end();
    const target = action.targetType === "friendly"
      ? this.caster
      : this.enemy;
    this.onComplete({ action, target });
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages().root);
  }

  init(container) {

    if (this.caster.isPlayerControlled) {
      // Show some UI
      this.showMenu(container);
      return;
    }

    // Decide automatically
    this.menuSubmit(Actions[this.caster.actions[0]]);
  }
}