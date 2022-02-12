// TODO: technically this isn't a color palette, it maps the datamodel to colors
// not yet sure how colors will be stored. fixed set, or full hexadecimal?
const colorMap = {
  0: '#FFFFFF', // white
  1: '#000000', // black
  2: '#FF0000', // red
  3: '#00FF00', // green
  4: '#0000FF', // blue
};

const reverseColorMap = Object.entries(colorMap).reduce((reverseColorMap, [key, value]) => {
  reverseColorMap[value] = parseInt(key);
    return reverseColorMap;
}, {});

export { colorMap, reverseColorMap }
