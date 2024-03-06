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
      'tree': {type: 'tree', walkable: true, hpUp: true},
      // 'piramid': {type: 'piramid', walkable: false},
      'portal': {type: 'portal', walkable: true}
    };

    const tileConfig = {
      'spot': 5,
      'water': 7,
      'box': 3,
      'high-box': 5,
      'tree': 5,
      'portal': 1
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
      time: {
        light: '',
        movementCount: 0,
        dayMoves: 12,
      },
      turnCount: 0,
      floor: 1,
      player: {
        position: { x: 1, y: 1 },
        job: "warrior",
        lvl: 1,
        xp: 0,
        points: 0,
        hp: 9,
        max_hp: 9,
        isDead: false,
        attributes: {
          atk: 3,
          def: 3,
          agi: 3,
          dex: 3,
          mag: 3,
          luk: 3
        },
        actions: [
          "attack",
          "charged attack"
        ]
      },
      enemy: {
        job: "warrior",
        hp: 9,
        max_hp: 9,
        isDead: false,
        attributes: {
          atk: 3,
          def: 3,
          agi: 3,
          dex: 3,
          mag: 3,
          luk: 3
        }
      },
      tiles: { ...defaultTiles },
      movementKeys: {
        w: {x:0, y:-1},
        a: {x:-1, y:0},
        s: {x:0, y:1},
        d: {x:1, y:0}
      },
      disabledKeys: true
    }
  },
  mounted() {
    window.onload = () => {
      this.resizeHandler();
      this.renderBoard();
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
      if (modalOpened || this.disabledKeys) return;
      const keyPressed = e.key;

      delete this.player.spawnPoint;

      if (Object.keys(this.movementKeys).includes(keyPressed)) {
        this.move(keyPressed);
        this.time.movementCount++
        if (this.time.movementCount % this.time.dayMoves == 0) {
          this.time.light = 'night'
        } else if (this.time.movementCount % (this.time.dayMoves * .75) == 0) {
          this.time.light = 'sunset'
        } else if (this.time.movementCount % (this.time.dayMoves * .5) == 0) {
          this.time.light = ''
        } else if (this.time.movementCount % (this.time.dayMoves * .25) == 0) {
          this.time.light = 'sunrise'
        }
      }
      if (keyPressed == 'e') {
        this.board.isoView = !this.board.isoView;
        localStorage.setItem("isoView", this.board.isoView)
      }
      try {
        document.querySelector(`#${keyPressed}-key`).classList.remove('pressed');
      } catch (error) {
      }

      const playerPosition = this.stringifyCoords(this.player.position);
      if (this.spots?.includes(playerPosition)) {
        const tile = document.getElementById(playerPosition);
        const spot = tile.children[2]
        if ((keyPressed == 'Enter' || keyPressed == ' ') && this.modalExpanded) spot.click();
        this.modalExpanded = true;
      }

      const currentTile = this.tiles[playerPosition];
      if (currentTile.type == 'tree') {
        setTimeout(() => {
          if (currentTile.hpUp && this.player.hp + 1 <= this.player.max_hp) this.player.hp += 1;
          currentTile.hpUp = false;
        }, 1000);
      } else if (currentTile.type == "portal") {
        this.disabledKeys = true;
        setTimeout(() => {
          this.renderBoard();
          this.floor++
        }, 4500);
      }
    },
    keyDownHandler(e) {
      if (this.disabledKeys) return;
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
        if (this.tiles[coords].enemy) this.enemy = this.tiles[coords].enemy;
        document.querySelector('.modal').classList.add('expand');
        this.inBattle = true;
      } else if (btn && btn.classList.contains('btn-close-white')) {
        document.querySelector('.modal').classList.remove('expand');
      }
    },
    move(keyPressed) {
      const [x, y] = Object.values(this.player.position);

      if (this.movementKeys[keyPressed]) {
        const newPosition = {
          x: x + this.movementKeys[keyPressed].x,
          y: y + this.movementKeys[keyPressed].y
        }
        if (this.isWalkable(newPosition)) this.player.position = newPosition;
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
      const content = [];
      const firstSpawn = this.player.spawnPoint == this.stringifyCoords(coords);
      if (this.isPlayer(coords)) content.push(`<div id="player" class="${firstSpawn ? 'spawn' : ''}"></div>`);
      if (this.isWalkable(coords) || tile.type == 'box' || tile.type == 'high-box') content.push('<div class="floor"><div class="floor-walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>');
      if (tile.type !== 'path' && tile.type !== 'spot') content.push(`<div class="${this.tiles[this.stringifyCoords(coords)].type}">`);
      if (tile.type == 'spot') content.push(`<button class="${this.tiles[this.stringifyCoords(coords)].type}" id="${this.tiles[this.stringifyCoords(coords)].enemy?.id}"><span class="material-symbols-outlined">swords</span></button>`)
      if (tile.type == 'box' || tile.type == 'high box') content.push(`<div class="box-walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      if (tile.type == 'water') content.push(`<div class="surface"><div class="water-walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      if (tile.type == 'tree') content.push(`${tile.hpUp ? '<i class="fa-solid fa-heart-circle-plus"></i>' : ''}<div class="top-tree"></div><div class="trunk-tree"></div>`);
      if (tile.type == 'portal') content.push('<div id="beacon"></div>')
      content.push(`</div>`);
      if (this.isPlayer(coords) && tile.type == 'spot') content.push(`<div class='tent'></div>`);
      return content.join('')
    },
    renderBoard() {
      setTimeout(() => {
        this.disabledKeys = false;
      }, 4500);
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
      const spawnableTiles = []
      for (const [key, value] of Object.entries(this.tiles)) {
        if (value && value.type === 'path') spawnableTiles.push(key);
      }
      this.player.spawnPoint = spawnableTiles.sample()
      this.player.position = this.parseCoords(this.player.spawnPoint);
    },
    addEnemies(enemies) {
      // increasing enemy strength based on floor
      const floor = this.floor
      enemies.forEach((enemy) => {
        const points = (floor - 1) * 3
        for (let index = 0; index < points; index++) {
          const attrToAdd = Object.keys(enemy.attributes).sample();
          enemy.attributes[attrToAdd]++
        }
      })
      // adding enemies to spots
      const spots = Object.values(this.tiles).filter(tile => tile.type == 'spot');
      enemies.shuffle().forEach((enemy, index) => {
        if (spots[index]) spots[index].enemy = enemy
      })
    },
    mapSpots() {
      this.spots = Object.keys(this.tiles).filter(position => this.tiles[position].type === 'spot');
    },
    combatTurn() {
      if (this.enemy.isDead || this.player.isDead) return;
      this.turnCount += 1;
      const playerImg = document.querySelector('#player-model img');
      const enemyImg = document.querySelector('#enemy-model img');
      // player phase
      let playerHit
      if (this.criticalHit(this.player)) {
        playerHit = true
        this.player.turnDamage = this.player.attributes.atk * 3
      } else {
        playerHit = this.hitConfirmed(this.enemy, this.player);
        playerHit ? this.calculateDamage(this.enemy, this.player) : this.player.turnDamage = 'miss'
      }
      // applying damage to enemy
      this.applyDamage(this.enemy, this.player)
      if (this.enemy.isDead) {
        playerImg.classList.add('player-atk');
        enemyImg.classList.add('enemy-hit');
        return this.showResult("You Won!");
      } else {
        enemyImg.classList.add(`atk-${ playerHit ? 'hit' : 'miss'}`);
      }
      // enemy phase
      let enemyHit
      if (this.criticalHit(this.player)) {
        enemyHit = true
        this.enemy.turnDamage = this.enemy.attributes.atk * 3
      } else {
        const enemyHit = this.hitConfirmed(this.player, this.enemy)
        enemyHit ? this.calculateDamage(this.player, this.enemy) : this.enemy.turnDamage = 'miss'
      }
      // applying damage to player
      playerImg.classList.add(`atk-${ enemyHit ? 'hit' : 'miss'}`);
      this.applyDamage(this.player, this.enemy)

      if (this.player.isDead) return this.showResult("Game Over");
      document.querySelector('#atk-btn').setAttribute('disabled', '')
      setTimeout(() => {
        playerImg.classList = '';
        enemyImg.classList = '';
        this.player.turnDamage = '';
        this.enemy.turnDamage = '';
        document.querySelector('#atk-btn').removeAttribute('disabled')
      }, 1000);
    },
    showResult(message) {
      setTimeout(() => {
        document.querySelector('#player-model img').classList = '';
        document.querySelector('#enemy-model img').classList = '';
        this.player.turnDamage = '';
        this.enemy.turnDamage = '';
        setTimeout(() => {
          if (confirm(message)) {
            if (this.player.isDead) {
              window.location.reload();
            } else {
              this.tiles[this.stringifyCoords(this.player.position)] = { ...this.tileTypes.path }
              this.xpUp(30);
            }
            document.querySelector('.modal .btn-close-white').click()
            this.turnCount = 0
          }
        }, 100);
      }, message == 'You Won!' ? 500 : 1000);
    },
    hitConfirmed(defender, attacker) {
      return rand(defender.attributes.agi) <= Math.round(attacker.attributes.dex/3)
    },
    criticalHit(attacker) {
      return attacker.attributes.luk >= rand(100)
    },
    calculateDamage(defender, attacker) {
      const damage = Math.round(attacker.attributes.atk - defender.attributes.def/3);
      attacker.turnDamage = damage
    },
    applyDamage(defender, attacker) {
      if (Number(attacker.turnDamage) == NaN) return
      const damage = attacker.turnDamage
      if (damage <= 0) {
        attacker.turnDamage = 1
        defender.hp -= 1
      } else if (damage > 0) {
        defender.hp -= damage;
      }
      if (defender.hp <= 0) {
        defender.hp = 0
        defender.isDead = true
      };
    },
    remainingHP(char) {
      return char.hp/char.max_hp * 100
    },
    xpUp(amount) {
      if (this.player.xp + amount >= 100) {
        this.player.xp = (this.player.xp + amount - 100)
        this.player.lvl += 1
        this.player.hp = this.player.max_hp
        this.player.points += 3
      } else {
        this.player.xp += amount
      }
    },
    updateAttribute(attr) {
      const plusButtons = document.querySelectorAll('.plus-btn');
      if (this.player.points > 0) {
        plusButtons.forEach(btn=>btn.removeAttribute('disabled'))
        this.player.attributes[attr]++
        this.player.points--
      }
      if (this.player.points == 0) plusButtons.forEach(btn=>btn.setAttribute('disabled',''))
    },
    expand(e) {
      e.target.parentElement.classList.toggle('expand');
    }
  }
}).mount('#app')
