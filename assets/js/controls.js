//
// Creates a range slider for RGBA colors on panel.
//
// @param { Object } the div to render the slider.
// @param { String } the slider color.
//
function createSlider(slider, color) {
  noUiSlider.create(slider, {
      start: [0, 255],
      step: 1,
      connect: true,
      direction: 'rtl',
      orientation: 'vertical',
      behaviour: 'tap-drag',
      range: {
          'min': 0,
          'max': 255
      }
  });

  var connectBar = document.createElement('div'),
  connectBase    = slider.getElementsByClassName('noUi-base')[0],
  connectHandles = slider.getElementsByClassName('noUi-origin');

  // Give the bar a class for styling and add it to the slider.
  connectBar.className += 'connect';
  connectBase.appendChild(connectBar);

  slider.noUiSlider.on('update', function( values, handle ) {

      // Pick left for the first handle, right for the second.
      var side = handle ? 'right' : 'left',
      // Get the handle position and trim the '%' sign.
          offset = (connectHandles[handle].style.left).slice(0, - 1);

      // Right offset is 100% - left offset
      if ( handle === 1 ) {
          offset = 100 - offset;
      }

      connectBar.style[side] = offset + '%';

      var mainDiv   = connectBase.parentNode.parentNode;
      var highInput = mainDiv.children[0];
      var lowInput  = mainDiv.children[2];

      highInput.value = parseInt(values[1]);
      lowInput.value  = parseInt(values[0]);

      highInput.style.color = 'black';
      lowInput.style.color  = 'black';
  });

  connectBase.children[0].className += ' ' + color;
}

//
// Creates the RGBA panel's sliders.
//
function createSliders() {
  var controls = document.getElementsByClassName('controls');
  var cards    = controls[0].getElementsByClassName('card');
  var card     = cards[cards.length -1];
  var sliders  = card.getElementsByClassName('sliders');
  var colors   = ['red', 'green', 'blue', 'alpha'];

  for ( var i = 0; i < sliders.length; i++ ) {
    createSlider(sliders[i], colors[i]);
  }
}

//
// Adds a button to remove the RGBA panel.
//
function addRemoveButton() {
  var controls = document.getElementsByClassName('controls');
  var cards    = controls[0].children.length;

  var button       = document.createElement('a');
  button.className = "right btn-floating btn-large waves-effect waves-light red remove-rgba";

  var icon       = document.createElement('i');
  icon.className = "material-icons";
  icon.innerHTML = 'close';

  button.appendChild(icon);

  controls[0].children[cards - 1].appendChild(button);
}

//
// Requests the RGBA controls.
//
// @param { Boolean } withRemoveButton if should add a button
//                    to remove the control or not.
//
function getControls(withRemoveButton) {
  $.get('partials/controls.html', function(data){
    $('.controls').append(data);
  })
  .done(function(){
    createSliders();

    if(withRemoveButton) {
      addRemoveButton();
    }

  });
}

//
// Removes a specific RGBA panel.
//
// @param { Object } btn the clicked button.
//
function removeRGBAPanel(btn) {
  btn.context.parentNode.remove();
}

//
// Handles the button click to add an RGBA panel.
//
$('#add').on('click', function() {
  var withRemoveButton = true;
  getControls(withRemoveButton);
});

//
// Handles the button click to remove RGBA panel.
//
$(document).on('click', '.remove-rgba', function() {
  removeRGBAPanel($(this));
})

getControls();
