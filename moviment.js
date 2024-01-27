// Rand method
const rand = (size) => {
  return Math.floor(Math.random() * size);
}

// Sample method
Array.prototype.sample = function(size) {
  if (size > 1) {
    return this.shuffle().slice(0, size)
  } else {
    return this[rand(this.length) - 1]
  }
}

// close modal
const closeModal = () => {
  document.querySelector('.expand').classList.remove('expand')
}

let mode = localStorage.getItem("mode") || '2D';

// imgs for box
const wallImages = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'];

const wallText = ['武', '山', '下', 'C', 'T', 'Y'];

const convertToTag = (array) => {
  return array.map((string) => `<img src="https://img.shields.io/badge/${string}-444c55?style=for-the-badge&logo=${string}&logoColor=white" alt="${string}" class="my-1"/>`).join('\n')
}

const createLinkBtn = (links) => {
  return links.map((link) => `<a href="${link.href}" target="_blank" class="btn-cty"><i class="${link.icon} icon-modal"></i>${link.title}</a>`).join('')
}

const generateModalContent = (props) => {
  return `<div class="modal-content-cty">
    <div class="modal-header-cty bg-dark">
      <h4 class="modal-title text-white"><i class="fas ${props.icon}"></i>${props.title.replaceAll('<br>', ' ')}</h4>
      <button type="button" class="btn-close-white" aria-label="Close" onclick="closeModal()"><i class="fas fa-times-circle"></i></button>
    </div>
    <div class="modal-body">
      <img src="images/${props.screenshot}" alt="screenshots" class="w-100">
      <div class="description">
        ${props.description.map((string) => `<p>${string}</p>`).join('')}
      </div>
      <div class="tools">
        <p><strong>Tools and languages:</strong></p>
        <ul class="list-inline">
            ${props.front ? `<li><strong> Front-end: </strong>${convertToTag(props.front)}</li>` : ''}
            ${props.back ? `<li><strong> Back-end: </strong>${convertToTag(props.back)}</li>` : ''}
            ${props.others ? `<li><strong> Others: </strong>${convertToTag(props.others)}</li>` : ''}
        </ul>
      </div>
      <div class="members">
        ${ props.team.length > 1 ? '<p><strong>Team Members:</strong></p>' : '<p><strong>Created by:</strong></p>'}
        <ul class="list-inline">
          ${props.team.map((string) => `<li>${string}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="modal-footer-cty bg-dark">
      ${createLinkBtn(props.links)}
    </div>
  </div>`
}

// list of objects
const obj = {
  'height': 7,
  // 'width': 7,
  'place': 8,
  'disk': 1,
  'box': 3,
  'carpet': 3,
  'hole':1
}

// Board Size
// let [height, width] = [obj['width'], obj['height']];

let availableTiles;

// setting inputs
const inputContainer = document.createElement('div');
inputContainer.classList.add('input-container');
inputContainer.classList.add('hide');
const inputs = document.createElement('div');
inputs.classList.add('inputs');

const addInputs = (type, quantity) => {
  const typeInput = document.createElement('input');
  const typeLabel = document.createElement('label');
  typeLabel.for = type;
  typeLabel.innerText = type;
  if (type == 'height') typeLabel.innerText = 'size';
  typeInput.id = type;
  typeInput.value = quantity
  typeInput.type = 'number';
  typeInput.onchange = () => {
    const newValue =  Number(document.querySelector(`#${type}`).value);
    obj[type] = newValue;
    updateBoard();
  }

  inputs.append(typeLabel);
  inputs.append(typeInput);
}

inputContainer.append(inputs);
document.body.append(inputContainer);

// Mode button
const modeBtn = document.createElement('div');
const modeBtnTop = document.createElement('div');
const modeBtnLeft = document.createElement('div');
const sideContainer = document.createElement('div');
const modeBtnRight = document.createElement('div');

modeBtn.classList.add('mode');
if (mode == '2D') modeBtn.classList.add('flat');
modeBtnRight.innerText = mode == '3D' ? '3D' : '2D'

