export const Tile = {
  // Create a component like you normally would
  props: {
    tileData: Object,
    isPlayer: Boolean
  },

  // Use the template property instead of a template block
  template: `
    ${ isPlayer ? '<div id="player"></div>' : '' }
    ${ (tileData.walkable || tileData.type.includes('box')) ? '<div class="floor"><div class="floor-walls"><div class="r-wall"></div><div class="l-wall"></div></div></div>' : ''}
    ${ !['path', 'spot'].includes(tileData.type) ? '' : ''}
  `
};
