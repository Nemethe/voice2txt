const speech = require('@google-cloud/speech');
const fs = require('fs');

class GoogleSpeechClient {
  constructor(configObject = {}) {
    this.config = Object.assign({
      log: false,
      languageCode: 'en-US',
      projectId: false,
      jsonKeyFilename: false,
    }, configObject);

    if (!this.config.projectId || !this.config.jsonKeyFilename) {
      console.log(`Google SpeechClient API config not set.\nVisit https://console.cloud.google.com/project for project ID\nGenerate JSON key file (Google Compute Engine) on
https://console.cloud.google.com/flows/enableapi?apiid=speech.googleapis.com`);
      process.exit();
    }

    this.client = new speech.SpeechClient({
      projectId: this.config.projectId,
      keyFilename: this.config.jsonKeyFilename
    });
  }

  run(data) {
    var self = this;

    return new Promise((resolve, reject) => {
      self.request = {
        audio: {
          content: data.toString('base64')
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: self.config.languageCode,
        }
      };

      self.client.recognize(self.request).then(data => {
        const response = data[0];
        const transcription = response.results
        .map(result => result.alternatives[0].transcript);

        if (self.config.log) console.log(`Text: ${transcription}`);

        if (transcription.toString().trim().length) {
          resolve(transcription);
        } else {
          reject('empty string');
        }
      }).catch(err => {
        if (self.config.log) console.error('ERROR:', err);
        reject(err);
      });
    });
  }
}

exports.config = (configObject = {}) => {
  return new GoogleSpeechClient(configObject);
}