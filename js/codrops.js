(function() {
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  
  var triggerBttn = document.getElementById( 'trigger-overlay' ),
  overlay = document.querySelector( 'div.overlay' ),
  closeBttn = overlay.querySelector( 'button.overlay-close' ),
  paths = [].slice.call( overlay.querySelectorAll( 'svg > path' ) ),
  pathsTotal = paths.length;
  
  window.toggleOverlay = function () {
    var cnt = 0;
    shuffle( paths );
    if( classie.has( overlay, 'open' ) ) {
      classie.remove( overlay, 'open' );
      classie.add( overlay, 'close' );
      paths.forEach( function( p, i ) {
        setTimeout( function() {
          ++cnt;
          p.style.display = 'none';
          if( cnt === pathsTotal ) {
            classie.remove( overlay, 'close' );
          }
        }, i * 30 );
      });
    }
    else if( !classie.has( overlay, 'close' ) ) {
      classie.add( overlay, 'open' );
      paths.forEach( function( p, i ) {
        setTimeout( function() {
          p.style.display = 'block';
        }, i * 30 );
      });
    }
  }
  
  triggerBttn.addEventListener( 'click', toggleOverlay );
})();
