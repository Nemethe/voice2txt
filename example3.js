const Voice2txt = require('./index.js');
Voice2txt.globalConfig({
  speechClientConfig: {
    projectId: '',
    jsonKeyFilename: './key-file.json'
  },
  stopIfSilence: true,
  secondsOfSilence: 0.5,
  languageCode: 'pl-PL'
});

Voice2txt.startRecord().then((text) => {
  console.log('Text: ' + text);
});
