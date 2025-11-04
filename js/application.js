// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalScoreManager);
});


    var imageList = [
"img/2Panda.gif",
"img/4Panda.gif",
"img/8Panda.gif",
"img/16Panda.gif",
"img/32Panda.gif",
"img/64Panda.gif",
"img/128Panda.gif",
"img/256Panda.gif",
"img/512Panda.gif",
"img/1024Panda.gif",
"img/2048Panda.gif",
];
    for(var i = 0; i < imageList.length; i++ ) 
    {
        var imageObject = new Image();
        imageObject.src = imageList[i];
    }
