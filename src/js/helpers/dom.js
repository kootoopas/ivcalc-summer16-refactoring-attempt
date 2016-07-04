var IVCALC_CONTAINER_ID = require('../lib/constants').IVCALC_CONTAINER_ID;

// TODO: Convert these helper functions to a class that caches accesed elements.
var dom = module.exports = {};

// http://www.dustindiaz.com/top-ten-javascript/
dom.$ = function () {
  var argumentsLength = arguments.length;
  var elements;
  var element;
  var i;

  if (argumentsLength === 1) {
    element = arguments[0];

    if(typeof arguments[0] === 'string') {
      element = document.getElementById(element);
    }

    return element;
  }
  else {
    elements = [];

    for (i = 0; i < argumentsLength; i++) {
      element = arguments[i];

      if(typeof arguments[0] === 'string') {
        element = document.getElementById(element);
      }

      elements.push(element);
    }

    return elements;
  }
};

dom.$c = function (className, node) { //Get elements by class
  var a;
  var re;
  var els;
  node = node || document.getElementById(IVCALC_CONTAINER_ID);

  if(document.getElementsByClassName) {
    return node.getElementsByClassName();
  }

	a = [];
	re = new RegExp('\\b' + className + '\\b');
	els = node.getElementsByTagName('*');

	for(var i=0, j=els.length; i<j; i++) {
		if(re.test(els[i].className)) {
      a.push(els[i]);
    }
  }
	return a;
};

// get_text, $ and such functions go here
