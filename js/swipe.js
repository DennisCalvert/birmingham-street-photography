// TODO
// remove angular
// allow photos to
//        1) be inject via JSON
//        2) scrape the DOM
// <div ng-repeat="photo in photos track by $index" class="slide" style="background-image: url('{{photo}}');">

"use strict";

function swiper(photos) {
  const photoFragment = new DocumentFragment();

  photos.forEach((photoURL) => {
    const photoWrapper = document.createElement("div");
    photoWrapper.classList.add("slide");
    photoWrapper.style.backgroundImage = `url(${photoURL})`;
    // TODO make orientation switchable
    photoWrapper.style.width = `${window.innerWidth}px`;
    photoWrapper.style.height = `${window.innerWidth * 1.5}px`;
    photoFragment.appendChild(photoWrapper);
  });

  document.getElementById("swiper").appendChild(photoFragment);
  document.getElementById("swiper").style.width = photos.length * 100 + "%";

  var swipe = {
    slideWidth: document.body.clientWidth,
    touchstartx: undefined,
    touchmovex: undefined,
    movex: 0,
    index: 0,
    currentY: 0,
    isWebkit: undefined,

    slideDistance: function () {
      return window.innerWidth;
      // return (window.innerWidth > 660) ? 600 : 300;
    },

    setSwipeTransformX: function (x) {
      if (this.isWebkit) {
        document.getElementById("swiper").style.webkitTransform =
          "translate3d(-" + x + "px,0,0)";
      } else {
        document.getElementById("swiper").style.transform =
          "translate3d(-" + x + "px,0,0)";
      }
    },

    init: function () {
      this.bindUIEvents();

      var testEl = document.createElement("div");
      testEl.style.webkitTransform = "translate(0)";
      this.isWebkit = Boolean(
        testEl.getAttribute("style").toLowerCase().indexOf("webkit") !== -1
      );
    },

    bindUIEvents: function () {
      var slider = document.getElementById("swiper"),
        self = this;
      slider.addEventListener("touchstart", function (e) {
        self.start(e);
      });
      slider.addEventListener("touchmove", function (e) {
        self.move(e);
      });
      slider.addEventListener("touchend", function (e) {
        self.end(e);
      });
    },

    getCurrentPos: function () {
      if (this.index === 0) {
        return 0 + this.movex;
      }
      return this.slideDistance() * this.index + this.movex;
    },

    calculateIndex: function () {
      if (Math.abs(this.movex) > this.slideWidth / 10) {
        if (this.movex > 0) {
          this.index += 1;
        } else if (this.index >= 1) {
          this.index -= 1;
        }
        if (this.index >= photos.length) {
          this.index -= 1;
        }
      }
    },

    start: function (event) {
      document.getElementById("swiper").classList.remove("isSliding");
      event.target.classList.add("isTouched");
      this.touchstartx =
        event.touches[0].pageX || event.changedTouches[0].pageX;
    },

    move: function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.touchmovex = event.touches[0].pageX || event.changedTouches[0].pageX;
      this.movex = this.touchstartx - this.touchmovex;
      this.setSwipeTransformX(this.getCurrentPos());
    },

    end: function (event) {
      document.getElementById("swiper").classList.add("isSliding");
      this.calculateIndex();
      this.currentY = this.slideDistance() * this.index;
      this.setSwipeTransformX(this.currentY);
      event.target.classList.remove("isTouched");
      this.movex = 0;
    },
  };
  swipe.init();
}

var photos = [
  "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-07.jpg",
  // "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-08.jpg",
  "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-09.jpg",
  "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-01.jpg",
  "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-02.jpg",
  "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-03.jpg",
  // "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-04.jpg",
  // "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-05.jpg",
  // "https://denniscalvert.s3.us-east-2.amazonaws.com/bhm-bw-film/party-06.jpg",
];

if (window.innerWidth < 800) {
  swiper(photos);
}