modeBtn.onclick = () => {
  const el = document.querySelector('.box-right-btn');
  document.querySelector('.board-container').classList.toggle('flat');
  document.querySelector('.mode').classList.toggle('flat');
  el.innerText = el.innerText == '3D' ? '2D' : '3D';
  localStorage.setItem("mode", el.innerText);

  const player = document.querySelector('.player');
  const places = document.querySelectorAll('.place');

  // player.parentElement.style.opacity = 0;
  player.style.opacity = 0;
  places.forEach(place => {
    place.parentElement.style.background = 'transparent';
    place.style.opacity = 0;
    place.nextElementSibling.style.opacity = 0;
  });
  setTimeout(() => {
    // player.parentElement.style.opacity = 1;
    player.style.opacity = 1;
    places.forEach(place => {
      place.parentElement.style.background = 'radial-gradient(white 5%, rgba(255,255,255,0.3) 28%, transparent 70%)';
      place.style.opacity = 1;
      place.nextElementSibling.style.opacity = 1;
    });
  }, 2700);
};
modeBtnTop.classList.add('box-top-btn');
modeBtnRight.classList.add('box-right-btn');
modeBtnLeft.classList.add('box-left-btn');

sideContainer.classList.add('box-side-container');
sideContainer.append(modeBtnLeft);
sideContainer.append(modeBtnRight);

modeBtn.append(modeBtnTop);
modeBtn.append(sideContainer);

document.body.append(modeBtn);

//bg modal
const bg = document.createElement('div');
bg.classList.add('bg');
document.body.append(bg);

const generateBoard = () => {
  const board = document.createElement('table');
  const height = obj['height'];
  const width = obj['width'] || obj['height'];

  for (let y = 1; y <= height; y++) {
    const row = document.createElement('tr');
    const fixedY = 1 + height - y

    for (let x = 1; x <= width; x++) {
      const tile = document.createElement('td');
      if (window.screen.height < window.screen.width) {
        tile.style.width = `${80/width}vh`
        tile.style.height = `${80/width}vh`
      } else {
        tile.style.width = `${80/height}vw`
        tile.style.height = `${80/height}vw`
      }
      const container = document.createElement('div');
      const fixedX = 1 + width - x;
      container.setAttribute('class', `coord-${fixedX}-${fixedY}`);
      tile.style.zIndex = y - x + (width);
      tile.append(container);
      row.append(tile);
    }
    board.append(row)
  }
  const boardContainer = document.createElement('div');
  boardContainer.classList.add('board-container');
  boardContainer.append(board);

  const wall = document.createElement('div');
  const wallRight = document.createElement('div');
  const wallLeft = document.createElement('div');
  wallLeft.classList.add('wall-left');
  wallRight.classList.add('wall-right');
  wall.classList.add('wall-container');

  wall.append(wallLeft);
  wall.append(wallRight);

  boardContainer.appendChild(wall);
  document.body.append(boardContainer);
  // All tiles
  availableTiles = Array.from(document.querySelectorAll('td'));

  // adding player
  addToBoard('player');
}

window.onresize = () => {
  const tiles = document.querySelectorAll('td');
  const height = obj['height'];
  const width = obj['width'];
  if (window.innerHeight < window.innerWidth) {
    tiles.forEach((tile) => {
      tile.style.width = `${80/width}vh`
      tile.style.height = `${80/width}vh`
    })
  } else {
    tiles.forEach((tile) => {
      tile.style.width = `${80/height}vw`
      tile.style.height = `${80/height}vw`
    })
  }
}

// Add object to board at random location

