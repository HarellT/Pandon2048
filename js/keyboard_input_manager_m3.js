function KeyboardInputManager() {
  this.events = {};
  this.shuffledMap = {};
  this.normalMap = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // vim keybindings
    76: 1,
    74: 2,
    72: 3,
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
  };
  this.directionNames = ['Up', 'Right', 'Down', 'Left'];
  this.shuffleInterval = 15000; // 15 seconds
  this.timeLeft = this.shuffleInterval / 1000;

  this.listen();
  this.startShuffleTimer();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped = self.shuffledMap[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  var retry = document.querySelector(".retry-button");
  retry.addEventListener("click", this.restart.bind(this));
  retry.addEventListener("touchend", this.restart.bind(this));

  var keepPlaying = document.querySelector(".keep-playing-button");
  keepPlaying.addEventListener("click", this.keepPlaying.bind(this));
  keepPlaying.addEventListener("touchend", this.keepPlaying.bind(this));
  
  var showInfo = document.querySelector(".info-container");
  showInfo.addEventListener("click", this.showInfo.bind(this));
  showInfo.addEventListener("touchend", this.showInfo.bind(this));
  
  // Listen to swipe events
  var touchStartClientX, touchStartClientY;
  var gameContainer = document.getElementsByClassName("game-container")[0];

  gameContainer.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) return;

    touchStartClientX = event.touches[0].clientX;
    touchStartClientY = event.touches[0].clientY;
    event.preventDefault();
  });

  gameContainer.addEventListener("touchmove", function (event) {
    event.preventDefault();
  });

  gameContainer.addEventListener("touchend", function (event) {
    if (event.touches.length > 0) return;

    var dx = event.changedTouches[0].clientX - touchStartClientX;
    var absDx = Math.abs(dx);

    var dy = event.changedTouches[0].clientY - touchStartClientY;
    var absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 10) {
      // (right : left) : (down : up)
      self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    }
  });
};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

KeyboardInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

KeyboardInputManager.prototype.showInfo = function (event) {
  event.preventDefault();
  this.emit("showInfo");
};

KeyboardInputManager.prototype.hideInfo = function (event) {
  event.preventDefault();
  this.emit("hideInfo");
};

KeyboardInputManager.prototype.shuffleControls = function () {
  var directions = [0, 1, 2, 3];
  var shuffled = directions.slice().sort(() => Math.random() - 0.5);
  
  this.shuffledMap = {};
  for (var key in this.normalMap) {
    if (this.normalMap.hasOwnProperty(key)) {
      this.shuffledMap[key] = shuffled[this.normalMap[key]];
    }
  }

  this.updateControlsDisplay();
};

KeyboardInputManager.prototype.updateControlsDisplay = function () {
  var controlsDisplay = document.getElementById('controls-display');
  var content = 'Controls: ';
  for (var i = 0; i < 4; i++) {
    content += this.directionNames[i] + ' → ' + this.directionNames[this.shuffledMap[37 + i]] + ', ';
  }
  controlsDisplay.textContent = content.slice(0, -2); // Remove last comma and space
};

KeyboardInputManager.prototype.startShuffleTimer = function () {
  var self = this;
  self.shuffleControls();
  
  function updateTimer() {
    var timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = 'Next shuffle in: ' + self.timeLeft + 's';
    self.timeLeft--;

    if (self.timeLeft < 0) {
      self.timeLeft = self.shuffleInterval / 1000;
      self.shuffleControls();
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
};