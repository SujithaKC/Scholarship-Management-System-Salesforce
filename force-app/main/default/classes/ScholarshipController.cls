public without sharing class ScholarshipController{

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
            LIMIT 500
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
    @AuraEnabled(cacheable=true)
public static List<Scholarship_Scheme__c> recommendScholarships(
    Decimal income,
    Decimal marks,
    Decimal attendance,
    String gender,
    String community,
    String year
){

    List<Scholarship_Scheme__c> schemes = [
        SELECT Id,
               Name,
               Description__c,
               Maximum_Family_Income__c,
               Minimum_Marks_Required__c,
               Minimum_Attendance_Required__c,
               Gender_Eligible__c,
               Community_Eligible__c,
               Eligible_Study_Year__c
        FROM Scholarship_Scheme__c
        WHERE Status__c = 'Active'
        LIMIT 2000
    ];

    List<Scholarship_Scheme__c> recommended = new List<Scholarship_Scheme__c>();

    for(Scholarship_Scheme__c s : schemes){

        Boolean eligible = true;

        if(s.Maximum_Family_Income__c != null && income > s.Maximum_Family_Income__c)
            eligible = false;

        if(s.Minimum_Marks_Required__c != null && marks < s.Minimum_Marks_Required__c)
            eligible = false;

        if(s.Minimum_Attendance_Required__c != null && attendance < s.Minimum_Attendance_Required__c)
            eligible = false;

        if(s.Gender_Eligible__c != 'Both' && s.Gender_Eligible__c != gender)
            eligible = false;

        if(s.Community_Eligible__c != null && !s.Community_Eligible__c.contains(community))
            eligible = false;

        if(s.Eligible_Study_Year__c != null && !s.Eligible_Study_Year__c.contains(year))
            eligible = false;

        if(eligible){
            recommended.add(s);
        }
    }

    return recommended;
}
}
