public with sharing class DataCloudQueryHelper {

    @AuraEnabled(cacheable=false)
    public static List<String> performQuery(String recordId, String query) {
        final String use_query = query.replace('REPLACE_RECORDID', recordId);
        ConnectApi.CdpQueryInput inp = new ConnectApi.CdpQueryInput();
        inp.sql = use_query;
        ConnectApi.CdpQueryOutputV2 outp = ConnectApi.CdpQuery.queryAnsiSqlV2(inp); 
        System.debug('Read <' + outp.rowcount + '> rows');
        List<String> result = new List<String> ();
        for (ConnectApi.CdpQueryV2Row row : outp.data) {
            String serialized = JSON.serialize(row.rowData); // rowData is List. Serializing like this would extract the values
            result.add(serialized);
            system.debug(serialized);
            system.debug(JSON.deserializeUntyped(serialized)); // This would convert to a List
        } 
        return result;
    }
}