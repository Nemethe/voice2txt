const Voice2txt = require('./index.js');
Voice2txt.globalConfig({
  speechClientConfig: {
    projectId: '',
    jsonKeyFilename: './key-file.json'
  },
  timeSeconds: 3,
  countTime: true,
  languageCode: 'pl-PL'
});

Voice2txt.startRecord().then((text) => {
  console.log('Text: ' + text);
});