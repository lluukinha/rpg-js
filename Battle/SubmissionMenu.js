class SubmissionMenu {
  constructor({ caster, enemy, onComplete, items }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
    this.items = this.createQuantityMap(items);
    console.log(this.items);
  }

  createQuantityMap(items) {
    const quantityMap = {};
    items.forEach(item => {
      const { team, actionId, instanceId } = item;
      if (team !== this.caster.team) return;

      const existing = quantityMap[actionId];
      if (existing) existing.quantity += 1;
      if (!existing) quantityMap[actionId] = { actionId, quantity: 1, instanceId };
    });

    return Object.values(quantityMap);
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
            description: action.description || 'no description',
            handler: () => { this.menuSubmit(action); }
          };
        }),
        backOption
      ],
      items: [
        ...this.items.map(item => {
          const action = Actions[item.actionId];
          return {
            label: action.name,
            description: action.description || 'no description',
            right: () => `x${item.quantity}`,
            handler: () => { this.menuSubmit(action, item.instanceId); }
          };
        }),
        backOption
      ]
    }
  }

  menuSubmit(action, instanceId = null) {
    this.keyboardMenu?.end();
    const target = action.targetType === "friendly"
      ? this.caster
      : this.enemy;
    this.onComplete({ action, target, instanceId });
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