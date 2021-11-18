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
      status: null
    };
    const player1 = new Combatant(player1config, this);

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

    this.combatants = { player1, enemy1, enemy2 };
    this.activeCombatants = {
      player: "player1",
      enemy: "enemy2"
    };
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

    Object.keys(this.combatants).forEach(key => {
      const combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });

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
