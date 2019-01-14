var frenquencyCutoff = 130;
var clipStart = 20;
var thresholdMultiplier = 0.18;
var songUrl = "https://playx.fun/stream/vuWBZB:XKaAsB";



function getClip(length, startTime, data) {
    var clip_length = length * 44100;
    var section = startTime * 44100;
    var newArr = [];

    for (var i = 0; i < clip_length; i++) {
        newArr.push(data[section + i]);
    }

    return newArr;
}

function countFlatLineGroupings(data) {
    var groupings = 0;
    var newArray = normalizeArray(data);

    function getMax(a) {
        var m = -Infinity,
            i = 0,
            n = a.length;

        for (; i != n; ++i) {
            if (a[i] > m) {
                m = a[i];
            }
        }

        return m;
    }

    function getMin(a) {
        var m = Infinity,
            i = 0,
            n = a.length;

        for (; i != n; ++i) {
            if (a[i] < m) {
                m = a[i];
            }
        }

        return m;
    }

    var max = getMax(newArray);
    var min = getMin(newArray);
    var count = 0;
    var threshold = Math.round((max - min) * thresholdMultiplier);

    for (var i = 0; i < newArray.length; i++) {
        if (newArray[i] > threshold && newArray[i + 1] < threshold && newArray[i + 2] < threshold && newArray[i + 3] < threshold && newArray[i + 6] < threshold) {
            count++;
        }
    }

    return count;
}

function normalizeArray(data) {
    var newArray = [];

    for (var i = 0; i < data.length; i++) {
        newArray.push(Math.abs(Math.round((data[i + 1] - data[i]) * 1000)));
    }

    return newArray;
}

function getSampleClip(data, samples) {
    var newArray = [];
    var modulus_coefficient = Math.round(data.length / samples);

    for (var i = 0; i < data.length; i++) {
        if (i % modulus_coefficient == 0) {
            newArray.push(data[i]);
        }
    }

    return newArray;
}

function createBuffers(url) {
    // Fetch Audio Track via AJAX with URL
    request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function(ajaxResponseBuffer) {
        // Create and Save Original Buffer Audio Context in 'originalBuffer'
        var audioCtx = new AudioContext();
        var songLength = ajaxResponseBuffer.total;

        console.log(songLength);

        // Arguments: Channels, Length, Sample Rate
        var offlineCtx = new OfflineAudioContext(1, songLength, 44100);
        source = offlineCtx.createBufferSource();
        var audioData = request.response;
        audioCtx.decodeAudioData(audioData, function(buffer) {
                window.originalBuffer = buffer.getChannelData(0);
                var source = offlineCtx.createBufferSource();
                source.buffer = buffer;

                // Create a Low Pass Filter to Isolate Low End Beat
                var filter = offlineCtx.createBiquadFilter();
                filter.type = "lowpass";
                filter.frequency.value = frenquencyCutoff;
                source.connect(filter);
                filter.connect(offlineCtx.destination);

                // Schedule start at time 0
                source.start(0);

                // Render this low pass filter data to new Audio Context and Save in 'lowPassBuffer'
                offlineCtx.startRendering().then(function(lowPassAudioBuffer) {
                    var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
                    var song = audioCtx.createBufferSource();
                    song.buffer = lowPassAudioBuffer;
                    song.connect(audioCtx.destination);

                    // Save lowPassBuffer in Global Array
                    window.lowPassBuffer = song.buffer.getChannelData(0);

                    console.log("Low Pass Buffer Rendered!");

                    //length, start time, data
                    window.lowPassFilter = getClip(10, clipStart, window.lowPassBuffer);
                    //data, sample
                    window.lowPassBuffer = getSampleClip(window.lowPassFilter, 300);
                    //data
                    window.lowPassBuffer = normalizeArray(window.lowPassBuffer);

                    var final_tempo = countFlatLineGroupings(window.lowPassBuffer);
                    final_tempo = final_tempo * 6;
                    console.log("Tempo: " + final_tempo);
                    $(".text").text(final_tempo + " BPM");
                    $(".lds-dual-ring").hide();
                });

            },
            function(e) {});
    }
    request.send();
}

createBuffers(songUrl);