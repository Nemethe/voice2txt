const fs = require('fs')
const recordLPCM16 = require('node-record-lpcm16');
const eventStream = require('event-stream');

class RecordClass {
	constructor(configObject = {}, callback = () => {}) {
		var self = this;

		this.config = Object.assign({
			stopIfSilence: false,
			secondsOfSilence: 0.5,
			timeSeconds: 0,
			countTime: false,
			log: false
		}, configObject);
		this.configLPCM16 = {};

		if (this.config.stopIfSilence) Object.assign(this.configLPCM16, {
			thresholdEnd: this.config.secondsOfSilence
		});

		this.callback = callback;

		this.WriteStream = eventStream.wait((err, data) => {
		  	self.callback(data);
		});
	}

	start() {
		recordLPCM16.start(this.configLPCM16).pipe(this.WriteStream);

		if (this.config.log) {
			console.log('record start');
		}

		if (this.config.timeSeconds) {
			if (this.config.countTime) this.countTime();

			setTimeout(this.stop.bind(this), this.config.timeSeconds * 1000);
		}
	}

	countTime() {
		var self = this;
		for (var i = this.config.timeSeconds; i > 0; i--) {
			setTimeout(function () {
				console.log(this.i + 's / ' + self.config.timeSeconds + 's');
			}.bind({i: i}), (this.config.timeSeconds - i) * 1000);
		}
	}

	stop() {
		recordLPCM16.stop();

		if (this.config.log) console.log('record stop');
	}
}

exports.RecordClass = RecordClass;