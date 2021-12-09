class Battle {
  constructor({ enemy, onComplete }) {

    this.enemy = enemy;
    this.onComplete = onComplete;

    this.activeCombatants = { player: null, enemy: null };
    this.combatants = {};

    // Dynamically add the Player team
    window.playerState.lineup.forEach(id => {
      this.addCombatant(id, "player", window.playerState.pizzas[id]);
    });

    // Now the enemy team
    Object.keys(this.enemy.pizzas).forEach(key => {
      this.addCombatant(`e_${key}`, 'enemy', this.enemy.pizzas[key]);
    });

    // Start empty
    this.items = [];

    // Add in player items
    window.playerState.items.forEach(item => {
      this.items.push({ ...item, team: 'player' });
    });

    this.usedInstanceIds = {};
  }

  addCombatant(id, team, config) {
    this.combatants[id] = new Combatant({
      ...Pizzas[config.pizzaId],
      ...config,
      team,
      isPlayerControlled: team === "player"
    }, this);

    // Populate first active pizza
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
      <div class="Battle_hero">
        <img src="${'/images/characters/people/hero.png'}" alt="Hero" />
      </div>
      <div class="Battle_enemy">
        <img src="${this.enemy.src}" alt="${this.enemy.name}" />
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
      },
      onWinner: winner => {
        const { playerState } = window;
        if (winner === "player") {
          Object.keys(playerState.pizzas).forEach(id => {
            const playerStatePizza = playerState.pizzas[id];
            const combatant = this.combatants[id];
            if (combatant) {
              playerStatePizza.hp = combatant.hp;
              playerStatePizza.xp = combatant.xp;
              playerStatePizza.maxXp = combatant.maxXp;
              playerStatePizza.level = combatant.level;
            }
          });

          // Get  rid of player used items
          playerState.items = playerState.items
            .filter(item => !this.usedInstanceIds[item.instanceId]);

          // Send signal to update hud
          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete();
      }
    });

    this.turnCycle.init();
  }
}
