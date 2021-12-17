class PizzaStone extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "/images/characters/pizza-stone.png",
      animations: {
        usedDown: [ [0,0] ],
        unusedDown: [ [1,0] ],
      },
      currentAnimation: "usedDown"
    });

    this.storyFlag = config.storyFlag;
    this.pizzas = config.pizzas;

    this.talking = [
      {
        required: [this.storyFlag],
        events: [{ type: "textMessage", text: "You have already used this." }]
      },
      {
        events: [
          { type: "textMessage", text: "Approaching the legendary pizza stone." },
          { type: "craftingMenu", pizzas: this.pizzas },
          { type: "addStoryFlag", flag: this.storyFlag },
        ],
      },
    ];
  }

  update() {
    const flag = playerState.storyFlags[this.storyFlag] ? "usedDown" : "unusedDown";
    this.sprite.currentAnimation = flag;
  }
}