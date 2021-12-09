class Hud {
  constructor() {
    this.scoreBoards = [];
  }

  update() {
    this.scoreBoards.forEach(scoreBoard => {
      const pizza = window.playerState.pizzas[scoreBoard.id];
      scoreBoard.update(pizza);
    });
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Hud");

    const { playerState } = window;
    playerState.lineup.forEach(key => {
      const pizza = playerState.pizzas[key];
      const scoreBoard = new Combatant({
        id: key,
        ...Pizzas[pizza.pizzaId],
        ...pizza
      }, null);

      scoreBoard.createElement();
      this.scoreBoards.push(scoreBoard);
      this.element.appendChild(scoreBoard.hudElement);
    });

    this.update();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    document.addEventListener("PlayerStateUpdated", () => { this.update(); });
  }
}