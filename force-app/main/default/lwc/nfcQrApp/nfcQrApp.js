import { LightningElement } from 'lwc';

export default class NfcQrApp extends LightningElement {
    showMainMenu = false;
    showNfcReader = false;
    showQrScanner = false;

    connectedCallback() {
        this.showMainMenu = true;
    }

    handleNfcReaderClick() {
        this.showMainMenu = false;
        this.showNfcReader = true;
    }
}