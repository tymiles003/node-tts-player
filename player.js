var fs = require('fs');
var watson = require('watson-developer-cloud');
var ogg = require('ogg');
var opus = require('node-opus');
var Speaker = require('speaker');
var config = require('./config.js');

var text_to_speech = watson.text_to_speech({
    username: config.TTS_USERNAME,
    password: config.TTS_PASSWORD,
    version: 'v1'
});

var params = {
    text: 'Hello from IBM Watson',
    accept: 'audio/ogg; codec=opus' //  audio/wav or audio/ogg; codec=opus
};

// ogg.Decoder detects the opus audio stream embedded in the container and emits a "stream" event with it
// opus.Decoder decodes this stream to PCM data, and also emits a "format" event with frequency, # chanels, etc.
// Speaker uses the format and PCM data to play audio on your system's speakers

text_to_speech.synthesize(params)
    .pipe(new ogg.Decoder())
    .on('stream', function (opusStream) {
        opusStream.pipe(new opus.Decoder())
            .pipe(new Speaker());
    });


/*
$ opusinfo test.opus
Processing file "test.opus"...

New logical stream (#1, serial: c3ebd6b6): type opus
Encoded with Lavf56.18.100
User comments section follows...
	encoder=Lavc56.20.100 libopus
Opus stream 1:
	Pre-skip: 156
	Playback gain: 0 dB
	Channels: 1
	Original sample rate: 24000Hz
	Packet duration:   20.0ms (max),   20.0ms (avg),   20.0ms (min)
	Page duration:   1000.0ms (max),  693.3ms (avg),   80.0ms (min)
	Total data length: 18741 bytes (overhead: 1.77%)
	Playback length: 0m:02.069s
	Average bitrate: 72.45 kb/s, w/o overhead: 71.17 kb/s
Logical stream 1 ended
 */
