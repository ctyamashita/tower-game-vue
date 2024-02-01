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

// Projects
const data_projects = {
  projects: [{
    "title": "Photo Ronin",
    "tag": "Discover new places<br>to take your photos",
    "img": "og_photo.jpg",
    "screenshot": "ronin-screenshots.png",
    "icon": "fas fa-camera-retro",
    "description": [
      "Finding the perfect location to take pictures is extremely time consuming and most photographers usually struggle to find it.",
      "Our app allow users to discover new spots by browsing through photos or searching by address and/or tags.",
      "By selecting one location, the app will display photos and reviews with useful information shared by other photographers.",
      "When a photo is uploaded by a user, the metadata(EXIF) of the photo can be extracted and information such as location will be displayed on a map showing exactly where the picture was taken.",
      "These places can also be saved in lists created by the user and a link to google maps is provided with the route between user location and the coordinates of the place.",
      "Final project created in the last 2 weeks of the bootcamp."
    ],
    "links": [{
      "href": "https://github.com/ctyamashita/photo-ronin",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://photo-ronin.herokuapp.com/",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }
    ],
    "front": ["stimulus","css3","html5","bootstrap"],
    "back": ["ruby","ruby_on_rails", "postgresql"],
    "others": ["visual_studio_code", "git"],
    "team": [
      "Celso Takeshi Yamashita",
      "Hakuyo Harimoto",
      "Nana Kadode",
      "Shinji Momoi"
    ]
  },
  {
    "title": "No Camp<br>No Life",
    "tag": "Get the wheels<br>for the adventure<br>of your life!",
    "img": "camper1.jpg",
    "screenshot": "no-camp-no-life-screenshot.png",
    "icon": "fas fa-shuttle-van",
    "description":[
      "Camping with a camping car can be really fun, but most of us don't have enough money to buy one.",
      "In the end people give up on the idea after seen the necessary investment and work to go camping.",
      "No Camp No Life is a market place that allows users to rent camping cars fully equipped.",
      "Owner's of camping cars can also rent cars from other users."
    ],
    "links":[{
      "href": "https://github.com/ctyamashita/no-camp-no-life",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://no-camp-no-life.herokuapp.com/",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }
    ],
    "front": ["stimulus","css3","html5","bootstrap"],
    "back": ["ruby","ruby_on_rails", "postgresql"],
    "others": ["visual_studio_code", "git"],
    "team": [
      "Celso Takeshi Yamashita",
      "Hakuyo Harimoto",
      "Nana Kadode",
      "Shinji Momoi"
    ]
  },
  {
    "title": "Movie<br>Watchlist",
    "tag": "Create lists for your<br>favorite movies!",
    "img": "watchlist-portrait.png",
    "screenshot": "watch-list-screenshot.png",
    "icon": "fas fa-clipboard-list",
    "description":[
      "Watch list organizer. Save your favorite movies in lists!"
    ],
    "links":[{
      "href": "https://github.com/ctyamashita/no-camp-no-life",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://watch-list.herokuapp.com/",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }
    ],
    "front": ["stimulus","css3","html5","bootstrap"],
    "back": ["ruby","ruby_on_rails", "postgresql"],
    "others": ["visual_studio_code", "git"],
    "team": ["Celso Takeshi Yamashita"]
  },
  {
    "title": "Binge<br>Watcher",
    "tag": "Search for your next<br>series/movie to watch!",
    "img": "binge-watcher-cover.png",
    "screenshot": "binge-watcher-screenshot.png",
    "icon": "fas fa-couch",
    "description":[
      "Search for series and movies and get its detailed information.",
      "This project uses omdbAPI to fetch data from movies and series."
    ],
    "links":[{
      "href": "https://github.com/ctyamashita/react-binge-watcher",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://ctyamashita.github.io/react-binge-watcher/",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }],
    "front": ["react","css3","html5","bootstrap"],
    "others": ["visual_studio_code", "git"],
    "team":["Celso Takeshi Yamashita"]
  },
  {
    "title": "Equal Entry<br>Web VR Demo",
    "tag": "Exploring low-vision<br>accessibility on VR!",
    "img": "EE-Demo-cover-2.png",
    "screenshot": "EE-Demo-cover.png",
    "icon": "fas fa-vr-cardboard",
    "description":[
      "VR experience developed with the A-frame framework for <a href=\"https://equalentry.com\">Equal Entry</a>.",
      "This demo was created for studying ways to turn the VR experience more accessible to people with low-vision.",
      "The building and some of the 3D models were created on SketchUp and the code was developed on glitch for quick prototyping.",
      "You can explore this 3D environment using your browser or a Meta Quest 2 VR headset.",
      "If you are interested check out the <a href=\"https://equalentry.com/virtual-reality-accessibility-things-learned-from-blind-users/\">article</a> of our results."
    ],
    "links":[{
      "href": "https://glitch.com/~equal-entry-vr-study-reviewed",
      "icon": "fas fa-fish",
      "title": "Glitch"
    },
    {
      "href": "https://github.com/ctyamashita/ee-web-vr-demo",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://ctyamashita.github.io/ee-web-vr-demo/",
      "icon": "fas fa-desktop",
      "title": "Demo"
    }],
    "front": ["html5","javascript"],
    "others": ["visual_studio_code", "git", "glitch", "sketchup"],
    "team":["Celso Takeshi Yamashita"]
  },
  {
    "title": "Chat Room",
    "tag": "Join the Channel<br> from your batch!",
    "img": "simple-chat-cover.png",
    "screenshot": "simple-chat-screenshot.png",
    "icon": "fas fa-comment-alt",
    "description":[
      "Revisit to one of Le Wagon challenges during bootcamp. It's a simple chat using Le Wagon API."
    ],
    "links":[{
      "href": "https://github.com/ctyamashita/chat-2",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://ctyamashita.github.io/chat-2",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }],
    "front":["html5", "css3", "javascript"],
    "others":["visual_studio_code", "git"],
    "team":["Celso Takeshi Yamashita"]
  },
  {
    "title": "Speech to Text",
    "tag": "Transcript your words<br> into text",
    "img": "",
    "screenshot": "speech-to-text-screenshot.png",
    "icon": "fas fa-microphone",
    "description":[
      "Playing around with WebSpeech API. This is a simple project that is converting the audio capture through the microphone into lines of text."
    ],
    "links":[{
      "href": "https://github.com/ctyamashita/speech-to-text",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://ctyamashita.github.io/speech-to-text",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }],
    "front":["html5", "css3", "javascript"],
    "others":["visual_studio_code", "git"],
    "team":["Celso Takeshi Yamashita"]
  },
  {
    "title": "CSV Editor",
    "tag": "Vizualize tables<br> from CSV files",
    "img": "",
    "screenshot": "csv-editor-screenshot.png",
    "icon": "fa-solid fa-table",
    "description":[
      "Working with serialization and deserialization. You are able to import, vizualize, edit and export CSV files."
    ],
    "links":[{
      "href": "https://github.com/ctyamashita/csv-editor",
      "icon": "fab fa-github-square",
      "title": "Github"
    },
    {
      "href": "https://ctyamashita.github.io/csv-editor",
      "icon": "fas fa-desktop",
      "title": "Web App"
    }],
    "front":["html5", "css3", "javascript"],
    "others":["visual_studio_code", "git"],
    "team":["Celso Takeshi Yamashita"]
  }]
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
    };

    const tileConfig = {
      'spot': 7,
      'water': 7,
      'box': 7,
      'high-box': 7,
    }

    const mode = localStorage.getItem("isoView") == 'true';

    this.tileTypes = tileTypes;
    this.tileConfig = tileConfig;

    return {
      screen: { width: 100, height: 100 },
      board: { width: 7, height: 7, isoView: mode },
      player: { position: { x: 1, y: 1 } },
      tiles: {
        // key => 'row-column'
        '1-1': tileTypes.path, '1-2': tileTypes.path, '1-3': tileTypes.path, '1-4': tileTypes.path, '1-5': tileTypes.path, '1-6': tileTypes.path, '1-7': tileTypes.path,
        '2-1': tileTypes.path, '2-2': tileTypes.path, '2-3': tileTypes.path, '2-4': tileTypes.path, '2-5': tileTypes.path, '2-6': tileTypes.path, '2-7': tileTypes.path,
        '3-1': tileTypes.path, '3-2': tileTypes.path, '3-3': tileTypes.path, '3-4': tileTypes.path, '3-5': tileTypes.path, '3-6': tileTypes.path, '3-7': tileTypes.path,
        '4-1': tileTypes.path, '4-2': tileTypes.path, '4-3': tileTypes.path, '4-4': tileTypes.path, '4-5': tileTypes.path, '4-6': tileTypes.path, '4-7': tileTypes.path,
        '5-1': tileTypes.path, '5-2': tileTypes.path, '5-3': tileTypes.path, '5-4': tileTypes.path, '5-5': tileTypes.path, '5-6': tileTypes.path, '5-7': tileTypes.path,
        '6-1': tileTypes.path, '6-2': tileTypes.path, '6-3': tileTypes.path, '6-4': tileTypes.path, '6-5': tileTypes.path, '6-6': tileTypes.path, '6-7': tileTypes.path,
        '7-1': tileTypes.path, '7-2': tileTypes.path, '7-3': tileTypes.path, '7-4': tileTypes.path, '7-5': tileTypes.path, '7-6': tileTypes.path, '7-7': tileTypes.path,
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
    document.addEventListener('keydown', this.keyDownHandler);
    this.fetchProjects();
    this.generateTiles();
    this.spawnPlayer();
  },
  unmounted() {
    window.removeEventListener('resize', this.resizeHandler);
    document.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('keydown', this.keyDownHandler);
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
      })
    },
    keyUpHandler(e) {
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
      const keyPressed = e.key;
      try {
        document.querySelector(`#${keyPressed}-key`).classList.add('pressed');
      } catch (error) {
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
    isWalkable(coords) { return this.tiles[this.stringifyCoords(coords)]?.walkable },
    stringifyCoords(coords) { return Object.values(coords).join('-') },
    parseCoords(string) {
      const [x,y] = string.split('-');
      return { x: Number(x), y: Number(y) }
    },
    tileContent(coords) {
      const tile = this.tiles[this.stringifyCoords(coords)];
      const content = []
      if (this.isPlayer(coords)) content.push(`<div id="player"></div>`);
      if (this.isWalkable(coords) || tile.type == 'box' || tile.type == 'high-box') content.push('<div class="floor"><div class="floor-walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>');
      if (tile.type !== 'path' && tile.type !== 'spot') content.push(`<div class="${this.tiles[this.stringifyCoords(coords)].type}">`);
      if (tile.type == 'spot') content.push(`<a href="#" class="${this.tiles[this.stringifyCoords(coords)].type}"><i class="fas fa-solid fa-table"></i></a>`)
      if (tile.type == 'box' || tile.type == 'high box') content.push(`<div class="box-walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      if (tile.type == 'water') content.push(`<div class="surface"><div class="water-walls"><div class="r-wall"></div><div class="l-wall"></div></div>`);
      content.push(`</div>`);
      return content.join('')
    },
    fetchProjects() {
      try {
        fetch('../data/projects.json')
          .then(response => response.json())
          .then((json) => { this.projects = json });
      } catch (error) {
        console.log(error);
      }
    },
    generateTiles() {
      let tilesArray = [];

      // adding specific blocks from config
      Object.keys(this.tileConfig).forEach(type=>{
        for (let y = 0; y < this.tileConfig[type]; y++) { tilesArray.push(type) };
      });

      // filling empty spaces with path blocks
      const pathTilesCount = (this.board.width * this.board.height) - tilesArray.length;
      for (let z = 0; z < pathTilesCount; z++) { tilesArray.push('path') }

      // randomizing order
      tilesArray = tilesArray.shuffle();

      // updating tiles
      for (let y = 1; y <= this.board.height; y++) {
        for (let x = 1; x <= this.board.width; x++) {
          this.tiles[`${x}-${y}`] = this.tileTypes[tilesArray.pop()];
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
    }
  }
}).mount('#app')
