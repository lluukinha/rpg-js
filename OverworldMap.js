class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
    this.isPaused = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    const camera = {
      x: utils.withGrid(10.5) - cameraPerson.x,
      y: utils.withGrid(6) - cameraPerson.y,
    };
    ctx.drawImage(this.lowerImage, camera.x, camera.y);
  }

  drawUpperImage(ctx, cameraPerson) {
    const camera = {
      x: utils.withGrid(10.5) - cameraPerson.x,
      y: utils.withGrid(6) - cameraPerson.y,
    };
    ctx.drawImage(this.upperImage, camera.x, camera.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {

      const object = this.gameObjects[key];
      object.id = key;

      // TODO: verify if this object should actually mount
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // start a loop of async events
    // await each one
    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      const result = await eventHandler.init();

      if (result === "LOST_BATTLE") break;
    }

    this.isCutscenePlaying = false;

    // Make other objects to continue idle behavior
    Object.values(this.gameObjects)
      .forEach(object => object.doBehaviorEvent(this));
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects)
      .find(object => `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`);

    if (!this.isCutscenePlaying && match && match.talking.length) {
      const relevantScenario = match.talking.find(scenario => {
        const requiredScenarios = scenario.required || [];
        return requiredScenarios.every(storyFlag => playerState.storyFlags[storyFlag]);
      });

      relevantScenario && this.startCutscene(relevantScenario.events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) this.startCutscene(match[0].events);
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: '/images/maps/DemoLower.png',
    upperSrc: '/images/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6)
      }),
      npcA: new Person({
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: '/images/characters/people/npc1.png',
        behaviorLoop: [
          { type: 'stand', direction: 'left', time: 800 },
          { type: 'stand', direction: 'up', time: 800 },
          { type: 'stand', direction: 'right', time: 1200 },
          { type: 'stand', direction: 'up', time: 800 },
        ],
        talking: [
          {
            required: ["DEFEATED_BETH"],
            events: [
              { type: "textMessage", text: "What do you want?", faceHero: "npcA" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "I'm going to crush you!", faceHero: "npcA" },
              { type: "battle", enemyId: "beth" },
              { type: "addStoryFlag", flag: "DEFEATED_BETH" },
              { type: "textMessage", text: "Go away! You crushed me like weak pepper." },
              { type: "walk", who: "hero", direction: "left" }
            ]
          }
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8),
        y: utils.withGrid(5),
        src: '/images/characters/people/erio.png',
        talking: [
          {
            required: ["DEFEATED_BETH"],
            events: [
              { type: "textMessage", text: "Beth was weak", faceHero: "npcB" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
              // { type: "addStoryFlag", flag: "TALKED_TO_ERIO" },
              { type: "battle", enemyId: "erio" },
            ]
          }
        ],
      }),
      pizzaStone: new PizzaStone({
        x: utils.withGrid(2),
        y: utils.withGrid(7),
        storyFlag: "USED_PIZZA_STONE",
        pizzas: [ "v001", "f001", "s002" ],
      }),
    },
    walls: {
      [utils.asGridCoord(7,6)]: true,
      [utils.asGridCoord(8,6)]: true,
      [utils.asGridCoord(7,7)]: true,
      [utils.asGridCoord(8,7)]: true
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            { type: "walk", who: "npcB", direction: "left" },
            { type: "stand", who: "npcB", direction: "up" , time: 500 },
            { type: "textMessage", text: "You can't be in there!" },
            { type: "walk", who: "npcB", direction: "right" },
            { type: "stand", who: "npcB", direction: "down" , time: 500 },

            { type: "walk", who: "hero", direction: "down" },
            { type: "walk", who: "hero", direction: "left" },
          ]
        }
      ],
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { type: "changeMap", map: "Kitchen" }
          ]
        }
      ]
    }
  },
  Kitchen: {
    lowerSrc: '/images/maps/KitchenLower.png',
    upperSrc: '/images/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(9)
      }),
      npcA: new Person({
        x: utils.withGrid(9),
        y: utils.withGrid(5),
        src: '/images/characters/people/npc2.png'
      }),
      npcB: new Person({
        x: utils.withGrid(10),
        y: utils.withGrid(8),
        src: '/images/characters/people/npc3.png',
        talking: [
          {
            events: [
              { type: "textMessage", text: "You made it!", faceHero: "npcB" }
            ]
          }
        ]
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { type: "changeMap", map: "DemoRoom" },
          ]
        }
      ]
    }
  },
}