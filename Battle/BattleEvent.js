class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  textMessage(resolve) {
    const text = this.event.text
      .replace("{CASTER}", this.event.caster?.name)
      .replace("{TARGET}", this.event.target?.name)
      .replace("{ACTION}", this.event.action?.name);

    const message = new TextMessage({
      text,
      onComplete: () => { resolve(); },
    });
    message.init(this.battle.element);
  }

  async stateChange(resolve) {
    const { caster, target, damage, recover, status, action } = this.event;
    const who = this.event.onCaster ? caster : target;

    if (damage) {
      // Modify the target to have less HP
      target.update({ hp: target.hp - damage });
      // start blinking
      target.pizzaElement.classList.add("battle-damage-blink");
    }

    if (recover) {
      let newHp = who.hp + recover;
      if (newHp > who.maxHp) newHp = who.maxHp;
      who.update({ hp: newHp });
    }

    if (status) who.update({ status: { ...status } });
    if (status === null) who.update({ status: null });

    // Wait a little bit
    await utils.wait(600);

    // stop blinking
    target.pizzaElement.classList.remove("battle-damage-blink");

    resolve();
  }

  submissionMenu(resolve) {
    const { caster, enemy } = this.event;
    const replacements = Object.values(this.battle.combatants)
      .filter(c => c.id !== caster.id && c.team === caster.team && c.hp > 0);

    const menu = new SubmissionMenu({
      caster, enemy, replacements,
      items: this.battle.items,
      onComplete: submission => { resolve(submission); }
    });
    menu.init(this.battle.element);
  }

  replacementMenu(resolve) {
    const replacements = Object.values(this.battle.combatants)
      .filter(c => c.team === this.event.team && c.hp > 0);
    const menu = new ReplacementMenu({
      replacements,
      onComplete: replacement => { resolve(replacement); }
    });

    menu.init(this.battle.element);

  }

  async replace(resolve) {
    const { replacement } = this.event;

    // Clear out old combatant
    const combatantName = this.battle.activeCombatants[replacement.team];
    this.battle.activeCombatants[replacement.team] = null;
    const prevCombatant = this.battle.combatants[combatantName];
    prevCombatant.update();
    await utils.wait(400);

    // In with the new!
    this.battle.activeCombatants[replacement.team] = replacement.id;
    replacement.update();
    await utils.wait(400);

    resolve();
  }

  animation(resolve) {
    const fn = BattleAnimations[this.event.animation];
    fn(this.event, resolve);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}