//npm install recorder-js
import Recorder from 'recorder-js';
// Khởi tạo recorder
var audioContext = new AudioContext();
var recorder;
var countdownInterval;

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    var input = audioContext.createMediaStreamSource(stream);
    recorder = new Recorder(input);
    recorder.record();
    startCountdown(300); // đếm ngược 5 phút (300 giây)
  });
}

function stopRecording() {
  recorder.stop();
  recorder.exportWAV(uploadAudio);
  stopCountdown();
}

// Tải tệp âm thanh lên máy chủ
function uploadAudio(blob) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'upload.php', true);
  xhr.onload = function(e) {
    if (this.status == 200) {
      console.log('Tải tệp âm thanh lên máy chủ thành công.');
      window.location.href = 'finish.html'; // chuyển hướng sang trang finish.html
    }
  };
  var formData = new FormData();
  formData.append('audio', blob, 'recorded.wav');
  formData.append('name', document.getElementsByName('name')[0].value);
  xhr.send(formData);
}

// Đếm ngược thời gian còn lại
function startCountdown(seconds) {
  var countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = 'Thời gian còn lại: ' + secondsToString(seconds);
  countdownInterval = setInterval(function() {
    seconds--;
    if (seconds < 0) {
      stopRecording();
    } else {
      countdownElement.innerHTML = 'Thời gian còn lại: ' + secondsToString(seconds);
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdownInterval);
  var countdownElement = document.getElementById('countdown');
  countdownElement.innerHTML = '';
}

// Chuyển đổi số giây thành chuỗi dạng mm:ss
function secondsToString(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  if (remainingSeconds < 10) {
    remainingSeconds = '0' + remainingSeconds;
  }
  return minutes + ':' + remainingSeconds;
}