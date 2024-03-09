import { createApp } from 'vue'
// import { Tile } from './Tile.js'

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

//degree to rad
function rad(deg){
	return  (Math.PI / 180) * deg;
}

// draw helpers
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// set the start point of the hour, minute and second hand to top
const threePIByTwo = (3 * Math.PI) / 2;

function drawText(text, x, y, color, size) {
	ctx.font = `${size} "Poppins"`;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
}

function drawRect(x, y, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function drawArc(x, y, radius, start, end, clockwise)
{
	ctx.beginPath();
	ctx.arc(x, y, radius, start, end, clockwise);
}

function drawCircle(x, y, radius, start, end, clockwise, color, type, thickness) {
	switch (type) {
		case 'fill':
			ctx.fillStyle = color;
			drawArc(x, y, radius, start, end, clockwise)
			ctx.fill();
			break;
		case 'stroke':
			ctx.strokeStyle = color;
			ctx.lineWidth = thickness;
			drawArc(x, y, radius, start, end, clockwise)
			ctx.stroke();
			break
	}
}

// Vue app

createApp({
  data() {
    const tileTypes = {
      // '<div class="floor"><div class="walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>'
      'path': {
        type: 'path',
        walkable: true,
        template: {
          tag: 'div',
          id: '',
          class: 'floor',
          text: '',
          attributes: {},
          children: [
            {
              tag: 'div',
              id: '',
              class: 'walls',
              text: '',
              attributes: {},
              children: [
                {tag: 'div', id: '', class: 'r-wall', text: '', attributes: {}},
                {tag: 'div', id: '', class: 'l-wall', text: '', attributes: {}}
              ]
            }
          ]
        }
      },
      'box': {
        type: 'box',
        walkable: false,
        template: {
          tag: 'div',
          id: '',
          class: 'box',
          text: '',
          attributes: {},
          children: [
            {
              tag: 'div',
              id: '',
              class: 'walls',
              text: '',
              attributes: {},
              children: [
                {tag: 'div', id: '', class: 'r-wall', text: '', attributes: {}},
                {tag: 'div', id: '', class: 'l-wall', text: '', attributes: {}}
              ]
            }
          ]
        }
      },
      'high-box': {
        type: 'high box',
        walkable: true,
        template: {
          tag: 'div',
          id: '',
          class: 'high box',
          text: '',
          attributes: {},
          children: [
            {
              tag: 'div',
              id: '', class: 'walls',
              text: '',
              attributes: {},
              children: [
                {tag: 'div', id: '', class: 'r-wall', text: '', attributes: {}},
                {tag: 'div', id: '', class: 'l-wall', text: '', attributes: {}}
              ]
            }
          ]
        }
      },
      'water': {
        type: 'water',
        walkable: false,
        template: {
          tag: 'div',
          id: '',
          class: 'water',
          text: '',
          attributes: {},
          children: [
            {
              tag: 'div',
              id: '',
              class: 'surface',
              text: '',
              attributes: {},
              children: [
                {
                  tag: 'div',
                  id: '',
                  class: 'walls',
                  attributes: {},
                  children: [
                    {tag: 'div', id: '', class: 'r-wall', text: '', attributes: {}},
                    {tag: 'div', id: '', class: 'l-wall', text: '', attributes: {}}
                  ]
                }
              ]
            }
          ]
        }
      },
      'spot': {
        type: 'spot',
        walkable: true,
        template: {
          tag: 'button',
          id: '',
          class: 'spot',
          text: '',
          attributes: {},
          children: [
            {tag: 'span', id: '', class: 'material-symbols-outlined', text: 'swords', attributes: {}}
          ]
        }},
      'tree': {
        type: 'tree',
        walkable: true,
        hpUp: true,
        template: {
          tag: 'div',
          id: '',
          class: 'tree',
          text: '',
          attributes: {},
          children: [
            {tag: 'div', id: '', class: 'top-tree', text: '', attributes: {}},
            {tag: 'div', id: '', class: 'trunk-tree', text: '', attributes: {}}
          ]
        }
      },
      // 'piramid': {type: 'piramid', walkable: false},
      'portal': {
        type: 'portal',
        walkable: true,
        template: {
          tag: 'div',
          id: '',
          class: 'portal',
          text: '',
          attributes: {},
          children: [
            {
              tag: 'div',
              id: '',
              class: 'beacon',
              text: '',
              attributes: {},
              children: []
            }
          ]
        }
      }
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
        light: 'day',
        movementCount: 0,
        dayMoves: 24,
        hour: 12,
        amOrPm: 'AM',
        clock: 100
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
        if (this.isWalkable(newPosition)) {
          this.player.position = newPosition;
          this.time.movementCount++
          if (this.time.movementCount % this.time.dayMoves == 0) {
            this.time.light = 'day'
          } else if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .75) {
            this.time.light = 'sunrise'
          } else if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .5) {
            this.time.light = 'night'
          } else if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .25) {
            this.time.light = 'sunset'
          }
          window.requestAnimationFrame(this.clock());
        }
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
      if (tile.walkable || tile.type.includes('box')) content.push(this.buildHTML(this.tileTypes.path.template));
      if (tile.type !== 'path' && tile.type !== 'spot') content.push(`<div class="${tile.type}">`);
      if (tile.type == 'spot') {
        tile.template.id = tile.enemy?.id
        content.push(`<button class="${tile.type}" id="${tile.enemy?.id}"><span class="material-symbols-outlined">swords</span></button>`)
      }
      if (tile.type == 'water') content.push('<div class="surface">')
      if (['box', 'high box', 'water'].includes(tile.type)) content.push(`<div class="walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      if (tile.type == 'water') content.push('</div>')
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
    },
    buildHTML(props) {
      const [tag, id, className, text, attributes, children] = Object.values(props);
      if (['br','hr','img', 'meta', 'link', 'area', 'input', 'base'].includes(tag)) {
        return `<${tag} class="${className}" id="${id}" ${Object.keys(attributes).map(attr=> `${attr}="${attributes[attr]}"`).join(' ')}/>`
      } else {
        return `<${tag} class="${className}" ${Object.keys(attributes).map(attr=> `${attr}="${attributes[attr]}"`).join(' ')}>${!children || children.length == 0 ? text : text + children?.map(child=>this.buildHTML(child)).join('')}</${tag}>`
      }
    },
    clock() {
      const canvasBg = '#1C1C28';
      // Define colors for hour, minute and second hand
      const hourActiveColor = '#39D98A'
      // Define inactive colors for hour, minute and second hand
      const hourInactiveColor = '#3C4043'
      const timerBg = '#282A2D';
      // Finding center point of canvas
      const centerX = canvas.width / 2,
        centerY = canvas.height / 2;

      if(this.time.hour > 12)
      {
        this.time.amOrPm = 'PM';
        this.time.hour -= 12;
      }

      /* Defines how much radians each hand should move */
      let radH = 0.000008333 * ( this.time.hour * 60 * 60 * 1000 );

      // Draw Canvas
      drawRect(0, 0, canvas.width, canvas.height, canvasBg);

      // Hour Hand
      drawCircle(centerX, centerY, 110, 0, 360 , false, hourInactiveColor, 'stroke', 90);
      drawCircle(centerX, centerY, 110, threePIByTwo, rad(radH) + threePIByTwo, false, hourActiveColor, 'stroke', 90);

      // Digital Timer
      drawCircle(centerX, centerY, 90, 0, 360, false, timerBg, 'fill', '50');
      drawText(`${this.time.hour.toString().padStart(2, "0")}h ${this.time.amOrPm}`, canvas.width / 2 - 60, canvas.height / 2 + 15, '#ffffff', '28px');
    }
  }
}).mount('#app')
