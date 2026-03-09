import { LightningElement, wire } from 'lwc';
import getActiveScholarships from '@salesforce/apex/ScholarshipController.getActiveScholarships';

export default class ScholarshipList extends LightningElement {

    scholarships;

    @wire(getActiveScholarships)
    wiredScholarships({data,error}){

        if(data){
            this.scholarships = data;
        }

    }

    viewDetails(event){

        const schemeId = event.target.dataset.id;

        const customEvent = new CustomEvent('viewdetail',{
            detail: schemeId
        });

        this.dispatchEvent(customEvent);
    }

}