class Board {
  constructor(document, height, width) {
    this.height = height;
    this.width = width;
    this.document = document;

    const board = document.createElement('table');

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
        tile.style.order = (width + height) - y - x;
        tile.append(container);
        row.append(tile);
      }
      board.append(row)
    }
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('board-container');
    boardContainer.append(board);
    document.body.append(boardContainer);
    // All tiles
    availableTiles = Array.from(document.querySelectorAll('td'));

    // adding player
    add('player', rand(width), rand(width));
  }

  get tiles() {
    return height * width;
  }

  add(thing, x, y) {
    const document = this.document;
    const coordsEl = document.querySelector(`coord-${x}-${y}`);
    coordsEl.classList.add(thing);
    switch (thing) {
      case 'place':
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.innerHTML = 'Bubble test';
        coordsEl.parentElement.append(bubble);
        const modal = document.createElement('div');
        modal.classList.add(coordsEl.classList[0].replace('coord-',''));
        modal.classList.add('modal');
        document.body.append(modal);
        bubble.onclick = () => { modal.classList.toggle('expand') };
        break;
      case 'box':
        const wallLeft = document.createElement('div');
        const wallRight = document.createElement('div');
        const boxCeiling = document.createElement('div');
        wallLeft.classList.add('l-wall');
        wallRight.classList.add('r-wall');
        boxCeiling.classList.add('ceiling-box');
        coordsEl.parentElement.append(boxCeiling);
        coordsEl.append(wallLeft);
        coordsEl.append(wallRight);
        break;
      case 'carpet':
        coordsEl.classList.remove(thing);
        const carpet = document.createElement('div');
        carpet.classList.add('carpet');
        coordsEl.parentElement.append(carpet);
        break;
      default:
        console.log('invalid object');
    }
  }
}


// new Board(2,2)
