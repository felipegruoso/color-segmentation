showRange = function(input) {
  var output_id = input.attr('name');
  var parent    = input.closest('#control');

  parent.find('#' + output_id).val(input.val());
};

updateRange = function(output) {
  var input_id = output.attr('name');
  var parent   = output.closest('#control');
  var value    = output.val().replace(/\D/, "");

  parent.find('#' + input_id).val(value);
  output.val(value);
};

$(document).on('change', 'input[type="range"]', function() {
  showRange($(this));
});

$(document).on('keyup', 'input[type="text"]', function() {
  updateRange($(this));
});
