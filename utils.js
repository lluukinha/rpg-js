const utils = {
  withGrid(n) { return n * 16; },
  capitalizeFirstLetter(s) { return s.charAt(0).toUpperCase() + s.slice(1); },
  asGridCoord(x, y) { return `${x*16},${y*16}`; },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;

    if (direction === "up") y -= size;
    if (direction === "down") y += size;
    if (direction === "left") x -= size;
    if (direction === "right") x += size;

    return {x, y};
  },
  oppositeDirection(heroDirection) {
    if (heroDirection === "left") return "right";
    if (heroDirection === "right") return "left";
    if (heroDirection === "up") return "down";
    if (heroDirection === "down") return "up";
    return "";
  }
};
