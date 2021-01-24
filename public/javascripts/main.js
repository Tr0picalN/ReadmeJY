var App = window.App || {};

App.main = (function () {
  let menu;
  let activePage;
  let currentPage;

  let _fadeAni = function (event) {
    App.main.pauseRock(menu, 'click', _fadeAni);
    let index = App.main.getItemIndex(event, menu);
    let element = activePage.item(index);
    let op;
    let timer;

    //자연스러운 페이지 연결위함//
    let wrapper = document.querySelector('.wrapper');
    wrapper.style.height = element.clientHeight + 100 + 'px';

    if (element != currentPage) {
      op = 1;
      timer = setInterval(fadeOut, 17);
      setTimeout(function () {
        currentPage = element;
        op = 0.1;
        timer = setInterval(fadeIn, 17);
      }, 500);
    }

    function fadeOut() {
      if (op <= 0.1) {
        clearInterval(timer);
        currentPage.style.display = 'none';
      }
      currentPage.style.opacity = op;
      op -= op * 0.1;
    }

    function fadeIn() {
      element.style.display = 'block';
      if (op >= 0.95) {
        clearInterval(timer);
      }
      element.style.opacity = op;
      op += op * 0.1;
    }
  };

  var words = document.getElementsByClassName('word');
  var wordArray = [];
  var currentWord = 0;

  words[currentWord].style.opacity = 1;
  for (var i = 0; i < words.length; i++) {
    splitLetters(words[i]);
  }

  function changeWord() {
    var cw = wordArray[currentWord];
    var nw =
      currentWord == words.length - 1
        ? wordArray[0]
        : wordArray[currentWord + 1];
    for (var i = 0; i < cw.length; i++) {
      animateLetterOut(cw, i);
    }

    for (var i = 0; i < nw.length; i++) {
      nw[i].className = 'letter behind';
      nw[0].parentElement.style.opacity = 1;
      animateLetterIn(nw, i);
    }

    currentWord = currentWord == wordArray.length - 1 ? 0 : currentWord + 1;
    targeting(currentWord);
  }

  function animateLetterOut(cw, i) {
    setTimeout(function () {
      cw[i].className = 'letter out';
    }, i * 80);
  }

  function animateLetterIn(nw, i) {
    setTimeout(function () {
      nw[i].className = 'letter in';
    }, 340 + i * 80);
  }

  function splitLetters(word) {
    var content = word.innerHTML;
    word.innerHTML = '';
    var letters = [];
    for (var i = 0; i < content.length; i++) {
      var letter = document.createElement('span');
      letter.className = 'letter';
      letter.innerHTML = content.charAt(i);
      word.appendChild(letter);
      letters.push(letter);
    }

    wordArray.push(letters);
  }

  function targeting(index) {
    let pre = index - 1;
    if (pre < 0) pre = 2;

    let words = document.querySelectorAll('.word');
    for (word of words) {
      word.style.display = 'none';
    }

    words.item(index).style.opacity = 1;
    words.item(index).style.display = 'inline';
  }

  changeWord();
  setInterval(changeWord, 3000);

  return {
    run: function () {
      menu = document.querySelectorAll('.btn-grad');
      activePage = document.querySelectorAll('.active-page');
      currentPage = activePage.item(0);
      for (let item of menu) {
        App.main.addEvent(item, 'click', _fadeAni);
      }
    },
    addEvent: function (obj, event, callback) {
      obj.addEventListener(event, callback);
    },
    delEvent: function (obj, event, callback) {
      obj.removeEventListener(event, callback, false);
    },
    pauseRock: function (list, event, callback) {
      for (let item of list) {
        App.main.delEvent(item, event, callback);
      }
      setTimeout(function () {
        for (let item of list) {
          App.main.addEvent(item, event, callback);
        }
      }, 600);
    },
    getItemIndex: function (item, list) {
      let indexArr = Array.from(list);
      for (let index in indexArr) {
        if (list.item(index) === item.currentTarget) {
          return index;
        }
      }
    },
  };
})();

window.addEventListener(
  'load',
  function () {
    App.main.run();
  },
  false,
);
