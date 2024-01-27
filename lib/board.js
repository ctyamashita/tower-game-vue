import { createApp } from 'vue'

createApp({
  data() {
    return {
      screen: {
        width: 100,
        height: 100
      },
      board: {
        width: 7,
        height: 7,
        isoView: false,
      },
      player: {
        position: {
          x: 1,
          y: 1
        }
      },
      objects: {
        '2-2': {type: 'box', walkable: false}
      },
      movementKeys: {
        w: {x:0, y:-1},
        a: {x:-1, y:0},
        s: {x:0, y:1},
        d: {x:1, y:0}
      }
    }
  },
  mounted() {
    window.onload = this.resizeHandler;
    window.addEventListener('resize', this.resizeHandler);
    document.addEventListener('keyup', this.keyUpHandler);
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
  },
  methods: {
    resizeHandler() {
      this.screen.width = document.documentElement.clientWidth;
      this.screen.height = document.documentElement.clientHeight;

      const isLandscape = this.screen.height < this.screen.width;
      const tiles = document.querySelectorAll('#board td');

      tiles.forEach(tile=>{
        const tileSize = isLandscape ? `${Math.round(80/this.board.height)}vh` : `${Math.round(80/this.board.width)}vw`;
        const borderWidth = isLandscape ? `.2vh` : `.2vw`
        tile.style.width = tile.style.height = tileSize
        tile.style.border = `solid ${borderWidth}`
      })
    },
    keyUpHandler(e) {
      const keyPressed = e.key;
      if (Object.keys(this.movementKeys).includes(keyPressed)) this.move(keyPressed);
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
    isObject(coords) { return this.objects[this.stringifyCoords(coords)] ? this.objects[this.stringifyCoords(coords)].type : '' },
    isPlayer(coords) { return this.player.position.x == coords.x && this.player.position.y == coords.y ? 'player' : '' },
    isWalkable(coords) {
      if (this.objects[this.stringifyCoords(coords)]) return this.objects[this.stringifyCoords(coords)].walkable;
      return coords.x > 0 && coords.x <= this.board.width && coords.y > 0 && coords.y <= this.board.height;
    },
    stringifyCoords(coords) { return Object.values(coords).join('-') }
  }
}).mount('#app')
