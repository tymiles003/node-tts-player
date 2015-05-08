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
    accept: 'audio/ogg; codec=opus'
};

// text_to_speech.synthesize returns a stream of ogg/opus data
// ogg.Decoder detects the opus audio sub-stream embedded in the ogg container and emits a "stream" event with it
// opus.Decoder decodes this stream to PCM data, and also emits a "format" event with frequency, # chanels, etc.
// Speaker uses the format and PCM data to play audio on your system's speakers

text_to_speech.synthesize(params)
    .pipe(new ogg.Decoder())
    .on('stream', function (opusStream) {
        opusStream.pipe(new opus.Decoder())
            .pipe(new Speaker());
    });

