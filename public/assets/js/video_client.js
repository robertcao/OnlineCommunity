var ClassVideo = function() {
    var PeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
    var URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    var nativeRTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
    var nativeRTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined in Nighly but useless
    var moz = !!navigator.mozGetUserMedia;

		var iceServer = [];
		iceServer.push({
		    url: 'stun:stun.l.google.com:19302'
		});		
		iceServer = {
		    iceServers: iceServer
		};
    
    
    function EventEmitter() {
        this.events = {};
    }

    EventEmitter.prototype.on = function(eventName, callback) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(callback);
    };

    EventEmitter.prototype.emit = function(eventName, _) {
        var events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].apply(null, args);
        }
    };


    function cvideortc() {

        this.localMediaStream = null;
        this.localMediaStreamBak = null;
        this.room = "";
        this.fileData = {};
        this.socket = null;
        this.me = null;
        this.peerConnections = {};
        this.connections = [];
        this.numStreams = 0;
        this.initializedStreams = 0;
        this.dataChannels = {};
        this.fileChannels = {};
        this.teacher;
        this.localTeacher = false;
        this.localUserName;
    }

    cvideortc.prototype = new EventEmitter();


    cvideortc.prototype.connect = function(server, room, account, isTeacher) {
    	  //account and isTeacher should be passed by yuan's module
        var socket,
            that = this;
        room = room || "";
        this.localTeacher = isTeacher;
        this.localUserName = account;
        socket = this.socket = new WebSocket(server);
        socket.onopen = function() {
            socket.send(JSON.stringify({
                "eventName": "__join",
                "data": {
                    "room": room,
                    "app": "browser",
                    "account": account,
                    "isteacher": isTeacher
                }
            }));
            that.emit("socket_opened", socket);
        };

        socket.onmessage = function(message) {
            var json = JSON.parse(message.data);
            if (json.eventName) {
                that.emit(json.eventName, json.data);
            } else {
                that.emit("socket_receive_message", socket, json);
            }
        };

        socket.onerror = function(error) {
            that.emit("socket_error", error, socket);
        };

        socket.onclose = function(data) {
            that.localMediaStream.close();
            var pcs = that.peerConnections;
            for (i = pcs.length; i--;) {
                that.closePeerConnection(pcs[i]);
            }
            that.peerConnections = [];
            that.dataChannels = {};
            that.fileChannels = {};
            that.connections = [];
            that.fileData = {};
            that.emit('socket_closed', socket);
        };

        this.on('_peers', function(data) {
            that.connections = data.connections;
            that.me = data.you;
            that.teacher = data.teacherSockID;  //this is teacher socket id
            that.emit("get_peers", that.connections);
            that.emit('connected', socket);
            console.log("receive _peers ", data);
        });
        
        this.on('_peers_ext', function(data) {
            that.connections = data.connections;
            that.me = data.you;
            that.teacher = data.teacherSockID;  //this is teacher socket id
            that.emit("get_peers", that.connections);
            that.emit("ready");
            console.log("receive _peers_ext ", data);
        });
        
        this.on("_ice_candidate", function(data) {
            var candidate = new nativeRTCIceCandidate(data);
            var pc = that.peerConnections[data.socketId];
            pc.addIceCandidate(candidate);
            that.emit('get_ice_candidate', candidate);
        });

        this.on('_new_peer', function(data) {
        	  if(data.isteacher) {
        	  	that.teacher = data.socketId
        	  }
            that.connections.push(data.socketId);
            var pc = that.createPeerConnection(data.socketId),
                i, m;
            pc.addStream(that.localMediaStream);
            that.emit('new_peer', data.socketId);
            console.log("receive new_peer ", data);
        });

        this.on('_new_peer_ext', function(data) {
        	  if(data.isteacher) {
        	  	that.teacher = data.socketId
        	  }
        	  
        	  //add unique socketid only
        	  var oldPc;
        	  var findSocket = false;
        	  var tempConnections = that.connections;
        	  console.log("data.socketId: ", data.socketId);
            for (i = 0, m = tempConnections.length; i < m; i++) {
              console.log("that.connections[i]: ", tempConnections[i]);
	        	  if(tempConnections[i] === data.socketId){ 
	        	  	oldPc = that.peerConnections[tempConnections[i]];
	        	  	that.closePeerConnection(oldPc);
	        	  	findSocket = true;
	        		}
        		}
            if(!findSocket) {
        			that.connections.push(data.socketId);
	        	}
	        	  
            var pc = that.createPeerConnection(data.socketId),
                i, m;
            pc.addStream(that.localMediaStream);
            that.emit('new_peer', data.socketId);
            console.log("receive new_peer ", data);
        });
        
        this.on('_remove_peer', function(data) {
            var sendId, teacherflag;
            console.log("receive _remove_peer ", data);
            that.closePeerConnection(that.peerConnections[data.socketId]);
            delete that.connections[data.socketId];
            delete that.peerConnections[data.socketId];
            delete that.dataChannels[data.socketId];
            for (sendId in that.fileChannels[data.socketId]) {
                that.emit("send_file_error", new Error("Connection has been closed"), data.socketId, sendId, that.fileChannels[data.socketId][sendId].file);
            }
            delete that.fileChannels[data.socketId];
            
            if(that.teacher === data.socketId) {
        	  	teacherflag = true;
        	  } else {
        	  	teacherflag =false;
        	  }

            that.emit("remove_peer", data.socketId, teacherflag);
        });

        this.on('_offer', function(data) {
            that.receiveOffer(data.socketId, data.sdp);
            that.emit("get_offer", data);
        });

        this.on('_answer', function(data) {
            that.receiveAnswer(data.socketId, data.sdp);
            that.emit('get_answer', data);
        });

        this.on('send_file_error', function(error, socketId, sendId, file) {
            that.cleanSendFile(sendId, socketId);
        });

        this.on('receive_file_error', function(error, sendId) {
            that.cleanReceiveFile(sendId);
        });

        this.on('ready', function() {
        	  console.log('ready to establish new p2p connection');
            that.createPeerConnections();
            that.addStreams();
            that.addDataChannels();
            that.sendOffers();
        });
        
        this.on('new_message', function(data) {
        	//display on webpage
          that.emit('data_message', data.account, data.description);  
        });
        
        //update stun server
        this.on('_stunServer', function(data) {
          iceServer = [];
          //always set the default stun server, webrtc will try them all
					iceServer.push({
					    url: 'stun:stun.l.google.com:19302'
					});		
					iceServer.push({
					    url: data.server
					});	
					iceServer = {
					    iceServers: iceServers
					};  
        });          
    };

    cvideortc.prototype.getLocalStream = function() {
    	return this.localMediaStream;
    }

    cvideortc.prototype.getLocalSocketID = function() {
    	return this.me;
    }
      
    //remote desktop screen sharing
  	cvideortc.prototype.shareScreen = function(stream) {
  		console.log('shareScreen');
  		this.socket.send(JSON.stringify({
                        "eventName": "__clear_me",
                        "data": {
                        	  "account" : this.localUserName,
                            "isteacher": this.localTeacher
                        }
                    }));
  		this.localMediaStreamBak = this.localMediaStream;
  		this.localMediaStream = stream;
  		
      var pcs = this.peerConnections;
      for (i = pcs.length; i--;) {
          this.closePeerConnection(pcs[i]);
      }
      this.peerConnections = [];
  		this.emit("ready");
  		return this.localMediaStreamBak
  	}
  
    cvideortc.prototype.close = function() {
    	console.log("close websocket");
    	this.socket.close();
    }
  
    cvideortc.prototype.createStream = function(options) {
        var that = this;
        console.log('createStream');
        options.video = !!options.video;
        options.audio = !!options.audio;

        if (getUserMedia) {
            this.numStreams++;
            getUserMedia.call(navigator, options, function(stream) {
                    that.localMediaStream = stream;
                    that.initializedStreams++;
                    that.emit("stream_created", stream);
                    if (that.initializedStreams === that.numStreams) {
                        that.emit("ready");
                    }
                },
                function(error) {
                    that.emit("stream_create_error", error);
                });
        } else {
            that.emit("stream_create_error", new Error('WebRTC is not yet supported in this browser.'));
        }
    };


    cvideortc.prototype.addStreams = function() {
        var i, m,
            stream,
            connection;
        for (connection in this.peerConnections) {
            this.peerConnections[connection].addStream(this.localMediaStream);
        }
    };


    cvideortc.prototype.attachStream = function(stream, domId) {
        var element = document.getElementById(domId);
        if (navigator.mozGetUserMedia) {
            element.mozSrcObject = stream;
            element.play();
        } else {
            element.src = webkitURL.createObjectURL(stream);
        }
        element.src = webkitURL.createObjectURL(stream);
    };



    cvideortc.prototype.sendOffers = function() {
        var i, m,
            pc,
            that = this,
            pcCreateOfferCbGen = function(pc, socketId) {
                return function(session_desc) {
                	  console.log('send offers');
                    pc.setLocalDescription(session_desc);
                    that.socket.send(JSON.stringify({
                        "eventName": "__offer",
                        "data": {
                            "sdp": session_desc,
                            "socketId": socketId
                        }
                    }));
                };
            },
            pcCreateOfferErrorCb = function(error) {
                console.log(error);
            };
            
        console.log('prepare for sending Offers');
        for (i = 0, m = this.connections.length; i < m; i++) {
        	  console.log("connection id for sending offer: ", this.connections[i]);
            pc = this.peerConnections[this.connections[i]];
            pc.createOffer(pcCreateOfferCbGen(pc, this.connections[i]), pcCreateOfferErrorCb);
        }
    };


    cvideortc.prototype.receiveOffer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId];
        console.log('receiveOffer');
        this.sendAnswer(socketId, sdp);
    };


    cvideortc.prototype.sendAnswer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId];
        var that = this;
        console.log('sendAnswer');
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
        pc.createAnswer(function(session_desc) {
            pc.setLocalDescription(session_desc);
            that.socket.send(JSON.stringify({
                "eventName": "__answer",
                "data": {
                    "socketId": socketId,
                    "sdp": session_desc
                }
            }));
        }, function(error) {
            console.log(error);
        });
    };

 
    cvideortc.prototype.receiveAnswer = function(socketId, sdp) {
        var pc = this.peerConnections[socketId];
        console.log('receiveAnswer');
        pc.setRemoteDescription(new nativeRTCSessionDescription(sdp));
    };



    cvideortc.prototype.createPeerConnections = function() {
        var i, m;
        for (i = 0, m = this.connections.length; i < m; i++) {
            this.createPeerConnection(this.connections[i]);
        }
    };


    cvideortc.prototype.createPeerConnection = function(socketId) {
        var that = this;
        var pc = new PeerConnection(iceServer);
        this.peerConnections[socketId] = pc;
        pc.onicecandidate = function(evt) {
            if (evt.candidate)
                that.socket.send(JSON.stringify({
                    "eventName": "__ice_candidate",
                    "data": {
                        "label": evt.candidate.sdpMLineIndex,
                        "candidate": evt.candidate.candidate,
                       "id": evt.candidate.sdpMid,
                        "socketId": socketId
                    }
                }));
            that.emit("pc_get_ice_candidate", evt.candidate, socketId, pc);
        };

        pc.onopen = function() {
            that.emit("pc_opened", socketId, pc);
        };

        pc.onaddstream = function(evt) {
        	  if(that.teacher === socketId) {
        	  	teacherflag = true;
        	  } else {
        	  	teacherflag =false;
        	  }
        	  
            that.emit('pc_add_stream', evt.stream, socketId, teacherflag, pc);
        };

        pc.ondatachannel = function(evt) {
            that.addDataChannel(socketId, evt.channel);
            that.emit('pc_add_data_channel', evt.channel, socketId, pc);
        };
        return pc;
    };


    cvideortc.prototype.closePeerConnection = function(pc) {
        if (!pc) return;
        pc.close();
    };


    //send message to server, and it will broadcast to every endpoint
    cvideortc.prototype.sendRoomMessage = function(message) {
        this.socket.send(JSON.stringify({
                "eventName": "add_message_browser",
                "data": {
                        "description": message
                }
                
        }));
    };


    cvideortc.prototype.broadcast = function(message) {
        var socketId;
        for (socketId in this.dataChannels) {
            this.sendMessage(message, socketId);
        }
    };


    cvideortc.prototype.sendMessage = function(message, socketId) {
        if (this.dataChannels[socketId].readyState.toLowerCase() === 'open') {
            this.dataChannels[socketId].send(JSON.stringify({
                type: "__msg",
                data: message
            }));
        }
    };

 		cvideortc.prototype.addDataChannels = function() {
        var connection;
        for (connection in this.peerConnections) {
            this.createDataChannel(connection);
        }
    };


    cvideortc.prototype.createDataChannel = function(socketId, label) {
        var pc, key, channel;
        pc = this.peerConnections[socketId];

        if (!socketId) {
            this.emit("data_channel_create_error", socketId, new Error("attempt to create data channel without socket id"));
        }

        if (!(pc instanceof PeerConnection)) {
            this.emit("data_channel_create_error", socketId, new Error("attempt to create data channel without peerConnection"));
        }
        try {
            channel = pc.createDataChannel(label);
        } catch (error) {
            this.emit("data_channel_create_error", socketId, error);
        }

        return this.addDataChannel(socketId, channel);
    };


    cvideortc.prototype.addDataChannel = function(socketId, channel) {
        var that = this;
        channel.onopen = function() {
            that.emit('data_channel_opened', channel, socketId);
        };

        channel.onclose = function(event) {
            delete that.dataChannels[socketId];
            that.emit('data_channel_closed', channel, socketId);
        };

        channel.onmessage = function(message) {
            var json;
            json = JSON.parse(message.data);
            if (json.type === '__file') {

                that.parseFilePacket(json, socketId);
            } else {
                that.emit('data_channel_message', channel, socketId, json.data);
            }
        };

        channel.onerror = function(err) {
            that.emit('data_channel_error', channel, socketId, err);
        };

        this.dataChannels[socketId] = channel;
        return channel;
    };


    return new cvideortc();
};
