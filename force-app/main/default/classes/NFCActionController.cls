public class NFCActionController {
    @AuraEnabled
    public static void createNfcAction(String type, String value) {
        insert new NFC_Action__c(
            Type__c = type,
            Value__c = value
        );
    }
}