export default class Tile {
  constructor(x,y,type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.hpUp = type == 'tree';
    this.enemy = {id: 0};
  }

  get coords() {
    return [this.x, this.y];
  }
  get walkable() {
    return ['path', 'high-box', 'tree', 'spot', 'portal'].includes(this.type);
  }
  get collectHp() {
    this.hpUp = false
  }

  htmlEl(isPlayerHere = false, firstSpawn = false) {
    const el = []
    if (isPlayerHere) el.push(`<div id="player"${ firstSpawn ? ' class="spawn"' : '' }></div>`)

    if (this.walkable || this.type.includes('box')) el.push(`<div class="floor"><div class="walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>`);

    switch (this.type) {
      case 'water':
        el.push('<div class="water"><div class="surface"><div class="walls"><div class="r-wall"></div><div class="l-wall"></div></div></div></div>');
        break;

      case 'portal':
        el.push('<div class="portal"><div id="beacon"></div></div>')
        break;

      case 'spot':
        el.push(`<span class="spot" id="${this.enemy.id}"><i class="fa-solid fa-hand-fist" aria-hidden="true"></i></span>`)
        break;

      case 'tree':
        el.push(`<div class="tree">${ this.hpUp ? '<i class="fa-solid fa-heart-circle-plus" aria-hidden="true"></i>' : '' }<div class="top-tree">${ this.hpUp ? '<i class="fa-solid fa-apple-whole fruit" aria-hidden="true"></i>' : '' }</div><div class="trunk-tree"></div></div>${ (isPlayerHere && this.hpUp) ? '<div class="tent"></div>' : '' }`)
        break;

      case 'high-box':
      case 'box':
        el.push(`<div class="${this.type.replace('-', ' ')}"><div class="walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>`);
        break;
      default:
        break;
    }


    return el.join('')
  }
};
