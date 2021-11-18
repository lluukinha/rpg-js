window.BattleAnimations = {
  async spin(event, onComplete) {
    const element = event.caster.pizzaElement;
    const animationClassName = event.caster.team === "player"
      ? "battle-spin-right"
      : "battle-spin-left";
    element.classList.add(animationClassName);

    // Remove class when animation is fully complete
    element.addEventListener("animationend", () => {
      element.classList.remove(animationClassName);
    }, { once: true });

    // Continue battle cycle right around when the pizzas collide
    await utils.wait(100);
    onComplete();
  },

  async glob(event, onComplete) {
    const { caster } = event;
    const div = document.createElement("div");
    div.classList.add("glob-orb");
    const orbClass = caster.team === "player" ? "battle-glob-right" : "battle-glob-left";
    div.classList.add(orbClass);

    div.innerHTML = (`
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${event.color}" />
      </svg>
    `);

    // Remove class when animation is fully complete
    div.addEventListener("animationend", () => {
      div.remove();
    });

    document.querySelector(".Battle").appendChild(div);

    await utils.wait(820);
    onComplete();
  }
};
