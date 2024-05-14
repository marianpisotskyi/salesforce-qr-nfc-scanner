import { LightningElement } from 'lwc';
import { getNfcService } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createNfcAction from '@salesforce/apex/NFCActionController.createNfcAction';

const URI = 'uri';
const TEXT = 'text';

const READ = 'Read';
const WRITE = 'Write';
const ERASE = 'Erase';

export default class NfcReader extends LightningElement {
    showNfcMenu = false;
    status;
    nfcService;
    type;
    textValue;

    uri = URI;
    text = TEXT;

    read = READ;
    write = WRITE;
    erase = ERASE;

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
        this.status = '';

        if (this.nfcService.isAvailable()) {
            let readText = 'Tag read successfully!';

            const options = {
                'instructionText': 'Hold your phone near the tag to read.',
                'successText': readText
            };

            this.nfcService.read(options)
                .then((result) => {
                    this.status = JSON.stringify(result, undefined, 2);

                    this.showToast('Success', readText, 'success');
                    this.createNfcAction(this.read, this.status);
                })
                .catch((error) => {
                    this.status = 'Error code: ' + error.code + '\nError message: ' + error.message;

                    this.showToast('Error', this.status, 'error');
                });
        } else {
            this.status = 'Problem initiating NFC service. Are you using a mobile device?';

            this.showToast('Error', this.status, 'error');
        }
    }

    handleEraseClick() {
        this.status = '';

        if (this.nfcService.isAvailable()) {
            const options = {
                'instructionText': 'Hold your phone near the tag to erase.',
                'successText': 'Tag erased successfully!'
            };

            this.nfcService.erase(options)
                .then(() => {
                    this.status = 'Tag erased successfully!';

                    this.showToast('Success', this.status, 'success');
                    this.createNfcAction(this.erase, '');
                })
                .catch((error) => {
                    this.status = 'Error code: ' + error.code + '\nError message: ' + error.message;
                    
                    this.showToast('Error', this.status, 'error');
                });
        } else {
            this.status = 'Problem initiating NFC service. Are you using a mobile device?';

            this.showToast('Error', this.status, 'error');
        }
    }

    handleWriteClick() {
        this.status = '';

        this.showNfcMenu = false;    
    }

    async handleWrite() {
        if (this.nfcService.isAvailable()) {
            const options = {
                'instructionText': 'Hold your phone near the tag to write.',
                'successText': 'Tag written successfully!'
            };

            const payload = await this.createWritePayload();
        
            this.nfcService.write(payload, options)
                .then(() => {
                    this.status = 'Tag written successfully!';

                    this.createNfcAction(this.write, this.textValue);
                })
                .catch((error) => {
                    this.status = 'Error code: ' + error.code + '\nError message: ' + error.message;

                    this.showToast('Error', this.status, 'error');
                });
        } else {
            this.status = 'Problem initiating NFC service. Are you using a mobile device?';

            this.showToast('Error', this.status, 'error');
        }
    }

    async createWritePayload() {
      let record;

      if (this.type === this.uri) {
        record = await this.nfcService.createUriRecord(this.textValue);
      } else {
        record = await this.nfcService.createTextRecord({text: this.textValue, langId: 'en'});
      }
      
      return [record];
    }

    createNfcAction(type, value) {
        createNfcAction({type, value})
            .then(() => {
                this.showToast('Success', 'Successfully saved action', 'success');
            })
            .catch((error) => {
                this.showToast('Error', JSON.stringify(error.body), 'error');
            })
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });

        this.dispatchEvent(event);
    }
}