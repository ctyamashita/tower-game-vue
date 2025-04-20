import { createApp } from 'vue';
import Swal from 'sweetalert2';
import initializeArrayHelpers from './helpers.js';
import Tile from './Tile.js';
import Combat from './Combat.js';

initializeArrayHelpers()

// Vue app
createApp({
  data() {
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
        defaultTiles[`${x}-${y}`] = new Tile(x,y,'path')
      }
    }

    const mode = localStorage.getItem("isoView") == 'true';

    this.tileConfig = tileConfig;

    return {
      screen: { width: 100, height: 100 },
      board: { ...boardDefault, isoView: mode },
      time: {
        light: 'day',
        movementCount: 0,
        dayMoves: 24,
        hour: 11,
        amOrPm: 'AM',
        clock: 100
      },
      turnCount: 1,
      floor: 1,
      player: {
        position: { x: 1, y: 1 },
        job: "warrior",
        lvl: 1,
        xp: 0,
        points: 0,
        hp: 12,
        max_hp: 12,
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
    this.board.isoView = true;
    localStorage.setItem("isoView", this.board.isoView)
    window.onload = () => {
      this.resizeHandler();
      this.renderBoard();
      this.updateClock();
    }
    window.addEventListener('resize', this.resizeHandler);
    document.addEventListener('keyup', this.keyUpHandler);
    document.addEventListener('keydown', this.keyDownHandler);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('keydown', this.keyDownHandler);
  },
  methods: {
    // helpers
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

      if (Object.keys(this.movementKeys).includes(keyPressed)) this.move(keyPressed);

      if (keyPressed == 'e') {
        this.board.isoView = !this.board.isoView;
        localStorage.setItem("isoView", this.board.isoView)
      }
      try {
        document.querySelector(`#${keyPressed}-key`).classList.remove('pressed');
      } catch (error) {
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
    isPlayer(coords) { return this.player.position.x == coords.x && this.player.position.y == coords.y },
    isSpot(coords) { return this.tiles[this.stringifyCoords(coords)].type == 'spot'},
    isTree(coords) { return this.tiles[this.stringifyCoords(coords)].type == 'tree'},
    isPortal(coords) { return this.tiles[this.stringifyCoords(coords)].type == 'portal'},
    isWalkable(coords) { return this.tiles[this.stringifyCoords(coords)]?.walkable },
    stringifyCoords(coords) { return Object.values(coords).join('-') },
    parseCoords(string) {
      const [x,y] = string.split('-');
      return { x: Number(x), y: Number(y) }
    },
    expand(e) { e.target.parentElement.classList.toggle('expand'); },
    updateClock() {
      window.requestAnimationFrame(() => {

        // draw helpers
        const canvas = document.getElementById('clock');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        function drawCircle(x, y, radius, start, end, clockwise, color) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 20;
          ctx.beginPath();
          ctx.arc(x, y, radius, start, end, clockwise);
          ctx.stroke();
        }
        // Define colors for hour, minute and second hand
        const hourActiveColor = '#FFFFFF'
        // Define inactive colors for hour, minute and second hand
        const hourInactiveColor = '#3C4043'
        // Finding center point of canvas
        const centerX = canvas.width / 2,
          centerY = canvas.height / 2;

        this.time.hour += 1;
        if(this.time.hour >= 12) {
          this.time.hour -= 12;
          if (this.time.amOrPm == "AM") {
            this.time.amOrPm = 'PM'
          } else {
            this.time.amOrPm = "AM"
          }
        }
        //rad per hour
        const rad = (Math.PI / 180) * ((360/12) * this.time.hour)

        // Hour Hand
        if (this.time.amOrPm == 'AM') {
          drawCircle(centerX, centerY, 20, 0, 360 , false, hourInactiveColor, 'stroke');
          drawCircle(centerX, centerY, 20, 0, rad, false, hourActiveColor, 'stroke');
        } else {
          drawCircle(centerX, centerY, 20, 0, 360 , false, hourActiveColor, 'stroke');
          drawCircle(centerX, centerY, 20, 0, rad, false, hourInactiveColor, 'stroke');
        }
      });
    },
    tileContent(coords) {
      const firstSpawn = this.player.spawnPoint == this.stringifyCoords(coords);
      const stringCoords = this.stringifyCoords(coords)
      if (this.tiles && this.tiles[stringCoords]) {
        return this.tiles[stringCoords].htmlEl(this.isPlayer(coords), firstSpawn)
      }
    },
    // map generation
    renderBoard() {
      setTimeout(() => {
        this.disabledKeys = false;
      }, 4500);
      try {
        const path = location.origin == 'http://localhost:8000' ? 'data/classes.json' : '/tower-game-vue/data/classes.json'
        fetch(path)
          .then(response => response.json())
          .then((json) => {
            this.classes = json
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
      this.tiles = {}
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
          const currentTile = tilesArray.pop()
          this.tiles[`${x}-${y}`] = new Tile(x, y, currentTile)
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
    // map actions
    move(keyPressed) {
      delete this.player.spawnPoint;
      if (keyPressed == 'e') {
        this.board.isoView = !this.board.isoView;
        localStorage.setItem("isoView", this.board.isoView)
      } else if (this.movementKeys[keyPressed]) {
        const [x, y] = Object.values(this.player.position);
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
          this.updateClock();
          if (this.isSpot(newPosition)) {
            // console.log("Combat!")
            setTimeout(() => {
              this.startCombat(newPosition)
            }, 100);
          } else if (this.isTree(newPosition)) {
            setTimeout((scope) => {
              const currentTile = scope.tiles[scope.stringifyCoords(newPosition)]
              if (currentTile.hpUp && scope.player.hp + 2 <= scope.player.max_hp) scope.player.hp += 2;
              currentTile.hpUp = false;
              scope.$nextTick(() => {});
            }, 1000, this);
          } else if (this.isPortal(newPosition)) {
            this.disabledKeys = true;
            setTimeout((scope) => {
              scope.renderBoard();
              scope.floor++
              scope.$nextTick(() => {
                // Ensure DOM is updated after data change
              });
            }, 4500, this);
          }
        }
      }
    },
    // combat
    combatTurn(action) {
      if (!this.currentCombat || this.currentCombat.ended) this.currentCombat = new Combat(this.player, this.enemy);
      const animations = this.currentCombat.turn(action);
      
      const playerImg = document.querySelector('#player-model img');
      const enemyImg = document.querySelector('#enemy-model img');
      
      if (animations.player) animations.player.forEach(className => playerImg.classList.add(className))
      if (animations.enemy) animations.enemy.forEach(className => enemyImg.classList.add(className))

      if (this.enemy.isDead) return this.showResult('Victory!')

      document.querySelector('#atk-btn').setAttribute('disabled', '')
      document.querySelector('#run-btn').setAttribute('disabled', '')

      setTimeout(() => this.playerCheck(animations.escape, action), 600);
    },
    playerCheck(escape, action) {
      this.currentCombat.applyDamage(this.player, this.enemy)
      if (this.player.isDead) return this.showResult("Game Over");
      setTimeout(() => this.endTurnAnimationReset(escape, action), 400);
    },
    endTurnAnimationReset(escape, action) {
      const playerImg = document.querySelector('#player-model img');
      const enemyImg = document.querySelector('#enemy-model img');
      playerImg.classList = '';
      enemyImg.classList = '';
      this.player.turnDamage = '';
      this.enemy.turnDamage = '';
      document.querySelector('#atk-btn').removeAttribute('disabled')
      document.querySelector('#run-btn').removeAttribute('disabled')
      if (escape && action === 'run') {
        this.endCombat()
        this.currentCombat = false
      }
    },
    showResult(message) {
      setTimeout(() => {
        document.querySelector('#player-model img').classList = '';
        document.querySelector('#enemy-model img').classList = '';
        this.player.turnDamage = '';
        this.enemy.turnDamage = '';
        setTimeout(() => {
          const gameOver = this.player.isDead
          const winIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height=64><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z"/></svg>';
          const loseIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height=48><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M368 128c0 44.4-25.4 83.5-64 106.4l0 21.6c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-21.6c-38.6-23-64-62.1-64-106.4C80 57.3 144.5 0 224 0s144 57.3 144 128zM168 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM3.4 273.7c7.9-15.8 27.1-22.2 42.9-14.3L224 348.2l177.7-88.8c15.8-7.9 35-1.5 42.9 14.3s1.5 35-14.3 42.9L295.6 384l134.8 67.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L224 419.8 46.3 508.6c-15.8 7.9-35 1.5-42.9-14.3s-1.5-35 14.3-42.9L152.4 384 17.7 316.6C1.9 308.7-4.5 289.5 3.4 273.7z"/></svg>'

          if (gameOver) {
            Swal.fire({
              title: message,
              iconHtml: loseIcon,
              confirmButtonText: `<span><i class="fa-solid fa-arrow-rotate-left"></i> New Game </span>`,
              customClass: {
                icon: 'fa-fade lose-icon',
              },
            }).then(() => window.location.reload())
          } else {  
            Swal.fire({
              title: message,
              text: "+40xp",
              iconHtml: winIcon,
              customClass: {
                icon: 'fa-bounce victory-icon',
              },
            }).then(() => {
              // remove enemy from board
              this.tiles[this.stringifyCoords(this.player.position)] = new Tile(this.player.position.x, this.player.position.y, 'path')
              // reward exp
              this.xpUp(40);
              // close popup
              this.endCombat();
              // reset turn count
              this.turnCount = 1
            })
          }
          
        }, 100);
      }, message == 'Victory!' ? 500 : 1000);
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
        document.querySelectorAll('#menu button.plus-btn').forEach(btn=>btn.removeAttribute('disabled'))
        Swal.fire({
          title: 'Level Up!',
          text: "+3 Attribute points",
        })
      } else {
        this.player.xp += amount
      }
    },
    updateAttribute(attr) {
      const plusButtons = document.querySelectorAll('.plus-btn');
      if (this.player.points > 0) {
        plusButtons.forEach(btn=>btn.removeAttribute('disabled'))
        this.player.attributes[attr]++
        if (attr == 'def') {
          this.player.max_hp = Math.floor(this.player.attributes.def/3) + 11
          this.player.hp = this.player.max_hp
        }
        this.player.points--
      }
      if (this.player.points == 0) plusButtons.forEach(btn=>btn.setAttribute('disabled',''))
    },
    startCombat(coords) {
      this.enemy = this.tiles[this.stringifyCoords(coords)].enemy
      document.querySelector('.modal').classList.add('expand');
      this.inBattle = true;
    },
    endCombat() {
      document.querySelector('.modal').classList.remove('expand');
      this.inBattle = false;
    }
  }
}).mount('#app')
