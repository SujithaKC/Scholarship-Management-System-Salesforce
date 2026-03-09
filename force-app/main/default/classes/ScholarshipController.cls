// public with sharing class ScholarshipController {

//     @AuraEnabled(cacheable=true)
//     public static List<Scholarship_Scheme__c> getSchemes(){

//         return [
//             SELECT Id, Name
//             FROM Scholarship_Scheme__c
//             WHERE Status__c = 'Active'
//         ];
//     }

//     @AuraEnabled
//     public static Id createApplication(Scholarship_Application__c app){

//         insert app;
//         return app.Id;
//     }

// }

public with sharing class ScholarshipController {

    @AuraEnabled(cacheable=true)
    public static List<Scholarship_Scheme__c> getActiveScholarships() {

        return [
            SELECT Id,
                   Name,
                   Course_Eligible__c,
                   Admission_Type__c,
                   Eligible_Study_Year__c,
                   Maximum_Family_Income__c,
                   Gender_Eligible__c,
                   Community_Eligible__c,
                   Description__c
            FROM Scholarship_Scheme__c
            WHERE Status__c = 'Active'
            ORDER BY Name
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Scholarship_Scheme__c getScholarshipDetails(Id schemeId) {

        if(schemeId == null){
            throw new AuraHandledException('Scholarship Id is required');
        }

        Scholarship_Scheme__c scheme = [
            SELECT Id,
                   Name,
                   Course_Eligible__c,
                   Admission_Type__c,
                   Eligible_Study_Year__c,
                   Maximum_Family_Income__c,
                   Minimum_Marks_Required__c,
                   Minimum_Attendance_Required__c,
                   Gender_Eligible__c,
                   Community_Eligible__c,
                   Description__c
            FROM Scholarship_Scheme__c
            WHERE Id = :schemeId
            LIMIT 1
        ];

        return scheme;
    }
}
