//
// Updates the sliders according to input values.
//
// @param { Object } input the input that shows the slider value.
//
function updateRange(input) {

  var value = input.val().replace(/\D/, "");
  input.val(value);

  var mainDiv   = input.closest('.col')[0];
  var slider    = mainDiv.children[1];
  var lowInput  = mainDiv.children[2];
  var highInput = mainDiv.children[0];
  var lowValue  = parseInt(lowInput.value);
  var highValue = parseInt(highInput.value);

  if(lowValue <= highValue) {
    lowInput.style.color  = 'black';
    highInput.style.color = 'black';

    slider.noUiSlider.set([null, highValue]);
    slider.noUiSlider.set([lowValue, null]);
  } else {
    input.context.style.color = 'red';
  }
};

//
// Handles changes on input value.
//
$(document).on('keyup', 'input[type="text"]', function() {
  updateRange($(this));
});
