document.addEventListener('DOMContentLoaded', function() {
    const modeButton = document.getElementById('open-popup');
    const popup = document.getElementById('popup');
    const popupButton2 = document.getElementById('button1');
    const popupButton3 = document.getElementById('button3');
    const popupButton1 = document.getElementById('button2');

    modeButton.addEventListener('click', function() {
        popup.style.display = 'block';
    });

    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    popupButton1.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    popupButton2.addEventListener('click', function() {
        window.location.href = 'index_m2.html';
    });

    popupButton3.addEventListener('click', function() {
        window.location.href = 'index_m3.html';
    });
});