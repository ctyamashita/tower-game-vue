import { createApp } from 'vue';
import Swal from 'sweetalert2';
import initializeArrayHelpers from './helpers.js';
import Tile from './Tile.js';
import Combat from './Combat.js';
import rand from './rand.js'

if ('serviceWorker' in navigator) {
  const path = `${location.origin == 'http://localhost:8000' ? '' : '/tower-game-vue'}/service-worker.js`
  // console.log(path)
  navigator.serviceWorker.register(path).catch(function(err) { 
    console.log(err)
    console.info('Service Worker not supported.') 
  })
}

initializeArrayHelpers();

// Vue app
createApp({
  data() {
    const tileConfig = {
      'spot': 5,
      'water': 5,
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

    this.tileConfig = tileConfig;

    return {
      screen: { width: 100, height: 100 },
      board: { ...boardDefault, isoView: true },
      time: {
        light: 'day',
        movementCount: 0,
        dayMoves: 24,
        hour: 12,
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
      disabledKeys: true,
      audioOn: false,

    }
  },
  mounted() {
    this.loadAudio();
    localStorage.setItem("isoView", this.board.isoView)
    window.onload = () => {
      this.initializeGame()
      window.addEventListener('resize', this.resizeHandler);
      document.addEventListener('keyup', this.keyUpHandler);
      document.addEventListener('keydown', this.keyDownHandler);
      document.addEventListener('touchstart', this.touchStartHandler);
      document.addEventListener('touchend', this.touchEndHandler);
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('keydown', this.keyDownHandler);
  },
  methods: {
    // helpers
    loadAudio() {
      this.bgm = new Audio('./audio/BGM.mp3');
      this.bgm.loop = true;
      this.bgm.volume = .5;
      this.bgm.preservesPitch = false
      this.battleBGM = new Audio('./audio/BattleBGM.mp3');
      this.battleBGM.loop = true
      this.battleBGM.volume = .5;
      this.gameOverBGM = new Audio('./audio/GameOver.mp3');
      this.victoryBGM = new Audio('./audio/Victory.mp3');
      this.stepSound = new Audio('./audio/Step.mp3');
      this.hpUpSound = new Audio('./audio/HpUp.mp3');
      this.lvlUpSound = new Audio('./audio/LvlUp.mp3');
      this.missSound = new Audio('./audio/Miss.mp3');
      this.hitSound = new Audio('./audio/Hit.mp3');
      this.hitCriticalSound = new Audio('./audio/HitCritical.mp3');
      this.runSound = new Audio('./audio/Run.mp3');
      this.portalSound = new Audio('./audio/Portal.mp3');
      this.portalSound.playbackRate = .5
      this.spawnSound = new Audio('./audio/Spawn.mp3');
    },
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
    touchStartHandler(e) {
      if (this.disabledKeys || this.inBattle) return;
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    },
    touchEndHandler(e) {
      if (this.disabledKeys || this.inBattle) return;
      this.touchEndX = e.changedTouches[0].screenX;
      this.touchEndY = e.changedTouches[0].screenY;
      this.gestureHandler()
    },
    gestureHandler() {
      const xMoviment = this.touchEndX - this.touchStartX
      const yMoviment = this.touchEndY - this.touchStartY
      const direction = []

      if (Math.abs(xMoviment) > 30) {
        direction.push(xMoviment > 0 ? 'right' : 'left')
      }
      if (Math.abs(yMoviment) > 30) {
        direction.push(yMoviment > 0 ? 'down' : 'up')
      }
      if (direction.length == 0) {
        // console.log('tap')
      } else if (direction.includes('right')) {
        if (direction.length > 1) {
          direction.includes('up') ? this.move('w') : this.move('d');
        } else {
          this.move('d')
        }
      } else if (direction.includes('left')) {
        if (direction.length > 1) {
          direction.includes('up') ? this.move('a') : this.move('s');
        } else {
          this.move('a')
        }
      } else {
        direction.includes('up') ? this.move('w') : this.move('s');
      }
    },
    enableAudio(e) {
      const btnIcon = e.currentTarget.firstElementChild
      this.audioOn = !this.audioOn
      btnIcon.classList.toggle('fa-volume-high')
      btnIcon.classList.toggle('fa-volume-xmark')

      this.bgm.paused ? this.bgm.play() : this.bgm.pause()
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
    leadingZero(num, size) {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    },
    expand(e) { e.target.parentElement.classList.toggle('expand'); },
    updateClock() {
      if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .875) {
        this.time.light = 'day'
        this.bgm.playbackRate = 1;
      } else if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .75) {
        this.time.light = 'sunrise'
      } else if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .29166666666666666666666) {
        this.time.light = 'night'
        this.bgm.playbackRate = .8;
      } else if (this.time.movementCount % this.time.dayMoves == this.time.dayMoves * .125) {
        this.time.light = 'sunset'
      }

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
        // Finding center point of canvas
        const centerX = canvas.width / 2,
          centerY = canvas.height / 2;

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
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.arc(50, 50, 24, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255,255,255,.3)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(50, 50, 22, 0, 2 * Math.PI);
          ctx.fillStyle = "rgb(70, 70, 70)";
          ctx.fill();
          drawCircle(centerX, centerY, 10, 0, rad, false, 'darkkhaki', 'stroke');
        } else {
          const ctx = canvas.getContext('2d');
          ctx.beginPath();
          ctx.arc(50, 50, 24, 0, 2 * Math.PI);
          ctx.fillStyle = "rgba(255,255,255,.3)";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(50, 50, 22, 0, 2 * Math.PI);
          ctx.fillStyle = "darkkhaki";
          ctx.fill();
          drawCircle(centerX, centerY, 10, 0, rad, false, 'rgb(70, 70, 70)', 'stroke');
        }

        // drawCircle(centerX, centerY, 20, 0, 360 , false, '#FFFFFF', 'stroke', 40);
      });
    },
    tileContent(coords) {
      const firstSpawn = this.player.spawnPoint == this.stringifyCoords(coords);
      const stringCoords = this.stringifyCoords(coords)
      if (this.tiles && this.tiles[stringCoords]) {
        return this.tiles[stringCoords].htmlEl(this.isPlayer(coords), firstSpawn, this.player.job)
      }
    },
    info() {
      Swal.fire({
        icon: "info",
        html: `
          <p>Code, Design and Illustrations<br><small><a href="https://ctyamashita.github.io/" target="_blank">Celso Takeshi Yamashita <i class="fa-solid fa-arrow-up-right-from-square"></i></a></small></p>  
          <p>BGM and Sounds<br><small><a href="https://pixabay.com/music/" target="_blank">Pixbay <i class="fa-solid fa-arrow-up-right-from-square"></i></a></small></p>  
        `,
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        focusConfirm: false,
      })
    },
    reboot() {
      Swal.fire({
        title: "Reboot",
        text: "Are you sure you want to start a new game?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          this.newGame()
        }
      });
    },
    // map generation
    initializeGame() {
      const path = location.origin == 'http://localhost:8000' ? 'data/classes.json' : '/tower-game-vue/data/classes.json'
      fetch(path)
        .then(response => response.json())
        .then((json) => {
          this.classes = json;
          this.newGame()
        })
    },
    renderBoard() {
      setTimeout(() => {
        this.disabledKeys = false;
        document.querySelector('.spawn').classList.remove('spawn')
      }, 4800);
      try {
        setTimeout((scope) => {
          if (scope.audioOn) {
            this.spawnSound.currentTime = 0
            this.spawnSound.play()
          }
        }, 1600, this);
        this.generateTiles();
        this.addEnemies(this.classes);
        this.spawnPlayer();
        this.mapSpots();
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
      const waterTiles = []
      const otherBlocks = []

      // updating tiles
      for (let y = 1; y <= this.board.height; y++) {
        for (let x = 1; x <= this.board.width; x++) {
          const currentTile = tilesArray.pop()
          this.tiles[`${x}-${y}`] = new Tile(x, y, currentTile)
          currentTile == 'water' ? waterTiles.push([x, y]) : otherBlocks.push([x, y])
        }
      }
      // setting low tiles around water tiles
      waterTiles.forEach((coords) => {
        const [x, y] = coords
        const currentBlock = this.tiles[`${x}-${y}`]
        const eastBlock = this.tiles[`${x + 1}-${y}`]
        const southEastBlock = this.tiles[`${x + 1}-${y - 1}`]
        const northEastBlock = this.tiles[`${x + 1}-${y + 1}`]
        const westBlock = this.tiles[`${x - 1}-${y}`]
        const southWestBlock = this.tiles[`${x - 1}-${y - 1}`]
        const northWestBlock = this.tiles[`${x - 1}-${y + 1}`]
        const northBlock = this.tiles[`${x}-${y + 1}`]
        const southBlock = this.tiles[`${x}-${y - 1}`]

        if (eastBlock && eastBlock.type != 'water') eastBlock.height = 'low'
        if (westBlock && westBlock.type != 'water') westBlock.height = 'low'
        if (northBlock && northBlock.type != 'water') northBlock.height = 'low'
        if (southBlock && southBlock.type != 'water') southBlock.height = 'low'
        if (southEastBlock && southEastBlock.type != 'water') southEastBlock.height = 'low'
        if (southWestBlock && southWestBlock.type != 'water') southWestBlock.height = 'low'
        if (northEastBlock && northEastBlock.type != 'water') northEastBlock.height = 'low'
        if (northWestBlock && northWestBlock.type != 'water') northWestBlock.height = 'low'
        currentBlock.height = ''
      })

      // setting high to tiles with blocks
      otherBlocks.forEach((coords) => {
        const [x, y] = coords
        const currentBlock = this.tiles[`${x}-${y}`]
        if (currentBlock.type == 'box') {
          const randomHeight = ['', 'high'][rand(1)]
          currentBlock.height = randomHeight
        }
      })
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
        if (spots[index]) spots[index].enemy = {...enemy}
      })
    },
    mapSpots() {
      this.spots = Object.keys(this.tiles).filter(position => this.tiles[position].type === 'spot');
    },
    newGame() {
      const table = document.getElementById('board')
      const displayClock = document.getElementById('time-display')
      table.classList.add('hide')
      const availableClasses = this.classes.sort((a,b)=> a.id - b.id).map(obj=>obj.job)
      Swal.fire({
        title: 'Kyuuko Tower Arena',
        html: '<img src="/images/icons/android-chrome-192x192.png" />',
        confirmButtonText: 'Start',
        allowOutsideClick: () => {
          return false
        }
      }).then(()=>{
        Swal.fire({
          title: 'Choose your class',
          html: `
            <div id="new-game-container">
              <div id="new-game-class-img-container">
                <img src="images/warrior.png" id="new-game-class-img" />
                <p id="new-game-class-name">warrior</p>
              </div>
              <div id="new-game-class-container">
                ${availableClasses.map(job=>{
                  return `<label for='${job}-option' style="background: url('images/${job}-icon.png') whitesmoke; background-size: contain; background-repeat: no-repeat; background-position: center">
                            <input type="radio" name="player-class" id="${job}-option" value="${job}" ${job == 'warrior' ? 'checked' : ''}>
                          </label>`
                }).join('')}
              </div>
            </div>
            `,
          confirmButtonText: 'Select',
          allowOutsideClick: () => {
            return false
          },
          didOpen: () => {
            const popUp = Swal.getPopup()
            const inputClasses = popUp.querySelectorAll('input[name=player-class]')
            
            inputClasses.forEach(input=>{
              input.addEventListener('change', (e) => {
                const imgClass = document.getElementById('new-game-class-img')
                const nameClass = document.getElementById('new-game-class-name')
                const selectedClass = e.currentTarget.value
                imgClass.src = `images/${selectedClass}.png`
                const classTemplate = this.classes.find(obj=>obj.job == selectedClass)
                nameClass.innerHTML = selectedClass
        
                this.player = {
                  lvl: 1,
                  xp: 0,
                  points: 0,
                  position: { x: 1, y: 1 },
                  ...classTemplate
                }
              })
            })
          },
        }).then(() => {
          this.resizeHandler();
          this.renderBoard();
          this.time = {
            light: 'day',
            movementCount: 0,
            dayMoves: 24,
            hour: 12,
            amOrPm: 'AM',
            clock: 100
          }
          this.updateClock();
          table.classList.remove('hide')
          displayClock.classList.remove('hide')
        })
      })
    },
    resetGame() {
      this.endCombat()

      const classTemplate = this.classes.find(obj=>obj.job == this.player.job)
      
      this.player = {
        position: { x: 1, y: 1 },
        lvl: 1,
        xp: 0,
        points: 0,
        ...classTemplate
      }
      this.player.hp = this.player.max_hp
      this.time = {
        light: 'day',
        movementCount: 0,
        dayMoves: 24,
        hour: 12,
        amOrPm: 'AM',
        clock: 100
      }
      this.updateClock();
      this.bgm.playbackRate = 1;
      this.floor = 1;
      this.renderBoard();
    },
    // map actions
    move(keyPressed) {
      delete this.player.spawnPoint;
      if (this.audioOn) {
        this.stepSound.currentTime = 0
        this.stepSound.play()
      }
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
          this.time.hour++
          this.updateClock();
          if (this.isSpot(newPosition)) {
            // console.log("Combat!")
            setTimeout(() => {
              this.startCombat(newPosition)
            }, 200);
          } else if (this.isTree(newPosition)) {
            const currentTile = this.tiles[this.stringifyCoords(newPosition)]
            if (currentTile.hpUp && this.audioOn) {
              this.hpUpSound.currentTime = 0
              this.hpUpSound.play()
            }
            setTimeout((scope) => {
              const currentTile = scope.tiles[scope.stringifyCoords(newPosition)]
              if (currentTile.hpUp && scope.player.hp < scope.player.max_hp) {
                scope.player.hp += scope.player.hp + 2 <= scope.player.max_hp ?  2 : 1;
              }
              currentTile.hpUp = false;
              scope.$nextTick(() => {});
            }, 300, this);
          } else if (this.isPortal(newPosition)) {
            this.disabledKeys = true;
            if (this.audioOn) {
              this.portalSound.currentTime = 0
              this.portalSound.play()
            }
            setTimeout((scope) => {
              scope.renderBoard();
              scope.floor++
              scope.$nextTick(() => {
                // Ensure DOM is updated after data change
              });
            }, 4700, this);
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

      if (this.audioOn) {
        if (animations.enemy.includes('critical')) {
          this.hitCriticalSound.currentTime = 0
          this.hitCriticalSound.play()
        } else if (this.player.turnDamage == 'miss') {
          this.missSound.currentTime = 0
          this.missSound.play()
        } else if (!animations.player.includes('run')) {
          this.hitSound.currentTime = 0
          this.hitSound.play()
        } else {
          this.runSound.currentTime = 0
          this.runSound.play()
        }
      }

      if (this.enemy.isDead) return this.showResult('Victory!')

      document.querySelector('#atk-btn').setAttribute('disabled', '')
      document.querySelector('#run-btn').setAttribute('disabled', '')

      setTimeout(() => this.playerCheck(animations, action), 600);
    },
    playerCheck(animations, action) {
      if (this.audioOn) {
        if (animations.player.includes('critical')) {
          this.hitCriticalSound.currentTime = 0
          this.hitCriticalSound.play()
        } else if (this.enemy.turnDamage == 'miss') {
          this.missSound.currentTime = 0
          this.missSound.play()
        } else if (!animations.player.includes('run') && !animations.player.includes('run-failed')) {
          this.hitSound.currentTime = 0
          this.hitSound.play()
        }
      }
      this.currentCombat.applyDamage(this.player, this.enemy)
      setTimeout(() => this.endTurnAnimationReset(animations.escape, action), 400);
    },
    endTurnAnimationReset(escape, action) {
      if (this.player.isDead) return this.showResult("Game Over");
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
          if (this.audioOn) {
            const resultBGM = gameOver ? this.gameOverBGM : this.victoryBGM
            this.battleBGM.pause()
            this.battleBGM.currentTime = 0;
            resultBGM.play()
            resultBGM.onended = () => { this.bgm.play() }
          }
          if (gameOver) {
            const loseIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height=48><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M368 128c0 44.4-25.4 83.5-64 106.4l0 21.6c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-21.6c-38.6-23-64-62.1-64-106.4C80 57.3 144.5 0 224 0s144 57.3 144 128zM168 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM3.4 273.7c7.9-15.8 27.1-22.2 42.9-14.3L224 348.2l177.7-88.8c15.8-7.9 35-1.5 42.9 14.3s1.5 35-14.3 42.9L295.6 384l134.8 67.4c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L224 419.8 46.3 508.6c-15.8 7.9-35 1.5-42.9-14.3s-1.5-35 14.3-42.9L152.4 384 17.7 316.6C1.9 308.7-4.5 289.5 3.4 273.7z"/></svg>'
            Swal.fire({
              title: message,
              iconHtml: loseIcon,
              confirmButtonText: `<span><i class="fa-solid fa-arrow-rotate-left"></i> New Game </span>`,
              customClass: {
                icon: 'fa-fade lose-icon',
              },
            }).then(() => this.resetGame())
          } else {
            const winIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height=64><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z"/></svg>';
            Swal.fire({
              title: message,
              text: "+40xp",
              iconHtml: winIcon,
              customClass: {
                icon: 'fa-bounce victory-icon',
              },
            }).then(() => {
              // remove enemy from board
              this.tiles[this.stringifyCoords(this.player.position)] = new Tile(this.player.position.x, this.player.position.y, 'path', this.tiles[this.stringifyCoords(this.player.position)].height)
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
        if (this.enableAudio) {
          this.lvlUpSound.currentTime = 0
          this.lvlUpSound.play()
        }
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
      if (this.audioOn) {
        if (!this.bgm.paused) this.bgm.pause()
        if (this.battleBGM.paused && this.bgm.paused) this.battleBGM.play()
      }
      this.enemy = this.tiles[this.stringifyCoords(coords)].enemy
      document.querySelector('.modal').classList.add('expand');
      this.inBattle = true;
    },
    endCombat() {
      if (this.audioOn) {
        if (this.bgm.paused) this.bgm.play()
        if (!this.battleBGM.paused && !this.bgm.paused) this.battleBGM.pause()
      }
      document.querySelector('#atk-btn').removeAttribute('disabled')
      document.querySelector('#run-btn').removeAttribute('disabled')
      document.querySelector('.modal').classList.remove('expand');
      this.inBattle = false;
    }
  }
}).mount('#app')
