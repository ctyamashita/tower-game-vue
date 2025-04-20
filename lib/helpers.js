
import rand from './rand.js'

export default function initializeArrayHelpers() {
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
    return size > 1 ? this.shuffle().slice(0, size) : this[rand(this.length)]
  }
}
