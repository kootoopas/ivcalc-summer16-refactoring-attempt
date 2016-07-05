// TODO: Convert these helper functions to a singleton class that caches accesed elements.
// Other reasons to convert:
// * setContainerId should set a private var called appContainerId to a user defined option.
// Basically, config of ivcalc should be easy by any webmaster (winthin a closure,
// maybe a script generation form would be the right way?):
// ivcalc.init({
//   appContainerId: 'legendarypokemon-calculator' // overwrite default app container id
//   ...
// });
var dom = module.exports = {};

dom.APP_CONTAINER_ID = 'calculator';

// http://www.dustindiaz.com/top-ten-javascript/
dom.$ = function () {
  var argumentsLength = arguments.length;
  var elements;
  var element;
  var i;

  if (argumentsLength === 1) {
    element = arguments[0];

    if(typeof arguments[0] === 'string') {
      // TODO: cache element
      element = document.getElementById(element);
    }

    // TODO: cache element
    return element;
  }
  else {
    elements = [];

    for (i = 0; i < argumentsLength; i++) {
      element = arguments[i];

      if(typeof arguments[i] === 'string') {
        element = document.getElementById(element);
        console.log(element);
      }

      elements.push(element);
    }

    // TODO: cache element
    return elements;
  }
};

dom.$c = function (className, node) { //Get elements by class
  var a;
  var re;
  var els;

  node = node || document.getElementById(dom.APP_CONTAINER_ID);

  if(document.getElementsByClassName) {
    return node.getElementsByClassName(className);
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
