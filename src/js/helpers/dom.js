// TODO: Convert these helper functions to a class that caches accesed elements.
var dom = module.exports = {};

// http://www.dustindiaz.com/top-ten-javascript/
dom.$ = function () {
	var elements = [];
  var argumentsLength = arguments.length;
  var i;

	for (i = 0; i < argumentsLength; i++) {
		var element = arguments[i];

		if (typeof element === 'string') {
			element = document.getElementById(element);
    }

		if (argumentsLength === 1) {
      return element;
    }

		elements.push(element);
	}
	return elements;
};

dom.$c = function (className, node) { //Get elements by class
  var a;
  var re;
  var els;
  node = node || document.getElementsByTagName('body')[0];

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
