import { LightningElement } from 'lwc';

export default class ScholarshipPortal extends LightningElement {
    showList = true;
    showDetail = false;
    showApplication = false;

    selectedScheme;

    handleDetail(event) {
        this.selectedScheme = event.detail;
        this.showList = false;
        this.showDetail = true;
        this.showApplication = false;
    }

    handleApply(event) {
        this.selectedScheme = event.detail;
        this.showList = false;
        this.showDetail = false;
        this.showApplication = true;
    }
    handleBack(){
        // Centralized back handler: always return to scholarship list home page
        this.showList = true;
        this.showDetail = false;
        this.showApplication = false;
        this.selectedScheme = undefined;
    }
}
