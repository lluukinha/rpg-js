class Battle {
  constructor() {
    const player1config = {
      ...Pizzas.s001,
      team: 'player',
      hp: 40,
      maxHp: 50,
      xp: 0,
      maxXp: 100,
      level: 1,
      status: /* null, */ { type: "saucy" },
      isPlayerControlled: true,
    };
    const player1 = new Combatant(player1config, this);

    const player2config = {
      ...Pizzas.s002,
      team: 'player',
      hp: 60,
      maxHp: 60,
      xp: 75,
      maxXp: 100,
      level: 1,
      status: null,
      isPlayerControlled: true,
    };
    const player2 = new Combatant(player2config, this);

    const enemy1config = {
      ...Pizzas.v001,
      team: 'enemy',
      hp: 50,
      maxHp: 50,
      xp: 20,
      maxXp: 100,
      level: 1,
      status: null
    };
    const enemy1 = new Combatant(enemy1config, this);

    const enemy2config = {
      ...Pizzas.f001,
      team: 'enemy',
      hp: 50,
      maxHp: 50,
      xp: 30,
      maxXp: 100,
      level: 1,
      status: null
    };
    const enemy2 = new Combatant(enemy2config, this);

    this.combatants = { player1, player2, enemy1, enemy2 };
    this.activeCombatants = {
      player: "player1",
      enemy: "enemy2"
    };

    this.items = [
      { actionId: "item_recoverStatus", instanceId: "p1", team: "player" },
      { actionId: "item_recoverStatus", instanceId: "p2", team: "player" },
      { actionId: "item_recoverStatus", instanceId: "p3", team: "enemy" },
      { actionId: "item_recoverHp", instanceId: "p4", team: "player" },
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${'/images/characters/people/npc3.png'}" alt="Enemy" />
      </div>
    `);

  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Bully");

    Object.keys(this.combatants).forEach(key => {
      const combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      // Add to correct team
      if (combatant.team === "player") this.playerTeam.combatants.push(combatant);
      if (combatant.team === "enemy") this.enemyTeam.combatants.push(combatant);
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      }
    });

    this.turnCycle.init();
  }
}
