var should = require('should');
var UriBeacon = require('../lib/uribeacon.js');

describe('UriBeacon', function() {
  var flags = 0;
  var txPower = 0xEE;
  
  var url = 'https://www.uribeacon.org/test';
  var expected = Buffer.concat([
      new Buffer([0x03,0x03,0xd8,0xfe,0x16,0x16,0xd8,0xfe,0x00,0xEE]),
      Buffer.concat([
        new Buffer([0x01]),
        new Buffer('uribeacon'),
        new Buffer([0x01]),
        new Buffer('test')
      ])
      ]).toString('hex');


  it('should create a valid uribeacon', function() {
    var uribeacon = new UriBeacon(url, flags, txPower);

    uribeacon.uri.should.equal(url);
    console.log();
    console.log(expected);
    console.log(uribeacon.toByteArray().toString('hex'));
  });

});
