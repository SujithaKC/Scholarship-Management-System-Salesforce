import { LightningElement, track } from 'lwc';
import recommendScholarships from '@salesforce/apex/ScholarshipController.recommendScholarships';

export default class ScholarshipRecommendation extends LightningElement {

    income;
    marks;
    attendance;
    gender;
    community;
    year;

    @track scholarships;
    @track showNoResultsMessage = false;

    genderOptions = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
    ];

    communityOptions = [
        { label: 'BC', value: 'BC' },
        { label: 'MBC', value: 'MBC' },
        { label: 'SC', value: 'SC' },
        { label: 'ST', value: 'ST' },
        { label: 'General', value: 'General' }
    ];

    yearOptions = [
        { label: '1st Year', value: '1st Year' },
        { label: '2nd Year', value: '2nd Year' },
        { label: '3rd Year', value: '3rd Year' },
        { label: '4th Year', value: '4th Year' }
    ];

    handleInput(event){

        const field = event.target.dataset.field;

        this[field] = event.detail.value;
    }

    findScholarships(){

        // Reset previous states
        this.showNoResultsMessage = false;
        this.scholarships = null;

        recommendScholarships({
            income: this.income,
            marks: this.marks,
            attendance: this.attendance,
            gender: this.gender,
            community: this.community,
            year: this.year
        })
        .then(result=>{
            this.scholarships = result;
            // Show "not eligible" message if no scholarships found
            if(result && result.length === 0){
                this.showNoResultsMessage = true;
            }
        })
        .catch(error=>{
            console.error(error);
            this.showNoResultsMessage = true;
        });
    }

    get hasScholarships() {
        return this.scholarships && this.scholarships.length > 0;
    }

    viewDetails(event){

        const schemeId = event.target.dataset.id;

        const customEvent = new CustomEvent('viewdetail',{
            detail: schemeId
        });

        this.dispatchEvent(customEvent);
    }

}
