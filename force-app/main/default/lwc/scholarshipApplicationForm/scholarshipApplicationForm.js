import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkEligibility from '@salesforce/apex/ScholarshipEligibilityEngine.checkEligibility';

export default class ScholarshipApplicationForm extends LightningElement {

    @api schemeId;

    @track isEligible = false;
    @track errorMessage = '';

    income;
    marks;
    attendance;
    gender;
    community;
    year;

    handleFieldChange(event) {

        const field = event.target.fieldName;
        const value = event.detail.value;

        if(field === 'Annual_Family_Income__c'){
            this.income = value;
        }

        if(field === 'Previous_Year_Percentage__c'){
            this.marks = value;
        }

        if(field === 'Attendance_Percentage__c'){
            this.attendance = value;
        }

        if(field === 'Gender__c'){
            this.gender = value;
        }

        if(field === 'Community_Caste__c'){
            this.community = value;
        }

        if(field === 'Current_Year__c'){
            this.year = value;
        }

        this.checkEligibilityHandler();
    }

    checkEligibilityHandler(){

        if(!this.schemeId) return;

        checkEligibility({
            schemeId: this.schemeId,
            income: this.income,
            marks: this.marks,
            attendance: this.attendance,
            gender: this.gender,
            community: this.community,
            year: this.year
        })
        .then(result => {

            if(result === 'Eligible'){
                this.isEligible = true;
                this.errorMessage = '';
            }
            else{
                this.isEligible = false;
                this.errorMessage = result;
            }

        })
        .catch(error=>{
            console.error(error);
            this.isEligible = false;
            this.errorMessage = 'An error occurred while checking eligibility. Please try again.';
        });
    }

    handleSubmit(event) {

        const fields = event.detail.fields;

        if (this.schemeId) {
            fields.Scholarship_Scheme__c = this.schemeId;
        }

        if (!this.isEligible && this.schemeId) {

            event.preventDefault();

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Not Eligible',
                    message: 'You are not eligible for this scholarship',
                    variant: 'error'
                })
            );
        }
    }

    handleSuccess() {

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Scholarship Application Submitted Successfully',
                variant: 'success'
            })
        );
    }

    handleBack() {

        const evt = new CustomEvent('back', {
            bubbles: true,
            composed: true
        });

        this.dispatchEvent(evt);
    }
}
