//
// Constants
//
CARDHEIGHT = 100;
CARDWIDTH = 84;

var m3m0ryMembers;
var isGameOn = false;
var isVerifying = false;
var flippedCard = [];
var gameType, gameMatch, gameTries, gameDuration, ticker, totalGameConnections;

// 
// Game board setup; 
// Upcoming future features will include different types of memory games
// with varying difficulty
// 
var setupGame = function(gtype) {
  var masterList = [];
  var keys = [];

// Reset the board
  $('#board').empty();
  gameMatch = 0;
  gameTries = 0;
  gameDuration = 0;
  gameType = gtype;
  ticker = 0;
  totalGameConnections = 0;

  _gaq.push(['_trackEvent', 'Game Started', gameType]); 
  window.toggleOverlay();
  $('#flash-message').html('');
  $('#action-message').html('');
  $('#repeat-message').hide();
  $('#pageContainer').removeClass('lowlight');
  $('#pageContainer').fadeIn(2500);
//
// builds out a picture card from the connections hash table
//
  var createPictureCard = function(id) {
    var html = "<div class='tt pic card' data-id='"+id+"'><div class='back'></div><div class='hide front'><img src='"+masterList[id].pictureUrl+"'/></div>";
    $('#board').append(html);
  }

//
// builds out a second picture card, with (name) class to keep 
// the game engine happy
//
  var createClassicPictureCard = function(id) {
    var html = "<div class='tt name card' data-id='"+id+"'><div class='back'></div><div class='hide front'><img src='"+masterList[id].pictureUrl+"'/></div>";
    $('#board').append(html);
  }
//
// builds out a text (name) card from the connections hash table
//
  var createTextCard = function(id) {
    var html = "<div class='tt name card' data-id='"+id+"'><div class='back'></div><div class='hide front'><span>"+masterList[id].firstName+" "+masterList[id].lastName+"</span></div>";
    $('#board').append(html);
  }

//
// returns a smaller randomized subset of keys
// 
  var getRandomSubList = function(list, size) {
    var mixed = list.slice(0), i = list.length, min = i - size, tmp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        tmp = mixed[index];
        mixed[index] = mixed[i];
        mixed[i] = tmp;
    }
    return mixed.slice(min);
  }

//
// creates the master has table and key array
//
  for (var member in window.m3m0ryMembers) {
    var memberID = window.m3m0ryMembers[member].id;
    masterList[memberID] = window.m3m0ryMembers[member];
    keys.push(memberID);
  }

  var cardCount = keys.length;

//
// this is the specialized default feature of the game 
// that dynamically calculates the maximum number of 
// random card-pairs to display on the available board-section
// to avoid scroll back. future features will include options
// such as: a) a classic concentration game with matching
// pictures instead of pictures-names; b) a more difficult level
// that will have all of the person's connections on the board
//
  if(gtype == 'newbie' || gtype == 'classic' || !gtype) {
    var boardSectionWidth = $('#contentContainer section').css('width');
    var boardSectionHeight = $('#contentContainer section').css('height');
    var optimalCards = ((Math.floor(parseInt(boardSectionWidth,10) / parseInt(CARDWIDTH + 5),10) * Math.floor(parseInt(boardSectionHeight,10) / parseInt(CARDHEIGHT + 5),10)) / 2) + 1;
    cardCount = (cardCount > optimalCards) ? optimalCards : cardCount;
    if(gtype == 'classic') { cardCount = (cardCount / 2) + 1; }
    keys = getRandomSubList(keys, cardCount);
  }

//
// build both picture and name cards to be shuffled later
//
  if(gtype == 'classic') {
    for (var i=0; i<cardCount; i++) {
      createPictureCard(keys[i]);
      createClassicPictureCard(keys[i]);
    }
  } 
  else {
    for (var i=0; i<cardCount; i++) {
      createPictureCard(keys[i]);
      createTextCard(keys[i]);
    }
  } 

//
// once the board is set with the pairs of picture/name cards,
// this shuffles the cards into their final game positions
//
  $(function () {
    var parent = $("#board");
    var divs = parent.children();
    while (divs.length) {
      parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
  });

//
// info section setup for timer, attempts and successful matches
//
  totalGameConnections = keys.length;
  $('#game-match').html(gameMatch+"/"+totalGameConnections);
  $('#game-tries').html(gameTries);
  ticker = setInterval("tickTock()", 1000);
}

