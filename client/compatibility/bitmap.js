// Class containing image data
function image(w, h) {
  this.header = '';
  this.data = Array();
  this.width = w;
  this.height = h;
}

// Convert a value to a little endian hexadecimal value
function getLittleEndianHex(value) {
  var result = [];

  for (var bytes = 4; bytes > 0; bytes--) {
    result.push(String.fromCharCode(value & 255));
    value >>= 8;
  }

  return result.join('');
}

// Set the required bitmap header
function setImageHeader(img) {
  var numFileBytes = getLittleEndianHex(img.width * img.height);
  var w = getLittleEndianHex(img.width);
  var h = getLittleEndianHex(img.height);

  img.header =
    'BM' + // Signature
  numFileBytes + // size of the file (bytes)*
  '\x00\x00' + // reserved
  '\x00\x00' + // reserved
  '\x36\x00\x00\x00' + // offset of where BMP data lives (54 bytes)
  '\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
  w + // the width of the bitmap in pixels*
  h + // the height of the bitmap in pixels*
  '\x01\x00' + // the number of color planes (1)
  '\x20\x00' + // 32 bits / pixel
  '\x00\x00\x00\x00' + // No compression (0)
  '\x00\x00\x00\x00' + // size of the BMP data (bytes)*
  '\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
  '\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
  '\x00\x00\x00\x00' + // Number of colors in the palette (keep 0 for 32-bit)
  '\x00\x00\x00\x00'; // 0 important colors (means all colors are important)
}


