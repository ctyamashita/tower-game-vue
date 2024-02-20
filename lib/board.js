import { createApp } from 'vue'

// Rand method
const rand = (size) => {
  return Math.floor(Math.random() * size);
}

// Sample method
Array.prototype.sample = function(size) {
  return size > 1 ? this.shuffle().slice(0, size) : this[rand(this.length)]
}

// Shuffle method
Array.prototype.shuffle = function() {
  let randomIndex;

  for (let currentIndex = 0; currentIndex < this.length; currentIndex++) {
    randomIndex = rand(currentIndex);
    [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
  }

  return this;
}

// Vue app

createApp({
  data() {
    const tileTypes = {
      'path': {type: 'path', walkable: true},
      'box': {type: 'box', walkable: false},
      'high-box': {type: 'high box', walkable: true},
      'water': {type: 'water', walkable: false},
      'spot': {type: 'spot', walkable: true},
      'tree': {type: 'tree', walkable: true},
    };

    const tileConfig = {
      'spot': 5,
      'water': 10,
      'box': 5,
      'high-box': 5,
      'tree': 5,
    }

    const boardDefault = {
      width: 7,
      height: 7
    }

    const defaultTiles = {}
    for (let y = 1; y <= boardDefault.height; y++) {
      for (let x = 1; x <= boardDefault.width; x++) {
        defaultTiles[`${x}-${y}`] = tileTypes.path
      }
    }

    const mode = localStorage.getItem("isoView") == 'true';

    this.tileTypes = tileTypes;
    this.tileConfig = tileConfig;

    return {
      screen: { width: 100, height: 100 },
      board: { ...boardDefault, isoView: mode },
      player: { position: { x: 1, y: 1 } },
      tiles: { ...defaultTiles },
      movementKeys: {
        w: {x:0, y:-1},
        a: {x:-1, y:0},
        s: {x:0, y:1},
        d: {x:1, y:0}
      }
    }
  },
  mounted() {
    window.onload = () => {
      this.resizeHandler();
      this.fetchEnemies();
    }
    window.addEventListener('resize', this.resizeHandler);
    document.addEventListener('keyup', this.keyUpHandler);
    document.addEventListener('keydown', this.keyDownHandler);
    document.addEventListener('click', this.clickHandler);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('keydown', this.keyDownHandler);
    document.removeEventListener('click', this.clickHandler);
  },
  methods: {
    resizeHandler() {
      this.screen.width = document.documentElement.clientWidth;
      this.screen.height = document.documentElement.clientHeight;

      const isLandscape = this.screen.height < this.screen.width;
      const tiles = document.querySelectorAll('#board td');

      tiles.forEach(tile=>{
        const tileSize = isLandscape ? `${Math.round(60/this.board.height)}vh` : `${Math.round(60/this.board.width)}vw`;
        tile.style.width = tile.style.height = tileSize
      });
    },
    keyUpHandler(e) {
      const modalOpened = document.querySelector('.modal.expand');
      if (modalOpened) return;
      const keyPressed = e.key;

      if (Object.keys(this.movementKeys).includes(keyPressed)) this.move(keyPressed);
      if (keyPressed == 'e') {
        this.board.isoView = !this.board.isoView;
        localStorage.setItem("isoView", this.board.isoView)
      }
      try {
        document.querySelector(`#${keyPressed}-key`).classList.remove('pressed');
      } catch (error) {
      }

      const playerPosition = this.stringifyCoords(this.player.position);
      if (this.spots.includes(playerPosition)) {
        const tile = document.getElementById(playerPosition);
        const spot = tile.children[2]
        if (keyPressed == 'Enter' && this.modalExpanded) spot.click();
        this.modalExpanded = true;
      }
    },
    keyDownHandler(e) {
      const modalOpened = document.querySelector('.modal.expand');
      this.modalExpanded = !modalOpened;
      if (modalOpened) return;
      const keyPressed = e.key;
      try {
        document.querySelector(`#${keyPressed}-key`).classList.add('pressed');
      } catch (error) {
      }
    },
    clickHandler(e) {
      if (!e.target && (!(e.target.tagName == "I") || !(e.target.tagName == "BUTTON"))) return

      let btn
      if (e.target.tagName == "I") btn = e.target.parentElement;
      if (e.target.tagName == "BUTTON") btn = e.target;

      if (btn && btn.classList.contains('spot')) {
        const coords = btn.parentElement.id;
        if (!this.isPlayer(this.parseCoords(coords))) this.player.position = this.parseCoords(coords);
        document.querySelector('.modal').innerHTML = this.generateModal(this.tiles[coords].enemy);
        document.querySelector('.modal').classList.add('expand');
      } else if (btn && btn.classList.contains('btn-close-white')) {
        document.querySelector('.modal').classList.remove('expand');
        document.querySelector('.modal').innerHTML = '';
      }
    },
    move(keyPressed) {
      const [x, y] = Object.values(this.player.position);

      if (this.movementKeys[keyPressed]) {
        const newPosition = {
          x: x + this.movementKeys[keyPressed].x,
          y: y + this.movementKeys[keyPressed].y
        }
        if (this.isWalkable(newPosition)) this.player.position = newPosition
      }
    },
    isPlayer(coords) { return this.player.position.x == coords.x && this.player.position.y == coords.y },
    isSpot(coords) { return this.tiles[this.stringifyCoords(coords)].type == 'spot'},
    isWalkable(coords) { return this.tiles[this.stringifyCoords(coords)]?.walkable },
    stringifyCoords(coords) { return Object.values(coords).join('-') },
    parseCoords(string) {
      const [x,y] = string.split('-');
      return { x: Number(x), y: Number(y) }
    },
    tileContent(coords) {
      let tile = this.tiles[this.stringifyCoords(coords)];
      const content = []
      if (this.isPlayer(coords)) content.push(`<div id="player"></div>`);
      if (this.isWalkable(coords) || tile.type == 'box' || tile.type == 'high-box') content.push('<div class="floor"><div class="floor-walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>');
      if (tile.type !== 'path' && tile.type !== 'spot') content.push(`<div class="${this.tiles[this.stringifyCoords(coords)].type}">`);
      if (tile.type == 'spot') content.push(`<button class="${this.tiles[this.stringifyCoords(coords)].type}" id="${this.tiles[this.stringifyCoords(coords)].project?.id}"><i class="fas ${this.tiles[this.stringifyCoords(coords)].project?.icon}"></i></button>`)
      if (tile.type == 'box' || tile.type == 'high box') content.push(`<div class="box-walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      if (tile.type == 'water') content.push(`<div class="surface"><div class="water-walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      if (tile.type == 'tree') content.push('<div class="top-tree"></div><div class="trunk-tree"></div>')
      content.push(`</div>`);
      if (this.isPlayer(coords) && tile.type == 'spot') content.push(`<div class='tent'></div>`);
      return content.join('')
    },
    fetchEnemies() {
      try {
        fetch('../data/enemies.json')
          .then(response => response.json())
          .then((json) => {
            this.enemies = json
            this.generateTiles();
            this.addEnemies(json);
            this.spawnPlayer();
            this.mapSpots();
          });
      } catch (error) {
        console.log(error);
      }
    },
    generateTiles() {
      this.tiles = {};
      let tilesArray = [];

      // adding specific blocks from config
      Object.keys(this.tileConfig).forEach(type=>{
        for (let countType = 0; countType < this.tileConfig[type]; countType++) { tilesArray.push(type) };
      });

      // filling empty spaces with path blocks
      const pathTilesCount = (this.board.width * this.board.height) - tilesArray.length;
      for (let count = 0; count < pathTilesCount; count++) { tilesArray.push('path') }

      // randomizing order
      tilesArray = tilesArray.shuffle();

      // updating tiles
      for (let y = 1; y <= this.board.height; y++) {
        for (let x = 1; x <= this.board.width; x++) {
          this.tiles[`${x}-${y}`] = {...this.tileTypes[tilesArray.pop()]};
        }
      }
    },
    spawnPlayer() {
      // possible spawn points
      const walkableTiles = []
      for (const [key, value] of Object.entries(this.tiles)) {
        if (value.walkable && value) walkableTiles.push(key);
      }

      this.player.position = this.parseCoords(walkableTiles.sample());
    },
    addEnemies(enemies) {
      const spots = Object.values(this.tiles).filter(tile => tile.type == 'spot');
      enemies.forEach((enemy, index) => {
        if (spots[index]) spots[index].enemy = enemy
      })
    },
    generateModal(props) {
      return `<div class="modal-content-cty">
        <p>${props.className}</p>
      </div>`
    },
    mapSpots() {
      this.spots = Object.keys(this.tiles).filter(position => this.tiles[position].type == 'spot');
    }
  }
}).mount('#app')