// Helper
const addToBoard = (thing) => {
  const index = rand(availableTiles.length);
  let randomCoord = availableTiles.splice(index, 1);
  // console.log(randomCoord, availableTiles);
  // if (randomCoord.length == 0) randomCoord = [availableTiles.pop()];

  const objEl = randomCoord[0].firstChild

  if (thing == 'place') {
    objEl.classList.add(thing);
    objEl.setAttribute('tabindex', 0)
    const projectObj = projectsContent.pop();
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerHTML = `<i class="fas ${projectObj.icon}"></i>`;
    objEl.parentElement.append(bubble);
    const modal = document.createElement('div');
    modal.classList.add(objEl.classList[0].replace('coord-',''));
    modal.classList.add('modal');
    modal.innerHTML = generateModalContent(projectObj);
    document.body.append(modal);
    bubble.onclick = () => { modal.classList.toggle('expand') };
    objEl.onclick = () => { modal.classList.toggle('expand') };
  } else if (thing == 'box') {
    objEl.classList.add(thing);
    const wallLeft = document.createElement('div');
    const wallRight = document.createElement('div');
    const boxCeiling = document.createElement('div');
    wallLeft.classList.add('l-wall');
    wallRight.classList.add('r-wall');
    if (rand(100) > 70) {
      wallLeft.style.background = `url(images/img-${wallImages.sample()}.png) aliceblue`;
    } else if (rand(100) > 70) {
      wallRight.style.background = `url(images/img-${wallImages.sample()}.png) powderblue`;
    } else if (rand(100) > 70) {
      boxCeiling.innerText = wallText.sample();
    }
    boxCeiling.classList.add('ceiling-box');
    objEl.parentElement.append(boxCeiling);
    objEl.append(wallLeft);
    objEl.append(wallRight);
  } else if (thing == 'carpet') {
    const carpet = document.createElement('div');
    const carpetBase = document.createElement('div');
    carpet.classList.add('carpet');
    carpetBase.classList.add('carpet-base');
    objEl.parentElement.append(carpet);
    objEl.parentElement.append(carpetBase);
  } else if (thing == 'hole') {
    objEl.classList.add(thing);
    const bg = document.createElement('div');
    objEl.append(bg);
  } else {
    objEl.classList.add(thing);
  }
}

const updateBoard = () => {
  const previousBoard = document.querySelector('.board-container');
  if (previousBoard) previousBoard.remove();
  const previousModals = document.querySelectorAll('.modal');
  if (previousModals) previousModals.forEach(modal=> modal.remove());

  fetch('./data/projects.json')
  .then(response => response.json())
  .then((json) => {
    json.forEach(proj => projectsContent.push(proj))
    generateBoard();
    const newBoard = document.querySelector('.board-container');
    mode = localStorage.getItem("mode");
    if (mode == '2D') newBoard.classList.add('flat');
    for (const [key,value] of Object.entries(obj)) {
      if (!(key === 'height' || key === 'width')) {
        for (let times = 0; times < value; times++) {
          addToBoard(key);
        }
      }
    }
  });

}

let projectsContent = []

  updateBoard();

for (const [key,value] of Object.entries(obj)) {
  addInputs(key, value);
}


const walkableTile = (x,y) => {
  const tile = document.querySelector(`.coord-${x}-${y}`)
  return !tile.classList.contains('disk') && !tile.classList.contains('box') && !tile.classList.contains('hole')
}

// Controls
document.addEventListener('keyup', (e) => {
  const currentPosition = document.querySelector('.player');
  let [x, y] = currentPosition.classList[0].split('-').slice(1).map(num => Number(num));
  const height = obj['height'];
  const width = obj['width'] || obj['height'];

  if (currentPosition.classList.contains('place')) {
    // click if enter or space
    if (e.key == 'Enter' || e.code == 'Enter' || e.key == ' ' || e.code == 'Space' ) {
      currentPosition.nextElementSibling.click();
    } else if (['w', 'ArrowUp','s', 'ArrowDown','a', 'ArrowLeft','d', 'ArrowRight', 'Escape'].includes(e.key)) {
      document.querySelectorAll(`.modal`).forEach(modal => modal.classList.remove('expand'));
    }
  }

  // check if it's allowed to move to coord
  if (x >= 1 && x <= width && y >= 1 && y <= height && document.activeElement.tagName != "INPUT") {
    currentPosition.classList.remove('player');
    if (['w', 'ArrowUp'].includes(e.key) && y < height && walkableTile(x, y + 1)) y += 1
    if (['s', 'ArrowDown'].includes(e.key) && y > 1  && walkableTile(x, y - 1)) y -= 1
    if (['d', 'ArrowRight'].includes(e.key) && x > 1  && walkableTile(x - 1, y)) x -= 1
    if (['a', 'ArrowLeft'].includes(e.key) && x < width  && walkableTile(x + 1, y)) x += 1
    document.querySelector(`.coord-${x}-${y}`).classList.add('player');
  }
});

