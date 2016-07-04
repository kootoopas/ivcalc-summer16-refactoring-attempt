// NOTE: Signleton implementation
var cookie = module.exports = {};

var _cookieCache = {};
var _cached = false;

cookie.set = function (key, value, lifetimeInDays) {
  var expires;

  //prevents security errors
	if (location.protocol === 'data:') {
    return false;
  }

  expires = '';

	if (arguments.length > 2) {
		expires = '; expires=' + (new Date().getTime() + lifetimeInDays * 24 * 60 * 60 * 1000);
	}

	document.cookie = key + '=' + value + expires + '; path=/';
  return this;
};

// variation of the following SO top answer:
// https://stackoverflow.com/questions/5639346
cookie.get = function (key) {
  var cookies;
  var cookiesLength;
  var i;
  var c;

	if (location.protocol === 'data:') {
    return false;
  }

  if(_cached) {
    return _cookieCache[key];
  }

  // NOTE: No need for trimming whitespace, '; ' always glues each "key=value" pair
  cookies = document.cookie.split('; ');
  cookiesLength = cookies.length;

	for(i = 0; i < cookiesLength; i++) {
    c = cookies[i].split('=');
    _cookieCache[c[0]] = c[1];
  }

  _cached = true;

  return _cookieCache[key];
};
