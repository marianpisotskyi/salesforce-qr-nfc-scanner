import { LightningElement, track } from 'lwc';
import getExchangeRates from '@salesforce/apex/NfcQrAppController.getExchangeRates';

const COLUMNS = [
    { label: 'Currency', fieldName: 'txt'},
    { label: 'Code', fieldName: 'cc'},
    { label: 'Rate', fieldName: 'rate'}
];

export default class NfcQrApp extends LightningElement {
    showMainMenu = false;
    showNfcReader = false;
    showQrScanner = false;

    columns = COLUMNS;

    @track exchangeRates;

    get showNavigationButton() {
        return this.showNfcReader || this.showQrScanner;
    }

    get showExchangeRates() {
        return this.showMainMenu && this.exchangeRates;
    }

    connectedCallback() {
        this.showMainMenu = true;

        this.getExchangeRates();
    }

    getExchangeRates() {
        getExchangeRates()
            .then((result) => {
                this.exchangeRates = JSON.parse(result).slice(0, 5);
            }) 
    }

    handleNfcReaderClick() {
        this.showMainMenu = false;
        this.showNfcReader = true;
    }

    handleQrScannerClick() {
        this.showMainMenu = false;
        this.showQrScanner = true;
    }

    handleGoToMainMenu() {
        this.showNfcReader = false;
        this.showQrScanner = false;

        this.showMainMenu = true;
    }
}