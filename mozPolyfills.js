if (!navigator['mozSetMessageHandler']) {
	navigator['mozSetMessageHandler'] = function(activity, callback) {
		if (activity === 'open') {
			// TODO
			return false;
		}
	};
}

/**
 * Load fake WebActivity
 * @constructor
 * @param {config} the config for the webactivity
 */

window['MozActivity'] = function(config) {
	//pick image
	if (config.name === 'pick') {
		input = document.createElement('input');
		input.type = 'file';
		if (config.data && config.data.type) {
			input.accept = config.data.type.join();
		}
		input.addEventListener('change', function(e) {
			files = e.target.files; // FileList object

			if (files.length === 0) {
				return;
			}

			if (typeof config.data !== 'undefined') {
				//check mimetype
				if (typeof config.data.type !== 'undefined') {
					if (files[0].type !== '' && config.data.type.indexOf(files[0].type) < 0) {
						return;
					}
				}
			}

			this.result = {
				blob: files[0]
			};

			if (this.onsuccess) {
				this.onsuccess();
			}

		}.bind(this), false);

		input.click();
	} else if (config.name === 'record') {
		navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

		var _body = document.getElementsByTagName('body')[0];
		var video = document.createElement("video");
//		 video.style.visibility = 'hidden';
		var canvas = document.createElement("canvas");
//		 canvas.style.visibility = 'hidden';
		_body.appendChild(video);
		_body.appendChild(canvas);

		navigator.getMedia({video: true, audio: false},
		function(stream) {
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			video.play();
		},
				function(err) {
					if (this.error) {
						this.error();
					}
				}
		);
		video.addEventListener('canplay', function(ev) {
			canvas.width = video.clientWidth;
			canvas.height = video.clientHeight;
			canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

			this.result = {
				blob: canvas.toDataURL('image/png')
			};

			if (this.onsuccess) {
				this.onsuccess();
//				_body.removeChild(video);
//				_body.removeChild(canvas);
			}

		}.bind(this), false);
	} else if (config.name === 'dial') {
		//fake dialing
			alert('Dialing with ' + config.data.number);
			this.onsuccess();
	} else if (config.name === 'new') {
		if(config.data.type == 'websms/sms') {
			//fake sms
			alert('New sms to '+ config.data.number);
		} else if(config.data.type == 'webcontacts/contact') {
			//fake sms
			contact = 'Contact: ' + config.data.params.givenName + ' ' + config.data.params.lastName;
			contact += '\nNumber: ' + config.data.params.tel + '\nEmail:' + config.data.params.email;
			contact += '\nAddress: ' + config.data.params.address + '\nCompany:' + config.data.params.company;
			contact += '\nnote: ' + config.data.params.note;
			alert(contact);
		}
		if (this.onsuccess) {
			this.onsuccess();
		}
	}
};
window['MozActivity'].prototype = {
	constructor: window['MozActivity']
};

