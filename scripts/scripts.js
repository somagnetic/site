//functions
function byId(id) {
  return document.getElementById(id);
}
function byClass(className) {
  return document.getElementsByClassName(className);
}
function forEach(list, callback) {
  for (var i = list.length; i--;) {
    callback(list[i], i, list);
  }
}

//nav background

//questionnaire
var question = byClass('continue');
var wHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
var wScroll;
var rect = [];
var continueBox = [];
var checkboxes = document.getElementsByTagName('input');
for(var i = 0; i < checkboxes.length; i++) {
  if(checkboxes[i].dataset.continue) {
    continueBox.push(checkboxes[i]);
  } else {
    checkboxes[i].addEventListener('change', checked, false);
  }
}
for (var i = 0; i < continueBox.length; i++) {
  continueBox[i].addEventListener('change', checked, false)
}
function passesCenter(a) {
   return !(a.bottom - (wHeight / 2) < 0 || a.top - (wHeight / 2) >= 0);
}

function checked() {
  if (this.checked) {

    rect = [];
    for (var i = 0; i < question.length; i++) {
      rect.push(question[i].getBoundingClientRect());
    }
    console.log(rect);
    window.addEventListener('scroll', function(){
      wScroll = window.pageYOffset;
      for (var i = 0; i < question.length; i++) {
        if(passesCenter(question[i].getBoundingClientRect())) {
          question[i].classList.add('in-center');
        } else {
          question[i].classList.remove('in-center');
        }
      }
      }
    )
  }
}
// Rotating title animations
$(document).ready(function(){
  // Smoothscroll
  $('a[href^="#"]').on('click',function (e) {
  	    e.preventDefault();

  	    var target = this.hash;
  	    var $target = $(target);

  	    $('html, body').stop().animate({
  	        'scrollTop': $target.offset().top
  	    }, 700, 'swing', function () {
  	        window.location.hash = target;
  	    });
  	});
    $(window).scroll(function () {
       if ($(this).scrollTop() > 100) {
           $('.scrollup').fadeIn();
       } else {
           $('.scrollup').fadeOut();
       }
   });

   $('.start').click(function () {
       $("html, body").animate({
           scrollTop: 0
       }, 600);
       return false;
   });
var animationDelay = 4000;

animateHeadline($('.cd-headline'));

function animateHeadline($headlines) {
	$headlines.each(function(){
		var headline = $(this);
		//trigger animation
		setTimeout(function(){ hideWord( headline.find('.is-visible') ) }, animationDelay);
		//other checks here ...
	});
}

function hideWord($word) {
	var nextWord = takeNext($word);
	switchWord($word, nextWord);
	setTimeout(function(){ hideWord(nextWord) }, animationDelay);
}

function takeNext($word) {
	return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
}

function switchWord($oldWord, $newWord) {
	$oldWord.removeClass('is-visible').addClass('is-hidden');
	$newWord.removeClass('is-hidden').addClass('is-visible');
}

});
// fun with svg
const ease = {
  cubicInOut: (t) => {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  }
}
class ShapeOverlays {
  constructor(elm) {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = 18;
    this.duration = 600;
    this.delayPointsArray = [];
    this.delayPointsMax = 300;
    this.delayPerPath = 100;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    const range = 4 * Math.random() + 6;
    for (var i = 0; i < this.numPoints; i++) {
      const radian = i / (this.numPoints - 1) * Math.PI;
      this.delayPointsArray[i] = (Math.sin(-radian) + Math.sin(-radian * range) + 2) / 4 * this.delayPointsMax;
    }
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.isOpened = true;
    this.elm.classList.add('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  close() {
    this.isOpened = false;
    this.elm.classList.remove('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints + 1; i++) {
      points[i] = ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }

    let str = '';
    str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame( () => {
        this.renderLoop();
      });
    }
    else {
      this.isAnimating = false;
    }
  }
}

(function() {
  const elmHamburger = document.querySelectorAll('.start');
  const toggleButton = document.querySelector('.toggle');
  const gNavItems = document.querySelectorAll('.navItem');
  const elmOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elmOverlay);
  elmHamburger.forEach( function(item, elemFun){
    item.addEventListener('click', function() {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
    if (overlay.isOpened === true) {
      item.classList.toggle('is-opened-navi', 'tertiary');
      toggleButton.textContent = "Close";
      toggleButton.classList.add('is-opened-navi', 'tertiary');
      for (var i = 0; i < gNavItems.length; i++) {
        if(i>=3){
          gNavItems[i].classList.add('is-opened');
        } else {
          gNavItems[i].classList.remove('is-opened');
        }
      }
    } else {
      item.classList.toggle('is-opened-navi', 'tertiary');
      toggleButton.textContent = "Start a Project";
      toggleButton.classList.remove('is-opened-navi', 'tertiary');
      for (var i = 0; i < gNavItems.length; i++) {
//
          if(i>=3){
            gNavItems[i].classList.remove('is-opened');
          } else {
            gNavItems[i].classList.add('is-opened');
            }
          }
        }
      });
    });
}())
    //
    //       for (var i = 0; i < gNavItems.length; i++) {
    //         gNavItems[i].classList.add('is-opened');
    //
    //       }
    //     } else {
    //       item.classList.remove('is-opened-navi');
    //       for (var i = 0; i < gNavItems.length; i++) {
    //         gNavItems[i].classList.remove('is-opened');
    //       }
    //     }
    //   });
    // });
    // }());
