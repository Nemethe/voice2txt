const Record = require('./components/record.js').RecordClass;
const GoogleSpeechClient = require('./components/googleSpeech.js');

var globalConfig = {};

class Voice2txt {
	constructor(configObject = {}) {
		this.waitForConfig = false;
		this.returnObject = {
			then: this.then.bind(this),
			catch: this.catch.bind(this),
			startRecord: this.startRecord.bind(this),
			stopRecord: this.stopRecord.bind(this),
			config: this.config.bind(this)
		};

		configObject = Object.assign(globalConfig, configObject);

		if (Object.keys(configObject).length !== 0) return this.start(configObject);

		return this.returnObject;
	}

	start(configObject) {
		var self = this;

		this.configObject = Object.assign({
			log: false,
			languageCode: 'en-US',
			speechClientConfig: {
				projectId: false,
				jsonKeyFilename: false
			}
		}, configObject);

		if (!('callback' in this))
		    this.callback = () => {
				if (self.configObject.log) console.log('callback not set');
			};
		if (!('errorCallback' in this))
		this.errorCallback = () => {
			if (self.configObject.log) console.log('error catch not set');
		};

		this.googleSpeechClient = GoogleSpeechClient.config(
			Object.assign(
				this.configObject.speechClientConfig,
				{
					log: this.configObject.log,
					languageCode: this.configObject.languageCode
				}
			)
		);

		this.recordInstance = new Record(this.configObject, (data) => {
			self.googleSpeechClient.run(data).then(self.callback).catch(self.errorCallback);
		});

		if ('startAfter' in this) this.recordInstance.start();

		return this.returnObject;
	}

	config(configObject = {}) {
		if (!('configObject' in this) && Object.keys(configObject).length !== 0) return this.start(configObject);

		Object.assign(this.configObject, configObject);

		return this.returnObject;
	}

	then(callback) {
		if ('configObject' in this && this.configObject.log) console.log('callback set');

		this.callback = callback;

		return this.returnObject;
	}

	catch(errorCallback) {
		if ('configObject' in this && this.configObject.log) console.log('error catch set');

		this.errorCallback = errorCallback;

		return this.returnObject;
	}

	startRecord() {
		if ('configObject' in this) this.recordInstance.start();
		else this.startAfter = true;

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
	return new Voice2txt(configObject);
}

exports.then = (callback) => {
	return new Voice2txt().then(callback);
}

exports.catch = (callback) => {
	return new Voice2txt().catch(callback);
}

exports.startRecord = () => {
	return new Voice2txt(globalConfig).startRecord();
}
