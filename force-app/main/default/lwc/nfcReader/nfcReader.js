import { LightningElement } from 'lwc';
import { getNfcService } from 'lightning/mobileCapabilities';

const URI = 'uri';
const TEXT = 'text';

export default class NfcReader extends LightningElement {
    showNfcMenu = false;
    status;
    nfcService;
    type;
    textValue;

    uri = URI;
    text = TEXT;

    connectedCallback() {
      this.nfcService = getNfcService();
      this.showNfcMenu = true;
    }

    get options() {
        return [
            { label: 'URI', value: this.uri },
            { label: 'Text', value: this.text }
        ];
    }

    handleTypeChange(event) {
        this.type = event.detail.value;
    }

    get showTextInput() {
        return this.type?.length > 0;
    }

    handleTextInputChange(event) {
        this.textValue = event.detail.value;
    }

    get showSaveButton() {
        return this.textValue?.length > 0;
    }

    handleReadClick() {
        if (this.nfcService.isAvailable()) {
            const options = {
                "instructionText": "Hold your phone near the tag to read.",
                "successText": "Tag read successfully!"
            };

            this.nfcService.read(options)
                .then((result) => {
                    this.status = JSON.stringify(result, undefined, 2);
                })
                .catch((error) => {
                    this.status = 'Error code: ' + error.code + '\nError message: ' + error.message;
                });
        } else {
            this.status = 'Problem initiating NFC service. Are you using a mobile device?';
        }
    }

    handleEraseClick() {
        if (this.nfcService.isAvailable()) {
            const options = {
                "instructionText": "Hold your phone near the tag to erase.",
                "successText": "Tag erased successfully!"
            };

            this.nfcService.erase(options)
                .then(() => {
                    this.status = "Tag erased successfully!";
            })
            .catch((error) => {
                // TODO: Handle errors
                this.status = 'Error code: ' + error.code + '\nError message: ' + error.message;
            });
        } else {
            this.status = 'Problem initiating NFC service. Are you using a mobile device?';
        }
    }

    handleWriteClick() {
        this.showNfcMenu = false;    
    }

    async handleWrite() {
        if (this.nfcService.isAvailable()) {
            const options = {
                "instructionText": "Hold your phone near the tag to write.",
                "successText": "Tag written successfully!"
            };

            const payload = await this.createWritePayload();
        
            this.nfcService.write(payload, options)
                .then(() => {
                    this.status = "Tag written successfully!";
                })
                .catch((error) => {
                    // TODO: Handle errors
                    this.status = 'Error code: ' + error.code + '\nError message: ' + error.message;
                });
        } else {
            this.status = 'Problem initiating NFC service. Are you using a mobile device?';
        }
    }

    async createWritePayload() {
      let record;

      if (this.type === this.uri) {
        record = await this.nfcService.createUriRecord(this.textValue);
      } else {
        record = await this.nfcService.createTextRecord({text: this.textValue, langId: "en"});
      }
      
      return [record];
    }
}