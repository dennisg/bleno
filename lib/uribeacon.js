
var URI_SCHEMES = [

    "http://www.",
    "https://www.",
    "http://",
    "https://",
    "urn:uuid:"
];
  
URL_CODES = [
    ".com/",
    ".org/",
    ".edu/",
    ".net/",
    ".info/",
    ".biz/",
    ".gov/",
    ".com",
    ".org",
    ".edu",
    ".net",
    ".info",
    ".biz",
    ".gov"
];

var URI_SERVICE_UUID = "0000FED8-0000-1000-8000-00805F9B34FB";
var NO_TX_POWER_LEVEL = -101;
var NO_FLAGS = 0;
var NO_URI = "";
var DATA_TYPE_SERVICE_DATA = 0x16;
var URI_SERVICE_16_BIT_UUID_BYTES = new Buffer([0xd8, 0xfe]);

var FLAGS_FIELD_SIZE = 3;
var URI_SERVICE_FLAGS_TXPOWER_SIZE = 2;
var URI_SERVICE_UUID_FIELD = new Buffer([0x03, 0x03, 0xD8, 0xFE]);
var URI_SERVICE_DATA_FIELD_HEADER = new Buffer([0x16, 0xD8, 0xFE]);
var MAX_ADVERTISING_DATA_BYTES = 31;
var MAX_URI_LENGTH = 18;


var encodeUriScheme = function(uri) {
    var lowerCaseUri = uri.toLowerCase();
    for (var i = 0; i < URI_SCHEMES.length; i++) {
      var value = URI_SCHEMES[i];
      if (lowerCaseUri.indexOf(value) === 0) {
        return i;
      }
    }
    return null;
};

var isNetworkUrl = function(scheme) {
   return scheme.indexOf('h') === 0;
};

var findLongestExpansion = function(uriString, pos) {
    for (var i = 0; i < URL_CODES.length; i++) {
      var value = URL_CODES[i];
      if (uriString.substr(pos).indexOf(value) === 0) {
        return i;
      }
    }
    return -1;
};

var encodeUrl = function(url, position, bb) {
    var i = 0;
    while (position < url.length) {
      console.log(url.substr(position));

      var expansion = findLongestExpansion(url, position);
      if (expansion >= 0) {
        bb[i++] = expansion;
        position += URL_CODES[expansion].length;
      } else {
        bb[i++] = url.charAt(position++);
      }
    }
    return bb;
};


var totalBytes = function(uriString) {
    var encodedUri = encodeUri(uriString);

    if (encodedUri === null) {
      return 0;
    }

    var size = URI_SERVICE_UUID_FIELD.length;
    size += 1; // length is one byte
    size += URI_SERVICE_DATA_FIELD_HEADER.length;
    size += 1; // flags is one byte.
    size += 1; // tx power level value is one byte.
    size += encodedUri.length;
    return size;
};

var toByteArray = function() {
    //var totalUriBytes = totalBytes(this.uri);

    //if (totalUriBytes === 0) {
    //  return null;
    //}

    var uriBytes = encodeUri(this.uri);
    console.log(uriBytes.toString('hex'));
    var length = URI_SERVICE_DATA_FIELD_HEADER.length + URI_SERVICE_FLAGS_TXPOWER_SIZE + uriBytes.length;

    var buffer = Buffer.concat([
      URI_SERVICE_UUID_FIELD, 
      new Buffer([length]),
      URI_SERVICE_DATA_FIELD_HEADER,
      new Buffer([this.flags, this.txPower]),
      uriBytes
    ]);

    return buffer;
};

var encodeUri = function(uri) {
    if (uri.length === 0) {
      return new Buffer(0);
    }

    var bb = new Buffer(uri.length);

    // UUIDs are ordered as byte array, which means most significant first
    //bb.order(ByteOrder.BIG_ENDIAN);
    var position = 0;

    // Add the byte code for the scheme or return null if none
    var schemeCode = encodeUriScheme(uri);

    if (schemeCode === null) {
      return null;
    }

    bb[0] = schemeCode;
    var scheme = URI_SCHEMES[schemeCode];
    position += scheme.length;


    if (isNetworkUrl(scheme)) {
      return encodeUrl(uri, position, bb);
    //} else if ("urn:uuid:".equals(scheme)) {
    //  return encodeUrnUuid(uri, position, bb);
    }
    return null;
};


var UriBeacon = function(uri, flags, txPower) {
    this.uri = uri;
    this.flags = flags;
    this.txPower = txPower;
    console.log(this.uri);
    this.toByteArray = toByteArray.bind(this);
};

module.exports = UriBeacon;

