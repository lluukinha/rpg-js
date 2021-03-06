class PlayerState {
  constructor() {
    this.pizzas = {
      p1: {
        pizzaId: "s001",
        hp: 50,
        maxHp: 50,
        xp: 0,
        maxXp: 100,
        level: 1,
        status: null, // { type: "saucy" },
      },
      // p2: {
      //   pizzaId: "v001",
      //   hp: 50,
      //   maxHp: 50,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      // },
      // p3: {
      //   pizzaId: "f001",
      //   hp: 50,
      //   maxHp: 50,
      //   xp: 75,
      //   maxXp: 100,
      //   level: 1,
      //   status: null,
      // },
    };

    this.lineup = ["p1"];
    this.items = [
      { actionId: "item_recoverStatus", instanceId: "item1" },
      { actionId: "item_recoverHp", instanceId: "item2" },
      { actionId: "item_recoverHp", instanceId: "item3" },
    ];
    this.storyFlags = {
      // "DID_SOMETHING": true
    };
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent("LineupChanged");
  }

  /*
  // Old code (move to top directly)0
  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter(id => id !== futureFrontId);
    this.lineup.unshift(futureFrontId);
    utils.emitEvent("LineupChanged");
  }
  */

  moveToFront(id) {
    const index = this.lineup.indexOf(id);
    if (index === 0) return;

    const newIndex = index - 1;
    this.lineup.splice(index, 1);
    this.lineup.splice(newIndex, 0, id);

    utils.emitEvent("LineupChanged");
  }

  addPizza(pizzaId) {
    const newId = `p${Date.now()}${Math.floor(Math.random() * 99999)}`;
    this.pizzas[newId] = {
      pizzaId,
      hp: 50,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: null,
    };

    if (this.lineup.length < 3) this.lineup.push(newId);
    utils.emitEvent("LineupChanged");
  }
}

window.playerState = new PlayerState();
