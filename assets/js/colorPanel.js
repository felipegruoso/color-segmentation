//
// Updates the sliders according to input values.
//
// @param { Object } output the input that shows the slider value.
//
updateRange = function(output) {

  var value = output.val().replace(/\D/, "");
  output.val(value);

  var mainDiv    = output.closest('.col')[0];
  var slider     = mainDiv.children[1];
  var lowOutput  = mainDiv.children[2];
  var highOutput = mainDiv.children[0];
  var lowValue   = parseInt(lowOutput.value);
  var highValue  = parseInt(highOutput.value);

  if(lowValue <= highValue) {
    lowOutput.style.color  = 'black';
    highOutput.style.color = 'black';

    slider.noUiSlider.set([null, highValue]);
    slider.noUiSlider.set([lowValue, null]);
  } else {
    output.context.style.color = 'red';
  }
};

//
// Handles changes on input value.
//
$(document).on('keyup', 'input[type="text"]', function() {
  updateRange($(this));
});
