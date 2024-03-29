import { createApp } from 'vue'

createApp({
  data() {
    return {
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
  }
}).mount('#app')
