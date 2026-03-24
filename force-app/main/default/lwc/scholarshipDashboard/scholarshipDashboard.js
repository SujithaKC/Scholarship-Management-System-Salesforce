import { LightningElement, wire } from 'lwc';
import getDashboardData from '@salesforce/apex/DashboardService.getDashboardData';

import chartJs from '@salesforce/resourceUrl/chart';
import { loadScript } from 'lightning/platformResourceLoader';

export default class ScholarshipDashboard extends LightningElement {

    data;
    kpi;
    chartJsInitialized = false;

    // 🔥 FETCH DATA
    @wire(getDashboardData)
    wiredData({ data, error }) {
        if (data) {
            console.log('DATA RECEIVED:', data);

            this.data = JSON.parse(JSON.stringify(data)); // deep copy
            this.kpi = this.data.kpi;

            // render chart after data
            this.initializeChart();
        } 
        else if (error) {
            console.error('ERROR:', error);
        }
    }

    // 🔥 LOAD CHART JS ONLY ONCE
    initializeChart() {
        if (this.chartJsInitialized) return;

        this.chartJsInitialized = true;

        loadScript(this, chartJs)
            .then(() => {
                console.log('Chart.js loaded');
                this.renderCharts();
            })
            .catch(error => {
                console.error('Chart load error', error);
            });
    }

    // 🔥 KPI SAFE FORMAT
    get formattedTotalFund() {
        if (!this.kpi) return 'Loading...';
        return '₹' + (Number(this.kpi.totalFund) / 100).toFixed(2) + ' Cr';
    }

    get formattedAvgFund() {
        if (!this.kpi) return 'Loading...';
        return '₹' + (Number(this.kpi.avgFund) / 100).toFixed(2) + ' Cr';
    }

    get totalStudents() {
        return this.kpi ? this.kpi.totalStudents : 'Loading...';
    }

    get growthRate() {
        if (!this.data) return 0;

        const t = this.data.trend;
        const last = Number(t[t.length - 1].students);
        const prev = Number(t[t.length - 2].students);

        return (((last - prev) / prev) * 100).toFixed(1);
    }

    // 🔥 RENDER CHARTS (AFTER DOM READY)
    renderCharts() {

        // Delay to ensure DOM ready
        setTimeout(() => {

            const line = this.template.querySelector('.lineChart');
            const bar = this.template.querySelector('.barChart');
            const pie = this.template.querySelector('.pieChart');

            if (!line || !bar || !pie) {
                console.error('Canvas not found');
                return;
            }

            // 📈 LINE
            new window.Chart(line, {
                type: 'line',
                data: {
                    labels: this.data.trend.map(i => i.year),
                    datasets: [{
                        label: 'Students',
                        data: this.data.trend.map(i => Number(i.students)),
                        borderWidth: 3,
                        tension: 0.4
                    }]
                }
            });

            // 📊 BAR
            new window.Chart(bar, {
                type: 'bar',
                data: {
                    labels: this.data.yearly.map(i => i.year),
                    datasets: [{
                        label: 'Fund (₹ Lakh)',
                        data: this.data.yearly.map(i => Number(i.fund))
                    }]
                }
            });

            // 🥧 PIE
            new window.Chart(pie, {
                type: 'pie',
                data: {
                    labels: this.data.fundSplit.map(i => i.source),
                    datasets: [{
                        data: this.data.fundSplit.map(i => Number(i.value))
                    }]
                }
            });

        }, 300); // small delay
    }
}