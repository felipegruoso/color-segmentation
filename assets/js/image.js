var images = new Array();

function removeCard(btn) {
    id         = btn.context.dataset['id'];
    images[id] = null;
    btn.closest('.card-panel').remove();
}

function checkImageInputs(input, callback) {
    var fileInputs = input[0];
    var left       = fileInputs.files.length;

    for (var i = 0; i < fileInputs.files.length; i++) {
        var fr = new FileReader();
        fr.onload = function(e) {
            var img       = document.createElement('img');
            img.src       = e.target.result;
            img.className = 'file-result';

            var exists = false;
            for(var x = 0; x < images.length; x ++) {
                if(images[x] != null) {
                    if(images[x].src == img.src) {
                        exists = true;
                    }
                }
            }

            if(!exists) {
                images.push(img);
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

function postProcess(images){

    for(var i = 0; i < images.length; i ++) {

        if(images[i] != null) {

            var id     = 'canvas-' + i;
            var canvas = document.getElementById(id)

            if(canvas == null) {

                var cardWidth;
                if((images[i].width + 40) < 95) {
                    cardWidth = '95px'
                } else {
                    cardWidth = images[i].width + 40 + 'px'
                }

                var card          = document.createElement('div');
                card.className    = 'card-panel center-content';
                card.style.width  = cardWidth;
                card.style.height = images[i].height + 90 + 'px';

                var divDel         = document.createElement('div');
                divDel.style.width = '100%';

                var btnDel       = document.createElement('a');
                btnDel.className = 'btn-floating btn-large waves-effect waves-light red remove-card';
                btnDel.setAttribute("data-id", i);

                var iconDel       = document.createElement('i');
                iconDel.className = 'material-icons';
                iconDel.innerHTML = 'close';

                btnDel.appendChild(iconDel);
                divDel.appendChild(btnDel);

                var canvas    = document.createElement('canvas');
                canvas.id     = id;
                canvas.width  = images[i].width;
                canvas.height = images[i].height;

                var context = canvas.getContext("2d");
                context.drawImage(images[i], 0, 0);

                card.appendChild(canvas);
                card.appendChild(divDel);
                document.getElementById('content').appendChild(card);
            }
        }

    }
}

$(document).on('change', '#input-files', function() {
    checkImageInputs($(this), postProcess);
});

$(document).on('click', '.remove-card', function() {
    removeCard($(this));
})
