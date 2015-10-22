//
// Initializes an Hash to hold the uploaded images.
//
var images  = {};

//
// Removes a specific image card.
//
// @param { Object } btn the clicked button.
//
function removeCard(btn) {
  id = btn.context.dataset['id'];
  delete images[id];
  btn.closest('.card-panel').remove();
}

//
// Checks ths input files.
//
// @param { Object }   input the input.
// @param { Function } callback the callback function to be executed
//                     after the process ends.
//
function checkImageInputs(input, callback) {
  var fileInputs = input[0];
  var left       = fileInputs.files.length;

  for (var i = 0; i < fileInputs.files.length; i++) {
    var fr = new FileReader();
    fr.onload = function(e) {
      var img       = document.createElement('img');
      img.src       = e.target.result;
      img.className = 'file-result';

      md5Image = CryptoJS.MD5(img.src);

      if(!images[md5Image]) {
        images[md5Image] = {
          height: img.height,
          width:  img.width,
          data:   img
        }
      }

      left--;
      if(!left) {
        setTimeout(function() {
          callback(images);
        }, 1000);
      }
    }
    fr.readAsDataURL(fileInputs.files[i]);
  }
}

//
// Adds the new images to screen ignoring duplicated images.
//
// @param { Object } images an array of images from input.
//
function addOnScreen(images){

  for(var key in images) {
    var image  = images[key];
    var id     = 'canvas-' + key;
    var canvas = document.getElementById(id)

    if(canvas == null) {

      var cardWidth;
      if((image['width'] + 40) < 95) {
          cardWidth = '95px'
      } else {
        cardWidth = image['width'] + 40 + 'px'
      }

      var card          = document.createElement('div');
      card.className    = 'card-panel center-align';
      card.style.width  = cardWidth;
      card.style.height = image['height'] + 90 + 'px';

      var divDel         = document.createElement('div');
      divDel.style.width = '100%';

      var btnDel       = document.createElement('a');
      btnDel.className = 'btn-floating btn-large waves-effect waves-light red remove-card';
      btnDel.setAttribute("data-id", key);

      var iconDel       = document.createElement('i');
      iconDel.className = 'material-icons';
      iconDel.innerHTML = 'close';

      btnDel.appendChild(iconDel);
      divDel.appendChild(btnDel);

      var canvas    = document.createElement('canvas');
      canvas.id     = id;
      canvas.width  = image['width'];
      canvas.height = image['height'];

      var context = canvas.getContext("2d");
      context.drawImage(image['data'], 0, 0);

      // Saves the image data to avoid creating new canvas on future.
      images[key]['data'] = context.getImageData(0, 0, canvas.width, canvas.height);

      card.appendChild(canvas);
      card.appendChild(divDel);
      document.getElementById('content').appendChild(card);
    }

  }

}

//
// Segments the images by the given colors.
//
// @param { Object } rgbas an array containing the RGBA colors intervals.
// @param { Object } fillingColor an array containing an unique RGBA color
//                   that will be used to fill the intervals matches.
// @param { Object } backgroundColor an array containint an unique RGBA color
//                   that will be used to fill the background.
//
function segmentImages(rgbas, matchColor, backgroundColor) {

  for(var key in images) {
    var image     = images[key];
    console.log(image);
    var imageData = images[key]['data'];

    var img     = document.getElementById('canvas-' + key)
    var context = img.getContext('2d');

    var fillingColor;

    for(var x = 0; x < image['width']; x++) {
      for(var y = 0; y < image['height']; y++){

        var index = (y * imageData.width + x) * 4;
        var red   = imageData.data[index];
        var green = imageData.data[index + 1];
        var blue  = imageData.data[index + 2];
        var alpha = imageData.data[index + 3];
        var pixel = [red, green, blue, alpha];

        var id        = context.createImageData(1,1);
        var new_pixel = id.data;

        if(matchColor == null) {
          fillingColor = pixel;
        } else {
          fillingColor = matchColor;
        }

        var statement = createStatement(rgbas, pixel);

        if(eval(statement)) {
          new_pixel[0] = fillingColor[0];
          new_pixel[1] = fillingColor[1];
          new_pixel[2] = fillingColor[2];
          new_pixel[3] = fillingColor[3];
        } else {
          new_pixel[0] = backgroundColor[0];
          new_pixel[1] = backgroundColor[1];
          new_pixel[2] = backgroundColor[2];
          new_pixel[3] = backgroundColor[3];
        }
        context.putImageData( id, x, y );
      }
    }

  }

}

