var dom = module.exports = {};

function _autocompleteMatchSearch(inputElement, selectElement, optionsLength, forceMatch) {
  var i;

  for (i = 0; i < optionsLength; i++) {
    if (selectElement.options[i].text.toUpperCase().indexOf(inputElement.value.toUpperCase()) === 0) {
      return i;
    }
  }

  if (forceMatch) {
		inputElement.value = inputElement.value.slice(0, inputElement.value.length - 1);
		_autocompleteMatchSearch(inputElement, selectElement, optionsLength, forceMatch);
	}

  return 0;
}

dom.autocomplete = function (inputElement, selectElement, forceMatch) { // <input/> -> <select>
  var matchingOptionIndex;
  var optionsLength = selectElement.options.length;

  matchingOptionIndex = _autocompleteMatchSearch(inputElement, selectElement, optionsLength, forceMatch);

  selectElement.selectedIndex = matchingOptionIndex;
};


dom.toggle = function (element) {
    element.style.display = (element.style.display === '')? 'none' : '';
};
