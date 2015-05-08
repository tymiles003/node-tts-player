Streaming Watson Text to Speech player
======================================

Node.js script that plays synthesized voice audio over your computer's speakers.

Currently requires Linux or OS X. Windows support may come in the future.


Setup
-----

Create a watson Text to Speech instance in [Bluemix](http://bluemix.net/) and bind it to a server. 
Go to the server's overview page, find your instance, and click "Show Credentials". 
Copy the username and password to `config.js`

On Debian Linux systems, you may also need `alsa.h` which can be installed via

    sudo apt-get install libasound2-dev
    
Then run
    
    npm install
    
And, finally, to hear audio, run 

    node player.js
