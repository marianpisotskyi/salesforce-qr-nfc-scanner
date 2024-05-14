public class NfcQrAppController {
    
    @AuraEnabled
    public static String getExchangeRates() {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json');
        req.setMethod('GET');
        
        Http http = new Http();
        HttpResponse res = http.send(req);

        return res.getBody();
    }
}