// display controls
const wKey = document.createElement('div');
wKey.innerHTML = '<p>W</p>';
wKey.classList.add('w-key')

const aKey = document.createElement('div');
aKey.innerHTML = '<p>A</p>';
aKey.classList.add('a-key')

const sKey = document.createElement('div');
sKey.innerHTML = '<p>S</p>';
sKey.classList.add('s-key')

const dKey = document.createElement('div');
dKey.innerHTML = '<p>D</p>';
dKey.classList.add('d-key')


const keysContainer = document.createElement('div');
keysContainer.classList.add('key-container');

const firstRow = document.createElement('div');
firstRow.append(wKey)

keysContainer.append(firstRow);
keysContainer.append(aKey);
keysContainer.append(sKey);
keysContainer.append(dKey);

document.body.append(keysContainer);

wKey.onkeyup = (e) => {
  if (e.key == 'w') {
    wKey.style.border = 'none';
  }
}

document.addEventListener('keydown', (e) => {
  let keyPressed = e.key;
  if ('ArrowUp' == e.key) keyPressed = 'w';
  if ('ArrowDown' == e.key) keyPressed = 's';
  if ('ArrowLeft' == e.key) keyPressed = 'a';
  if ('ArrowRight' == e.key) keyPressed = 'd';

  if (['w','a','s','d'].includes(keyPressed)) {
    const keyEl = document.querySelector(`.${keyPressed}-key`);
    keyEl.style.opacity = 1;
    keyEl.style.scale = .9;
    keyEl.style.background = 'dimgray'
  }
});

document.addEventListener('keyup', (e) => {
  let keyPressed = e.key;
  if ('ArrowUp' == e.key) keyPressed = 'w';
  if ('ArrowDown' == e.key) keyPressed = 's';
  if ('ArrowLeft' == e.key) keyPressed = 'a';
  if ('ArrowRight' == e.key) keyPressed = 'd';

  if (['w','a','s','d'].includes(keyPressed)) {
    const keyEl = document.querySelector(`.${keyPressed}-key`);
    keyEl.style.opacity = .7;
    keyEl.style.scale = '1';
    keyEl.style.background = 'transparent'
  }

  if (keyPressed == 'i' && e.ctrlKey) {
    document.querySelector('.input-container').classList.toggle('hide');
  }
});

keysContainer.addEventListener('click', (e) => {
  console.log(e.target)
  const currentPosition = document.querySelector('.player');
  let [x, y] = currentPosition.classList[0].split('-').slice(1).map(num => Number(num));
  const height = obj['height'];
  const width = obj['width'] || obj['height'];

  if (x >= 1 && x <= width && y >= 1 && y <= height && document.activeElement.tagName != "INPUT") {
    currentPosition.classList.remove('player');
    if (e.target.innerText == 'W' && y < height && walkableTile(x, y + 1)) y += 1
    if (e.target.innerText == 'S' && y > 1  && walkableTile(x, y - 1)) y -= 1
    if (e.target.innerText == 'D' && x > 1  && walkableTile(x - 1, y)) x -= 1
    if (e.target.innerText == 'A' && x < width  && walkableTile(x + 1, y)) x += 1
    document.querySelector(`.coord-${x}-${y}`).classList.add('player');
  }
})
