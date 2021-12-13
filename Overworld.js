class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish the camera person
      const cameraPerson = this.map.gameObjects.hero;

      // Update all Game Objects
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw Lower layer
      this.map.drawLowerImage(this.ctx, cameraPerson);

      // Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => a.y - b.y)
        .forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson);
      });

      // Draw Lower layer
      this.map.drawUpperImage(this.ctx, cameraPerson);

      if (this.map.isPaused) return;

      requestAnimationFrame(() => { step(); });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there a person here to talk to?
      this.map.checkForActionCutscene();
    });

    new KeyPressListener("Escape", () => {
      if (this.map.isCutscenePlaying) return;
      this.map.startCutscene([{ type: "pause" }]);
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        // Hero's position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(window.OverworldMaps[mapConfig]);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.hud = new Hud();
    this.hud.init(document.querySelector(".game-container"));

    this.startMap("DemoRoom"); // Kitchen, DemoRoom

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { who: 'hero', type: 'walk', direction: 'down' },
    //   { who: 'hero', type: 'walk', direction: 'down' },
    //   { who: 'npcA', type: 'walk', direction: 'left' },
    //   { who: 'npcA', type: 'walk', direction: 'left' },
    //   { who: 'npcA', type: 'stand', direction: 'up', time: 800 },
    //   { type: "textMessage", text: "Hello there!!"}
    // ]);
  }
}
