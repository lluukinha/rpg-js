class OverworldEvent {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  get container() {
    return document.querySelector(".game-container");
  }

  stand(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({ map: this.map }, {
      type: 'stand',
      direction: this.event.direction,
      time: this.event.time
    });

    // Set up a handler to complete when correct person is done walking,
    // then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonStandComplete', completeHandler);
        resolve();
      }
    };

    document.addEventListener('PersonStandComplete', completeHandler);
  }

  walk(resolve) {
    const who = this.map.gameObjects[this.event.who];
    who.startBehavior({ map: this.map }, {
      type: 'walk',
      direction: this.event.direction,
      retry: true
    });

    // Set up a handler to complete when correct person is done walking,
    // then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener('PersonWalkingComplete', completeHandler);
        resolve();
      }
    };

    document.addEventListener('PersonWalkingComplete', completeHandler);
  }

  textMessage(resolve) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    });
    message.init(this.container);
  }

  changeMap(resolve) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(this.container, () => {
      this.map.overworld.startMap(this.event.map);
      resolve();
      sceneTransition.fadeOut();
    });
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: (didWin) => {
        const flag = didWin ? "WON_BATTLE" : "LOST_BATTLE";
        resolve(flag);
      }
    });
    battle.init(this.container);
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(this.container);
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    });
  }
}
