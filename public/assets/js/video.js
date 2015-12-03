//p2p connection and some basic layout
var videos = document.getElementById("videos");
var rtc = ClassVideo();
var msgs = document.getElementById("msgs");
var sendBtn = document.getElementById("sendBtn");
var roomName  = "295B001"   //unique number to represent course and its session
var userName  = "Student"
var isTeacher = false
var btnStartRecording = document.getElementById('recordvideo');
var btnStopRecording = document.getElementById('uploadvideo');


rtc.on("connected", function(socket) {
    rtc.createStream({
        "video": true,
        "audio": true
    });
});

rtc.on("stream_created", function(stream) {

    if(isTeacher) {
        //teacher's view
        document.getElementById('teacherView').src = URL.createObjectURL(stream);
        document.getElementById('teacherView').play();
    } else {
        var newVideo = document.createElement("video")
        newVideo.setAttribute("class", "other");
        newVideo.setAttribute("autoplay", "autoplay");
        newVideo.setAttribute("id", userName);
        videos.appendChild(newVideo);
        rtc.attachStream(stream, userName);
    }
});

rtc.on("stream_create_error", function() {
    alert("create stream failed!");
});

rtc.on('pc_add_stream', function(stream, socketId, teacherflag) {
    console.log("new src video coming in, pc_add_stream, teacher: ", teacherflag);
    if(teacherflag) {
        //teacher's view
        document.getElementById('teacherView').src = URL.createObjectURL(stream);
        document.getElementById('teacherView').play();
        document.getElementById('teacherView').onclick = function () {
            console.log("click teacher, full screen");
            launchFullscreen(document.getElementById('teacherView'));
        };
    } else {
        var newVideo = document.createElement("video")
        newVideo.setAttribute("class", "other");
        newVideo.setAttribute("autoplay", "autoplay");
        newVideo.setAttribute("id", socketId);
        videos.appendChild(newVideo);
        rtc.attachStream(stream, socketId);
        newVideo.onclick = function () {
            console.log("click student, full screen");
            launchFullscreen(newVideo);
        };
    }
});

rtc.on('remove_peer', function(socketId, teacherflag) {
    console.log("remove peer video: ", socketId);
    if(teacherflag) {
        console.log("we didn't delete teacher video");
    } else {
        var video = document.getElementById(socketId);
        if(video){
            video.parentNode.removeChild(video);
        }
    }
});

//receive message
rtc.on('data_message', function(account, message){
    var p = document.createElement("p");
    p.innerText = account + ": " + message;
    msgs.appendChild(p);
});

//sedn message
sendBtn.onclick = function(event){
    var msgIpt = document.getElementById("msgIpt"),
        msg = msgIpt.value

    rtc.sendRoomMessage(msg);
    msgIpt.value = "";
};

var hostServer = window.location.href.substring(window.location.protocol.length).split('#')[0];
var roomName =  window.location.href.substring(window.location.protocol.length).split('#')[1];
var userName =  window.location.href.substring(window.location.protocol.length).split('#')[2];
var teacherflag =  window.location.href.substring(window.location.protocol.length).split('#')[3];
if(teacherflag === 'true'){
    isTeacher = true;
} else {
    isTeacher = false;
}

//format: http://52.11.111.157:3000/#roomName#AccountName#isTeacher
//  http://52.11.111.157:3000/#295B001#teacher#true

console.log("print host: ", hostServer);
console.log("print roomName: ", roomName);
console.log("print userName: ", userName);
console.log("print isTeacher: ", isTeacher);

if(typeof roomName == 'undefined'){
    roomName = "295B001"
}
if(typeof userName == 'undefined'){
    userName = "Student"
}

rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], roomName, userName, isTeacher);
//window.location.hash.slice(1), "student", true);

function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
}




//code below for video recording
var currentBrowser = !!navigator.mozGetUserMedia ? 'gecko' : 'chromium';
var fileName;
var audioRecorder;
var videoRecorder;
var isRecordOnlyAudio = !!navigator.mozGetUserMedia;

function postFiles(audio, video) {
    fileName = roomName;
    var files = {};
    files.audio = {
        name: fileName + '.' + audio.blob.type.split('/')[1],
        type: audio.blob.type,
        contents: audio.dataURL
    };

    if (video) {
        files.video = {
            name: fileName + '.' + video.blob.type.split('/')[1],
            type: video.blob.type,
            contents: video.dataURL
        };
    }

    files.uploadOnlyAudio = !video;
    xhr('/upload', JSON.stringify(files), function(_fileName) {
        //we don't need to playback, just silently upload this file to server
    });
}

