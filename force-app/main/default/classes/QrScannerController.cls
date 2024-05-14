public class QrScannerController {
    @AuraEnabled
    public static void createQrScan(String qrCodes) {
        insert new QR_Scan__c(
            Value__c = qrCodes
        );
    }
}