# voice2txt

Simple voice recognition based on [Google Speech API](https://github.com/googleapis/nodejs-speech)
with handy promise callbacks.

## Installation

`npm i voice2txt --save`

## Dependencies

This module is base on
[node-record-lpcm16](https://github.com/gillesdemey/node-record-lpcm16) &
[nodejs-speech](https://github.com/googleapis/nodejs-speech)

You need to install [SoX](http://sox.sourceforge.net) and it must be available in your `$PATH`.

### For Mac OS
`brew install sox` install with [homebrew](https://brew.sh/)

### For most linux disto's
`sudo apt-get install sox libsox-fmt-all`

### For Windows
[download the binaries](http://sourceforge.net/projects/sox/files/latest/download)

## Configuration

At first you have to register in Google Cloud, follow steps:

1.  Select or create a Cloud Platform project.

    [Go to the projects page][projects]

1.  Enable billing for your project.

    [Enable billing][billing]

1.  Enable the Google Cloud Speech API API.

    [Enable the API][enable_api]

1.  [Set up authentication with a service account][auth] so you can access the
    API from your local workstation.

[projects]: https://console.cloud.google.com/project
[billing]: https://support.google.com/cloud/answer/6293499#enable-billing
[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=speech.googleapis.com
[auth]: https://cloud.google.com/docs/authentication/getting-started

### Config object

```
speechClientConfig: object [speech.SpeechClient][you must define projectId & jsonKeyFilename - url to file]
timeSeconds: number [number of seconds to auto stop recording]
countTime: true | false [if true you'll see time count in cmd]
stopIfSilence: true | false [if true auto stop recording on (default) .5s of silence]
secondsOfSilence: number [time for stopIfSilence]
log: true | false [if true you'll see logs in cmd]
languageCode: string [recognition language]
```

[supported languages](https://cloud.google.com/speech/docs/languages)

### There are two ways of configure solution

Local config

```
Voice2txt.config({
  speechClientConfig: {
    projectId: 'project-id-123',
    jsonKeyFilename: './url-to-key-file.json'
  },
  stopIfSilence: true,
  secondsOfSilence: 0.5,
  languageCode: 'pl-PL'
}).startRecord().then((text) => {
  console.log('Text: ' + text);
}).catch(() => {
  console.log(`I didn't uanderstand what you've said`);
});
```

Global config

```
const Voice2txt = require('voice2txt');

Voice2txt.globalConfig({
  speechClientConfig: {
    projectId: '',
    jsonKeyFilename: './url-to-key-file.json'
  },
  timeSeconds: 3,
  countTime: true,
  languageCode: 'pl-PL'
});
```

You can also overwrite global config for one of instance

```
Voice2txt.config({
  timeSeconds: 5
}).startRecord().then((text) => {
  console.log('Text: ' + text);
});
```

## Usage

String literal available

```
const Voice2txt = require('voice2txt');
Voice2txt.globalConfig({
	speechClientConfig: {
		projectId: '',
		jsonKeyFilename: './url-to-key-file.json'
	},
	countTime: true,
	log: true
});

function error(err) {
	console.log(`I didn't uanderstand what you've said`);
}

function success(text) {
	console.log('Text: ' + text);
}

Voice2txt.config({
	timeSeconds: 3,
	languageCode: 'pl-PL'
}).then(success).catch(error).startRecord();
```

### Methods

`then(function)` success callback (string - recognized voice in text)

`catch(function)` error callback (error object)

`startRecord()` run voice recognition

`stopRecord()` stop recognition and promise one of callbacks

`config(object)` config (configObject)

`globalConfig(object)` global config (configObject)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
