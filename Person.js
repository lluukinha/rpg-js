class  Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      up: ['y', -1],
      down: ['y', 1],
      left: ['x', -1],
      right: ['x', 1],
    };
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
      return;
    }

    // More cases for starting to walk will come here
    //
    //
    const canMove = !state.map.isCutscenePlaying
      && this.isPlayerControlled
      && state.arrow;
    // case: we are keyboard ready and have an arrow pressed
    if (canMove) this.startBehavior(state, { type: 'walk', direction: state.arrow });

    this.updateSprite(state);
  }

  startBehavior(state, behavior) {
    // Set character direction to whatever behavior has
    this.direction = behavior.direction;

    if (behavior.type === 'walk') {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior);
        }, 10);
        return;
      }
      // Ready to walk
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      this.updateSprite(state);
    }

    if (behavior.type === 'stand') {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", { whoId: this.id });
        this.isStanding = false;
      }, behavior.time);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    // We finished the walk
    if (this.movingProgressRemaining === 0) {
      utils.emitEvent('PersonWalkingComplete', { whoId: this.id });
    }
  }

  updateSprite() {
    const direction = this.direction ? utils.capitalizeFirstLetter(this.direction) : this.direction;
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(`walk${direction}`);
      return;
    }

    this.sprite.setAnimation(`idle${direction}`);
  }
}