//
// count-up timer; maybe in the future, this should be a countdown timer
// and add more gamification
//
var tickTock = function() {
  gameDuration += 1;
  $('#game-time').html(gameDuration+"s");
}

//
// updating info boxes and adding some styles
//
var updateInfoBox = function(selector, styleclass, value) {
  var sel = $(selector);
  sel.closest('section').addClass(styleclass);
  sel.html(value);
  setTimeout(function() {
    sel.closest('section').removeClass(styleclass);
  }, 1500);
}

// 
// preliminary intended use is for message/alert updates to overlay
//
var sendMessage = function(selector,msg) {
  var sel = $(selector);
  sel.html(msg);
}

// 
// main game engine 
// 
var verifyGuess = function(id) {
  var count = $('.card.flipped').length;

  if(count == 2 && ($('.pic.card.flipped').attr('data-id') == $('.name.card.flipped').attr('data-id'))) {
    gameMatch += 1;
    gameTries += 1;
    updateInfoBox('#game-match','green',gameMatch+"/"+totalGameConnections);
    updateInfoBox('#game-tries','green',gameTries);
    $(document).find('.card.flipped').each(function() {
      $(this).addClass('matched');
      $(this).removeClass('flipped');
    });
    isVerifying = false;
    if (totalGameConnections == gameMatch) {
      endGame();
    }
  }
  else {
    gameTries += 1;
    updateInfoBox('#game-tries','red',gameTries);
    setTimeout(function() {
      $('.card.flipped').each(function() {
        $(this).removeClass('flipped');
        $(this).find('.front').addClass('hide');
        $(this).find('.back').removeClass('hide');
      });
      flippedCard = [];
      isVerifying = false;
    }, 1000);
  }
}

// 
// end of game housecleaning items
//
var endGame = function() {
  clearInterval(ticker);
  isGameOn = false;
  $('#pageContainer').addClass('lowlight');
  sendMessage('#flash-message','you are awesome!');
  sendMessage('#action-message','it took '+gameDuration+'s and '+gameTries+' tries to find all '+totalGameConnections+' matches.');
  sendMessage('#repeat-message','<a id="start-newbie-game">play again?</a> <a id="start-classic-game">try a classic?</a> <a id="start-wtf-game">or go crazy!</a>');
  _gaq.push(['_trackEvent', 'Scores', gameType+' '+gameDuration+' '+gameTries+' '+totalGameConnections]); 
  $('#repeat-message').show();
  $('.intro-logo').remove();
  $('#trigger-overlay').trigger('click');
}

$(document).ready(function() {
  $(document).on('click','#start-newbie-game',function() {
    if(!isGameOn) {
      isGameOn = true;
      setupGame('newbie');
    }
  });
  $(document).on('click','#start-classic-game',function() {
    if(!isGameOn) {
      isGameOn = true;
      setupGame('classic');
    }
  });
  // for the players that are way too focused!
  $(document).on('click','#start-wtf-game',function() {
    if(!isGameOn) {
      isGameOn = true;
      setupGame('wtf');
    }
  });
  $(document).on('click','.card',function() {
    var _this = $(this);
    var fcl = flippedCard.length;
    if(_this.hasClass('flipped') || _this.hasClass('matched') || isVerifying) {
      return;
    }
    else {
      if(!fcl) {
        _this.find('.front').removeClass('hide');
        _this.find('.back').addClass('hide');
        _this.addClass('flipped');
        flippedCard.push($(this).data('id'));
      }
      else if(fcl == 1) {
        _this.find('.front').removeClass('hide');
        _this.find('.back').addClass('hide');
        _this.addClass('flipped');
        flippedCard.push($(this).data('id'));
        isVerifying = true;
        setTimeout(function() {
          verifyGuess($(this).data('id'));
        }, 1000);
      }
      else {
        $('.card.flipped').each(function() {
          $(this).removeClass('flipped');
          $(this).find('.front').addClass('hide');
          $(this).find('.back').removeClass('hide');
        });
        flippedCard = [];
        isVerifying = false;
      }
    }
  });
  $('.tt').tooltipster();
});

