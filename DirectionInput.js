class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyW: 'up',
      KeyS: 'down',
      KeyA: 'left',
      KeyD: 'right',
    };
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener('keydown', ({ code }) => {
      const dir = this.map[code];
      if (dir && this.heldDirections.indexOf(dir) === -1) this.heldDirections.unshift(dir);
    });

    document.addEventListener('keyup', ({ code }) => {
      const dir = this.map[code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) this.heldDirections.splice(index, 1);
    });
  }
}
