var createSlider = function(slider, color) {
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
  });

  connectBase.children[0].className += ' ' + color;
}

var loadSliders = function(){
  var controls = document.getElementsByClassName('controls');
  var cards    = controls[0].getElementsByClassName('card');
  var card     = cards[cards.length -1];
  var sliders  = card.getElementsByClassName('sliders');
  var colors   = ['red', 'green', 'blue', 'alpha'];

  for ( var i = 0; i < sliders.length; i++ ) {
    createSlider(sliders[i], colors[i]);
  }
}

var getControls = function(){
  $.get('partials/controls.html', function(data){
    $('.controls').append(data);
  })
  .done(function(){
    loadSliders();
  });
}

getControls();