var array = [];
let waitingTime = 0;
let recordTime = 300;
$("#descriptionStart").click(Recorder);

function Recorder() {
    timer(Recording);
    function timer(callback) {
        $("#speakingDescription").addClass("d-none");
        let b = waitingTime;
        id = window.setInterval(function () {
            document.getElementById("timer").innerText = b;
            b = b - 1;
            if (b == -1) {
                $("#recordStarting").addClass("d-none");
                window.clearInterval(id);
                document.querySelector(".StartSpeaking").style.display = "block";
                callback();
            }
        }, 1000);
    }

    function Recording() {
        document.getElementById("stop").style.display = "inline-block";
        let recorder = null;
        const onsuccess = (mediaStream) => {
            recorder = new MediaRecorder(mediaStream, {
                type: 'audio/ogg; codecs=opus'
            });
            stream = mediaStream; // Define the stream variable and assign the mediaStream value
            recorder.start(); // Starting the record

            recorder.ondataavailable = (e) => {
                // Converting audio blob to base64
                let reader = new FileReader();
                reader.onloadend = () => {
                    document.getElementById("player").src = reader.result;
                    console.log(reader.result);
                    let audio64 = {
                        base64: reader.result
                    };
                    array.push(audio64);
                    localStorage.setItem("array", JSON.stringify(array));

                    // Convert the Blob to a Blob of type 'audio/mp3'
                    const mp3Blob = new Blob([e.data], { type: 'audio/mp3' });

                    // Create a new anchor element and set its download attribute to the desired filename
                    const link = document.createElement('a');
                    link.download = 'Recording Part 3.mp3';

                    // Convert the Blob to a URL representing the file
                    link.href = URL.createObjectURL(mp3Blob);

                    // Dispatch a click event on the anchor element
                    link.dispatchEvent(new MouseEvent('click'));
                };

                reader.readAsDataURL(e.data);
            };
        }

        navigator.getUserMedia = (
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
        );

        navigator.getUserMedia({
            audio: true
        }, onsuccess, (e) => {
            console.log(e);
        });

        let stopButton = document.getElementById("stop");
        let stop = 0;
        let timeoutId = setTimeout(() => {
            if (stop == 0 && recorder && recorder.state === "recording") {
                recorder.stop();
                recorder = null;
                stopButton.innerText = "Recording stopped";
                stopButton.removeEventListener("click", stopRecording);
                stream.getTracks().forEach(track => track.stop()); // Stop the getUserMedia stream
            }
        }, (recordTime + 1) * 1000);

        function stopRecording() {
            if (recorder && recorder.state === "recording") {
                recorder.stop();
                recorder = null;
                stopButton.innerText = "Recording stopped";
                stopButton.removeEventListener("click", stopRecording);
                stop = 1;
                clearTimeout(timeoutId);
                stream.getTracks().forEach(track => track.stop()); // Stop the getUserMedia stream
            }
        }

        stopButton.addEventListener("click", stopRecording);
    }

}
