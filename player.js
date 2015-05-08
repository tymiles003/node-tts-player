var fs = require('fs');
var watson = require('watson-developer-cloud');
var ogg = require('ogg');
var opus = require('node-opus');
var Speaker = require('speaker');
var config = require('./config.js');


var oggDecoder = new ogg.Decoder();

var text_to_speech = watson.text_to_speech({
    username: config.TTS_USERNAME,
    password: config.TTS_PASSWORD,
    version: 'v1'
});

var params = {
    text: 'Hello from IBM Watson',
    accept: 'audio/ogg; codec=opus' //  audio/wav or audio/ogg; codec=opus
};


var stream = text_to_speech.synthesize(params);

stream.pipe(oggDecoder);

oggDecoder.on('stream', function (stream) {
    stream.on('error', console.error.bind(console, 'oggDecoder stream error'));

    var opusDecoder = new opus.Decoder({
        channels: 1,
        rate: 24000, // 24000Hz
        frame_size: 480 // 20ms frame length
    });
    opusDecoder.on('error', console.error.bind(console, 'opusDecoder error'));

    var speaker = new Speaker({
        channels: 1,          // # channels
        bitDepth: 16,         // #-bit samples
        sampleRate: 24000     // # Hz sample rate
    });
    speaker.on('error', console.error.bind(console, 'speaker error'));

    stream.pipe(opusDecoder).pipe(speaker);


}).on('error', console.error.bind(console, 'oggDecoder error'));


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
