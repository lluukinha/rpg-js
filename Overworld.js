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

  startMap(map, heroInitialState = null) {
    const mapConfig = window.OverworldMaps[map];
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();

    if (heroInitialState) {
      const { hero } = this.map.gameObjects;
      this.map.removeWall(hero.x, hero.y);
      hero.x = heroInitialState.x;
      hero.y = heroInitialState.y;
      hero.direction = heroInitialState.direction;
      this.map.addWall(hero.x, hero.y);
    }

    this.progress.mapId = mapConfig.id;
    this.progress.startingHeroX = this.map.gameObjects.hero.x;
    this.progress.startingHeroY = this.map.gameObjects.hero.y;
    this.progress.startingHeroDirection = this.map.gameObjects.hero.direction;
  }

  init() {
    // Create a new Progress tracker
    this.progress = new Progress();

    // Potentially load saved data
    let initialHeroState = null;
    const saveFile = this.progress.getSaveFile();
    if (saveFile) {
      this.progress.load();
      initialHeroState = {
        x: this.progress.startingHeroX,
        y: this.progress.startingHeroY,
        direction: this.progress.startingHeroDirection
      };
    }

    // Load the HUD
    this.hud = new Hud();
    this.hud.init(document.querySelector(".game-container"));

    // Start the first map
    this.startMap(this.progress.mapId, initialHeroState); // Kitchen, DemoRoom

    // Create controls
    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // Kick off the game!
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
