import { LightningElement } from 'lwc';
import { getNfcService } from 'lightning/mobileCapabilities';

export default class NfcReader extends LightningElement {
    status;
    nfcService;

    connectedCallback() {
      this.nfcService = getNfcService();
    }

    handleReadClick() {
      if(this.nfcService.isAvailable()) {
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

    async handleWriteClick() {
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
      // Here we demonstrate how you can write several records to an NFC tag.
      // Consider the scenario where you want to write the content of a business card
      // to an NFC tag. The content can be broken down into a number of text and uri records.
      const nameRecord = await this.nfcService.createTextRecord({text: "John Smith", langId: "en"});
      const phone1Record = await this.nfcService.createTextRecord({text: "(123) 456-7890 Office", langId: "en"});
      const phone2Record = await this.nfcService.createTextRecord({text: "(321) 654-0987 Direct", langId: "en"});
      const emailRecord = await this.nfcService.createUriRecord("mailto:john.smith@email.com");
      const addressRecord = await this.nfcService.createTextRecord({text: "584 South Paris Hill Ave., Lancaster, CA 93535", langId: "en"});
      const websiteRecord = await this.nfcService.createUriRecord("https://www.mycompany.com");
      return [nameRecord, phone1Record, phone2Record, emailRecord, addressRecord, websiteRecord];
    }
}