//upload data through post api
function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };

    request.open('POST', url);
    request.send(data);
}

// generating random string
function generateRandomString() {
    if (window.crypto) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

// when btnStopRecording is clicked
function onStopRecording() {
    audioRecorder.getDataURL(function(audioDataURL) {
        var audio = {
            blob: audioRecorder.getBlob(),
            dataURL: audioDataURL
        };

        // if record both wav and webm
        if (!isRecordOnlyAudio) {
            videoRecorder.getDataURL(function(videoDataURL) {
                var video = {
                    blob: videoRecorder.getBlob(),
                    dataURL: videoDataURL
                };

                postFiles(audio, video);
            });
        }

        // if record only audio (either wav or ogg)
        if (isRecordOnlyAudio) postFiles(audio);
    });
}


var mediaStream = null;
function captureUserRecordingMedia(success_callback) {
    //get stream from the existing stream
    success_callback(rtc.getLocalStream());
}

// UI events handling, use open source library RecordRTC to store the streaming media
btnStartRecording.onclick = function() {
    console.log('click btnStartRecording');
    btnStartRecording.disabled = true;

    captureUserRecordingMedia(function(stream) {
        mediaStream = stream;
        var audioConfig = {};
        if (!isRecordOnlyAudio) {
            audioConfig.onAudioProcessStarted = function() {
                videoRecorder.startRecording();
            };
        }

        audioRecorder = RecordRTC(stream, audioConfig);
        if (!isRecordOnlyAudio) {
            var videoConfig = {
                type: 'video'
            };
            videoRecorder = RecordRTC(stream, videoConfig);
        }

        // enable stop-recording button
        btnStopRecording.disabled = false;
        audioRecorder.startRecording();
    });
};


btnStopRecording.onclick = function() {
    console.log('click btnStopRecording');
    btnStartRecording.disabled = false;
    btnStopRecording.disabled = true;

    if (isRecordOnlyAudio) {
        audioRecorder.stopRecording(onStopRecording);
    }

    if (!isRecordOnlyAudio) {
        audioRecorder.stopRecording(function() {
            videoRecorder.stopRecording(function() {
                onStopRecording();
            });
        });
    }
};


//code below used to share screen
var oldStream = null;

function getUserScreenMedia(options) {
    var n = navigator,
        media;
    n.getMedia = n.webkitGetUserMedia || n.mozGetUserMedia;
    n.getMedia(options.constraints || {
            audio: true,
            video: video_constraints
        }, streaming, options.onerror || function(e) {
            console.error(e);
        });

    function streaming(stream) {
        var video = options.video;
        if (video) {
            video.src = window.webkitURL.createObjectURL(stream);
            video.play();
        }
        options.onsuccess && options.onsuccess(stream);
        media = stream;
    }

    return media;
}

function captureUserMedia(callback, extensionAvailable) {
    console.log('captureUserMedia chromeMediaSource', DetectRTC.screen.chromeMediaSource);

    var screen_constraints = {
        mandatory: {
            chromeMediaSource: DetectRTC.screen.chromeMediaSource,
            maxWidth: screen.width > 1920 ? screen.width : 1920,
            maxHeight: screen.height > 1080 ? screen.height : 1080
        },
        optional: [{ // non-official Google-only optional constraints
            googTemporalLayeredScreencast: true
        }, {
            googLeakyBucket: true
        }]
    };

    if(isChrome && typeof extensionAvailable == 'undefined' && DetectRTC.screen.chromeMediaSource != 'desktop') {
        console.log('chromeMediaSource 1.');
        DetectRTC.screen.isChromeExtensionAvailable(function(available) {
            captureUserMedia(callback, available);
        });
        return;
    }

    if(isChrome && DetectRTC.screen.chromeMediaSource == 'desktop' && !DetectRTC.screen.sourceId) {
        console.log('chromeMediaSource 2.');
        DetectRTC.screen.getSourceId(function(error) {
            if(error && error == 'PermissionDeniedError') {
                alert('PermissionDeniedError: User denied to share content of his screen.');
            }

            captureUserMedia(callback);
        });
        return;
    }


    if(isChrome && DetectRTC.screen.chromeMediaSource == 'desktop') {
        screen_constraints.mandatory.chromeMediaSourceId = DetectRTC.screen.sourceId;
    }

    var constraints = {
        audio: false,
        video: screen_constraints
    };


    console.log( JSON.stringify( constraints , null, '\t') );
    if (isTeacher) {
        var video = document.getElementById('teacherView');
        video.setAttribute('autoplay', true);
        video.setAttribute('controls', true);
    } else {
        var video = document.getElementById(userName);
        video.setAttribute('autoplay', true);
        video.setAttribute('controls', true);
    }



    getUserScreenMedia({
        video: video,
        constraints: constraints,
        onsuccess: function(stream) {
            //remote desktop sharing and listen on "stop sharing"
            stream.getVideoTracks()[0].onended = function () {
                console.log('user stop the screen sharing.');
                if (isTeacher) {
                    document.getElementById('teacherView').src = URL.createObjectURL(oldStream);
                    document.getElementById('teacherView').play();
                } else {
                    document.getElementById(userName).src = URL.createObjectURL(oldStream);
                    document.getElementById(userName).play();
                }

                rtc.shareScreen(oldStream);
                DetectRTC.screen.sourceId = null
            };

            callback(stream);
        },
        onerror: function() {
            console.log('fail to create screen sharing stream.');
            if(!DetectRTC.screen.sourceId) {
                alert('source of shared screen still available.');
            }
        }
    });

}

document.getElementById('sharescreen').onclick = function() {
    console.log('click sharescreen');
    captureUserMedia(function(stream) {
        //invoke webrtc p2p connection for desktop sharing
        console.log('create screen sharing stream, share it with others.');
        oldStream = rtc.shareScreen(stream);
    });
};

//dont change following code, it's used to detect the extension and get source id
var isChrome = !!navigator.webkitGetUserMedia;
var DetectRTC = {};

(function () {
    var screenCallback;

    DetectRTC.screen = {
        chromeMediaSource: 'screen',
        getSourceId: function(callback) {
            if(!callback) throw '"callback" parameter is mandatory.';
            screenCallback = callback;
            window.postMessage('get-sourceId', '*');
        },
        isChromeExtensionAvailable: function(callback) {
            if(!callback) return;

            if(DetectRTC.screen.chromeMediaSource == 'desktop') return callback(true);

            // ask extension if it is available
            window.postMessage('are-you-there', '*');

            setTimeout(function() {
                if(DetectRTC.screen.chromeMediaSource == 'screen') {
                    callback(false);
                }
                else callback(true);
            }, 2000);
        },
        onMessageCallback: function(data) {
            if (!(typeof data == 'string' || !!data.sourceId)) return;

            console.log('chrome message', data);

            // "cancel" button is clicked
            if(data == 'PermissionDeniedError') {
                DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                if(screenCallback) return screenCallback('PermissionDeniedError');
                else throw new Error('PermissionDeniedError');
            }

            // extension notified his presence
            if(data == 'rtcmulticonnection-extension-loaded') {
                DetectRTC.screen.chromeMediaSource = 'desktop';
            }

            // extension shared temp sourceId
            if(data.sourceId) {
                DetectRTC.screen.sourceId = data.sourceId;
                if(screenCallback) screenCallback( DetectRTC.screen.sourceId );
            }
        },
        getChromeExtensionStatus: function (callback) {
            if (!!navigator.mozGetUserMedia) return callback('not-chrome');

            var extensionid = 'aohiapichhacaiepmeoccofpommjpfjc';

            var image = document.createElement('img');
            image.src = 'chrome-extension://' + extensionid + '/icon.png';
            image.onload = function () {
                DetectRTC.screen.chromeMediaSource = 'screen';
                window.postMessage('are-you-there', '*');
                setTimeout(function () {
                    if (!DetectRTC.screen.notInstalled) {
                        callback('installed-enabled');
                    }
                }, 2000);
            };
            image.onerror = function () {
                DetectRTC.screen.notInstalled = true;
                callback('not-installed');
            };
        }
    };

    // check if desktop-capture extension installed.
    if(window.postMessage && isChrome) {
        DetectRTC.screen.isChromeExtensionAvailable();
    }
})();

DetectRTC.screen.getChromeExtensionStatus(function(status) {
    if(status == 'installed-enabled') {
        console.log('detect Extension installed.');
        DetectRTC.screen.chromeMediaSource = 'desktop';
    }
});

window.addEventListener('message', function (event) {
    if (event.origin != window.location.origin) {
        return;
    }

    DetectRTC.screen.onMessageCallback(event.data);
});

console.log('current chromeMediaSource', DetectRTC.screen.chromeMediaSource);