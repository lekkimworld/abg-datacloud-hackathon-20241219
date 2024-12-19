import { LightningElement, api, wire } from 'lwc';
import performQuery from '@salesforce/apex/DataCloudQueryHelper.performQuery';

export default class ProductChurnScoreSimple extends LightningElement {
    accountId;
    score_timestamp;
    score_num;
    score_category;
    

    @api set recordId(value) {
        this.accountId = value;
        performQuery({"recordId": value, "query": "SELECT product_churn_prediction__dlm.prediction__c, product_churn_prediction__dlm.inference_timestamp__c FROM UnifiedLinkssotIndividual1__dlm, UnifiedssotIndividual1__dlm,product_churn_prediction__dlm where UnifiedLinkssotIndividual1__dlm.SourceRecordId__c='REPLACE_RECORDID' and UnifiedssotIndividual1__dlm.ssot__Id__c=UnifiedLinkssotIndividual1__dlm.UnifiedRecordId__c and UnifiedssotIndividual1__dlm.kunde_nr_num__c=product_churn_prediction__dlm.for_id_no__c order by inference_timestamp__c desc"}).then(data => {
            console.log("data", data);
            this.handleResults(data);
        }).catch(error => {
            console.log("error", error);
        })
    }
    get recordId() {
        return this.accountId;
    }

    handleResults(results) {
        console.log("results", results);
        if (!results.length) {
            // no data
            console.log("No data");
        } else {
            const result = JSON.parse(results[0]);
            this.score_num = Number.parseFloat(result[0]).toPrecision(2);
            this.score_timestamp = new Date(result[1]);
            this.score_date = this.formatDate(this.score_timestamp);
            this.score_category= this.score_num < 0.2 ? 'Low' : this.score_num >= 0.2 && this.score_num < 0.5 ? 'Medium' : 'High';
        }
    }

    formatDate(d) {
        const pad = n => n < 10 ? `0${n}` : `${n}`;
        return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${pad(d.getFullYear())}`;
    }
}