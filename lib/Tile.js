export default class Tile {
  constructor(x,y,type, height = '') {
    this.coords = [x, y];
    this.type = type;
    if (type == 'tree') this.hpUp = true;
    if (type == 'spot') this.enemy = {id: 0};
    this.walkable = ['path', 'high-box', 'tree', 'spot', 'portal'].includes(this.type)
    this.closeToWater = false
    this.height = height
  }

  htmlEl(isPlayerHere = false, firstSpawn = false, playerJob) {
    const el = []
    if (isPlayerHere) el.push(`<div id="player"${ firstSpawn ? ' class="spawn"' : '' } style="background-image: url(images/${playerJob}-player.png)"></div>`)

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
        el.push('<div class="tree">')
        if (this.hpUp) el.push('<i class="fa-solid fa-heart-circle-plus" aria-hidden="true"></i>')
        el.push('<div class="top-tree">')
        if (this.hpUp) el.push('<i class="fa-solid fa-apple-whole fruit" aria-hidden="true"></i>')
        el.push('</div><div class="trunk-tree"></div></div>')
        if (isPlayerHere && this.hpUp) el.push('<div class="tent"></div>')
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
