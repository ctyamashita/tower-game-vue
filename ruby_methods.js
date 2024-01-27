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
