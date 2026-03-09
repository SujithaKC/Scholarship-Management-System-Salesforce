import { LightningElement, api, wire } from 'lwc';
import getScholarshipDetails from '@salesforce/apex/ScholarshipController.getScholarshipDetails';

export default class ScholarshipDetail extends LightningElement {

    @api schemeId;
    scheme;

    @wire(getScholarshipDetails, { schemeId: '$schemeId' })
    wiredDetails({ data, error }) {
        if (data) {
            this.scheme = data;
        }

        if (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching scholarship details:', error);
            this.scheme = undefined;
        }
    }

    applyScholarship(){
        const event = new CustomEvent('apply', {
            detail: this.schemeId,
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    handleBack(){
        // Fire a custom event to parent container (scholarshipPortal) to switch view to scholarshipList
        const evt = new CustomEvent('back', {
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(evt);
    }
}
