var events = module.exports = {};

// original functions source: http://www.dustindiaz.com
events.add = function (obj, type, fn) {
	if (obj.addEventListener) {
    obj.addEventListener(type, fn, false);
  }
	else if (obj.attachEvent) {
		obj['e' + type + fn] = fn;
		obj.attachEvent( 'on' + type, function() {
      obj['e' + type + fn]();
    });
	}
};

// NOTE: This is function never used actually.
events.delete = function (obj, type, fn) {
	if (obj.removeEventListener) {
    obj.removeEventListener(type, fn, false);
  }
	else if (obj.detachEvent) {
		obj.detachEvent('on' + type, obj['e' + type + fn]);
		obj['e' + type + fn] = null;
	}
};