//
// Creates the if statement to evaluate the image's pixels.
//
// @param { Object } args an array containing the arguments given
//                   on the RGBA panel.
// @param { Object } pixel an array containing the pixel's RGBA.
//
// @return { String } the final if statement.
//
function createStatement(args, pixel) {
  var statement = []

  for(var i = 0; i < args.length; i++) {
    var stmt = '';

    stmt += '(';
    stmt += args[i]["minred"]   + ' <= ' + pixel[0] + ' && ';
    stmt += args[i]["maxred"]   + ' >= ' + pixel[0] + ' && ';
    stmt += args[i]["mingreen"] + ' <= ' + pixel[1] + ' && ';
    stmt += args[i]["maxgreen"] + ' >= ' + pixel[1] + ' && ';
    stmt += args[i]["minblue"]  + ' <= ' + pixel[2] + ' && ';
    stmt += args[i]["maxblue"]  + ' >= ' + pixel[2] + ' && ';
    stmt += args[i]["minalpha"] + ' <= ' + pixel[3] + ' && ';
    stmt += args[i]["maxalpha"] + ' >= ' + pixel[3];
    stmt += ')';

    statement.push(stmt);
  }

  return statement.join(' || ');
}

//
// Gets the RGBA panel values.
//
// @return { Object } an array containing the RGBA panels values.
//
function getControlValues() {
  var args     = [];
  var controls = document.getElementsByClassName('card');

  for(var i = 0; i < controls.length; i ++) {
    var card = $(controls[i]);

    var minred   = card.find('#lowred').val();
    var maxred   = card.find('#highred').val();
    var mingreen = card.find('#lowgreen').val();
    var maxgreen = card.find('#highgreen').val();
    var minblue  = card.find('#lowblue').val();
    var maxblue  = card.find('#highblue').val();
    var minalpha = card.find('#lowalpha').val();
    var maxalpha = card.find('#highalpha').val();

    args.push({
      minred:   minred,   maxred:   maxred,
      mingreen: mingreen, maxgreen: maxgreen,
      minblue:  minblue,  maxblue:  maxblue,
      minalpha: minalpha, maxalpha: maxalpha
    });
  }


  return args;
}

//
// Gets the color to fill the matches.
//
// @return { Object } an array containing the RGBA color.
//
function getFillingColor() {
  return null;
}

//
// Gets the color to fill the background.
//
// @return { Object } an array containing the RGBA color.
//
function getBackgroundColor() {
  return [255, 255, 255, 255];
}

//
// Handles the click on convert button.
//
$(document).on('click', '#convert', function() {
  var rgbas           = getControlValues();
  var fillingColor    = getFillingColor();
  var backgroundColor = getBackgroundColor();

  segmentImages(rgbas, fillingColor, backgroundColor);
});

//
// Handles the click on clear button.
//
$(document).on('click', '#clear', function() {
  var cards = $('#content > .card-panel');

  for(var i = 0; i < cards.length; i ++) {
    var btn = $(cards[i]).find('.remove-card')[0];

    removeCard($(btn));
  }
});

//
// Handles the changes on files input.
//
$(document).on('change', '#input-files', function() {
  $('#input-legend').val('');
  checkImageInputs($(this), addOnScreen);
});

//
// handles the click on button to remove an image.
//
$(document).on('click', '.remove-card', function() {
  removeCard($(this));
});
