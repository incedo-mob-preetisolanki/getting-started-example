'use strict';

var shoovWebdrivercss = require('shoov-webdrivercss');

// This can be executed by passing the environment argument like this:
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=chrome mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=ie11 mocha
// PROVIDER_PREFIX=browserstack SELECTED_CAPS=iphone5 mocha

var capsConfig = {
  'chrome': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'resolution' : '1024x768'
  },
  'ie11': {
    'browser' : 'IE',
    'browser_version' : '11.0',
    'os' : 'Windows',
    'os_version' : '7',
    'resolution' : '1024x768'
  },
  'iphone5': {
    'browser' : 'Chrome',
    'browser_version' : '42.0',
    'os' : 'OS X',
    'os_version' : 'Yosemite',
    'chromeOptions': {
      'mobileEmulation': {
        'deviceName': 'Apple iPhone 5'
      }
    }
  }
};

var selectedCaps = process.env.SELECTED_CAPS || undefined;
var caps = selectedCaps ? capsConfig[selectedCaps] : undefined;

var providerPrefix = process.env.PROVIDER_PREFIX ? process.env.PROVIDER_PREFIX + '-' : '';
var testName = selectedCaps ? providerPrefix + selectedCaps : providerPrefix + 'default';

var baseUrl = process.env.BASE_URL ? process.env.BASE_URL : 'http://pages.shoov.io';

describe('Visual monitor testing', function() {

  this.timeout(99999999);
  var client = {};

  before(function(done){
    client = shoovWebdrivercss.before(done, caps);
  });

  after(function(done) {
    shoovWebdrivercss.after(done);
  });

  it('should show the static home page',function(done) {
    client
      .url(baseUrl)
      .webdrivercss(testName + '.homepage', {
        name: '1',
        exclude: [],
        remove: [
          // Hide the navbar on IE, as it's fixed.
          selectedCaps == 'ie11' ? '.navbar-fixed-top' : '',
        ],
        screenWidth: selectedCaps == 'chrome' ? [640, 960, 1200] : undefined,
      }, shoovWebdrivercss.processResults)
      .call(done);
  });

  if (selectedCaps == 'ie11') {

    it('should show the fixed navbar element',function(done) {
      client
        .url(baseUrl)
        .webdrivercss(testName + '.navbar', {
          name: '1',
          elem: '.navbar-fixed-top'
        }, shoovWebdrivercss.processResults)
        .call(done);
    });
  };


  it('should show the dynamic home page',function(done) {
    client
      .url(baseUrl + '/dynamic-page')
      .webdrivercss(testName + '.dynamic-homepage', {
        name: '1',
        exclude: [
          // Clock
          '#flip-clock .flip',
        ],
        remove: [
          // Lorem Ipsum text.
          '#dynamic-content .lorem-ipsum',

          // The carousel's indicator may change from screenshot to another
          // so it's better to remove it.
          '.carousel-indicators li',

          // Carousel caption.
          '.carousel-caption h3',

          // Hide the navbar on IE, as it's fixed.
          selectedCaps == 'ie11' ? '.navbar-fixed-top' : '',
        ],
        hide: [
          // Since the clock is flipping, we want to make sure nothing gets out
          // of the frame, but keep the space.
          '#flip-clock .flip',
          // Carousel image
          '#carousel-example-generic .item img'
        ],
        screenWidth: selectedCaps == 'chrome' ? [640, 960, 1200] : undefined,
      }, console.log)
      .call(done);
  });


});
