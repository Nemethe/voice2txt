const Voice2txt = require('./index.js');
Voice2txt.globalConfig({
  speechClientConfig: {
    projectId: '',
    jsonKeyFilename: './key-file.json'
  }
});

console.log('3s, start talking:');

var instance = Voice2txt.config({
  // log: true,
  languageCode: 'pl-PL'
}).then((text) => {
  console.log('Text: ' + text);
}).catch(() => {
  console.log(`I didn't uanderstand what you've said`);
}).startRecord();


setTimeout(instance.stopRecord.bind(instance), 3000);