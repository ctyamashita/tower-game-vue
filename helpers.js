// Rand method
const rand = (size) => {
  return Math.floor(Math.random() * size);
}

// Times method
Number.prototype.times = function(yield) {
  for (let index = 0; index < this; index++) {
    yield();
  }
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


// Sample method
Array.prototype.sample = function(size) {
  if (size > 1) {
    return this.shuffle().slice(0, size)
  } else {
    return this[rand(this.length)]
  }
}

// Select method
Array.prototype.select = function(yield) {
  return this.filter(el=> yield(el));
}

// Find method


const arrNumb = [1,2,3,4,5];

// console.log(rand(5));

// console.log([1,2,3,4,5].sample(1))

// console.log([1,2,3,4,5].shuffle())

// console.log([1,2,3,4,5].select(el=>el>2))

// Number(2).times(()=>console.log('a'))
