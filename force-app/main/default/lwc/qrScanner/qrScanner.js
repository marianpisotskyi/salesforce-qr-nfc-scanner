import { LightningElement, track } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

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
            // TODO: add showToast
            console.log("QR Scanner unavailable. Non-mobile device?");
        }
    }

    processScannedBarcodes(barcodes) {
        this.scannedBarcodes = this.scannedBarcodes.concat(barcodes);
    }

    processError(error) {
        if (error.code == "USER_DISMISSED") {
            console.log("User terminated scanning session.");
        } else {
            console.error(error);
        }
    }

    get scannedBarcodesAsString() {
        return this.scannedBarcodes.map((barcode) => barcode.value).join(', ');
    }
}