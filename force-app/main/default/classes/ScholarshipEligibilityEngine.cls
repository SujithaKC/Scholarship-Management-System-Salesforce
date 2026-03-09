public with sharing class ScholarshipEligibilityEngine {

    @AuraEnabled
    public static String checkEligibility(
        Id schemeId,
        Decimal income,
        Decimal marks,
        Decimal attendance,
        String gender,
        String community,
        String year
    ){

        Scholarship_Scheme__c scheme = [
            SELECT Maximum_Family_Income__c,
                   Minimum_Marks_Required__c,
                   Minimum_Attendance_Required__c,
                   Gender_Eligible__c,
                   Community_Eligible__c,
                   Eligible_Study_Year__c
            FROM Scholarship_Scheme__c
            WHERE Id = :schemeId
            LIMIT 1
        ];

        if(scheme.Maximum_Family_Income__c != null &&
           income > scheme.Maximum_Family_Income__c){
            return 'Income exceeds scholarship limit';
        }

        if(scheme.Minimum_Marks_Required__c != null &&
           marks < scheme.Minimum_Marks_Required__c){
            return 'Minimum marks requirement not satisfied';
        }

        if(scheme.Minimum_Attendance_Required__c != null &&
           attendance < scheme.Minimum_Attendance_Required__c){
            return 'Attendance requirement not satisfied';
        }

        if(scheme.Gender_Eligible__c != 'Both' &&
           gender != scheme.Gender_Eligible__c){
            return 'Gender not eligible';
        }

        if(scheme.Community_Eligible__c != null &&
           !scheme.Community_Eligible__c.contains(community)){
            return 'Community not eligible';
        }

        if(scheme.Eligible_Study_Year__c != null &&
           !scheme.Eligible_Study_Year__c.contains(year)){
            return 'Study year not eligible';
        }

        return 'Eligible';
    }
}