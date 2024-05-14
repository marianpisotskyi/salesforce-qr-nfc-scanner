import { LightningElement, track } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createQrScan from '@salesforce/apex/QrScannerController.createQrScan';

export default class QrScanner extends LightningElement {
    barcodeScanner;
    @track scannedBarcodes = [];

    connectedCallback() {
        this.barcodeScanner = getBarcodeScanner();
    }

    beginScanning() {
        const scanningOptions = {
            barcodeTypes: [this.barcodeScanner.barcodeTypes.QR, this.barcodeScanner.barcodeTypes.EAN_13, 
                this.barcodeScanner.barcodeTypes.EAN_8, this.barcodeScanner.barcodeTypes.CODE_128],
            scannerSize: "FULLSCREEN",
            cameraFacing: "BACK",
            showSuccessCheckMark: true,
            enableBulkScan: true,
            enableMultiScan: true,
        };

        if (this.barcodeScanner != null && this.barcodeScanner.isAvailable()) {
            this.scannedBarcodes = [];

            this.barcodeScanner
                .scan(scanningOptions)
                .then((results) => {
                    this.processScannedBarcodes(results);
                })
                .catch((error) => {
                    this.processError(error);
                })
                .finally(() => {
                    this.barcodeScanner.dismiss();
                });
        } else {
            let status = 'QR Scanner unavailable. Are you using a mobile device?';

            this.showToast('Error', status, 'error');
        }
    }

    processScannedBarcodes(barcodes) {
        this.scannedBarcodes = this.scannedBarcodes.concat(barcodes);
    }

    processError(error) {
        if (error.code != "USER_DISMISSED") {
            this.showToast('Error', error, 'error');
        }
    }

    handleSave() {
        createQrScan({qrCodes : this.scannedBarcodesAsString})
            .then(() => {
                this.showToast('Success', 'Successfully saved scan', 'success');
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

    get scannedBarcodesAsString() {
        return this.scannedBarcodes.map((barcode) => barcode.value).join(', ');
    }

    get showBarcodeValues() {
        return this.scannedBarcodesAsString?.length > 0;
    }
}