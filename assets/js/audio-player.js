document.querySelectorAll('.audio-player-wrap').forEach(function (wrap) {
    var audio    = wrap.querySelector('.ap-audio');
    var playBtn  = wrap.querySelector('.ap-play-btn');
    var iconPlay = wrap.querySelector('.ap-icon-play');
    var iconPause= wrap.querySelector('.ap-icon-pause');
    var currentEl= wrap.querySelector('.ap-current');
    var durationEl=wrap.querySelector('.ap-duration');
    var seekEl   = wrap.querySelector('.ap-seek');
    var progressEl=wrap.querySelector('.ap-progress');

    function fmt(s) {
        if (isNaN(s)) return '--:--';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    audio.addEventListener('loadedmetadata', function () {
        durationEl.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', function () {
        currentEl.textContent = fmt(audio.currentTime);
        var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        seekEl.value = pct;
        progressEl.style.width = pct + '%';
    });

    audio.addEventListener('ended', function () {
        iconPlay.style.display = '';
        iconPause.style.display = 'none';
    });

    playBtn.addEventListener('click', function () {
        if (audio.paused) {
            audio.play();
            iconPlay.style.display = 'none';
            iconPause.style.display = '';
        } else {
            audio.pause();
            iconPlay.style.display = '';
            iconPause.style.display = 'none';
        }
    });

    seekEl.addEventListener('input', function () {
        if (audio.duration) {
            audio.currentTime = (seekEl.value / 100) * audio.duration;
        }
    });
});
