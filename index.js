const Record = require('./components/record.js').RecordClass;
const GoogleSpeechClient = require('./components/googleSpeech.js');

var globalConfig = {};

class Voice2txt {
	constructor(configObject = {}) {
		var self = this;

		this.config = Object.assign({
			log: false,
			languageCode: 'en-US',
			speechClientConfig: {
				projectId: false,
				jsonKeyFilename: false
			}
		}, configObject);

	    this.callback = () => {
			if (self.config.log) console.log('callback not set');
		};
		this.errorCallback = () => {
			if (self.config.log) console.log('error catch not set');
		};

		this.googleSpeechClient = GoogleSpeechClient.config(
			Object.assign(
				this.config.speechClientConfig,
				{
					log: this.config.log,
					languageCode: this.config.languageCode
				}
			)
		);

		this.recordInstance = new Record(this.config, (data) => {
			self.googleSpeechClient.run(data).then(self.callback).catch(self.errorCallback);
		});

		this.returnObject = {
			then: this.then.bind(this),
			catch: this.catch.bind(this),
			startRecord: this.startRecord.bind(this),
			stopRecord: this.stopRecord.bind(this)
		};

		return this.returnObject;
	}

	then(callback) {
		if (this.config.log) console.log('callback set');

		this.callback = callback;

		return this.returnObject;
	}

	catch(errorCallback) {
		if (this.config.log) console.log('error catch set');

		this.errorCallback = errorCallback;

		return this.returnObject;
	}

	startRecord() {
		this.recordInstance.start();

		return this.returnObject;
	}

	stopRecord() {
		this.recordInstance.stop();

		return this.returnObject;
	}
}

exports.globalConfig = (configObject = {}) => {
	Object.assign(globalConfig, configObject);
}

exports.config = (configObject = {}) => {
	return new Voice2txt(Object.assign(globalConfig, configObject));
}

exports.startRecord = () => {
	return new Voice2txt(globalConfig).startRecord();
}
