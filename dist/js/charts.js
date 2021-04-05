/* eslint-disable object-curly-newline */

/* global Chart */

/**
 * --------------------------------------------------------------------------
 * CoreUI Boostrap Admin Template (v3.2.0): main.js
 * Licensed under MIT (https://coreui.io/license)
 * --------------------------------------------------------------------------
 */

/* eslint-disable no-magic-numbers */
// random Numbers
var random = function random() {
  return Math.round(Math.random() * 100);
}; // eslint-disable-next-line no-unused-vars


var doughnutChart = new Chart(document.getElementById('status-job'), {
  type: 'doughnut',
  data: {
    labels: ['Orange', 'Green', 'Red', 'Default'],
    datasets: [{
      data: [70, 150, 30, 150],
      backgroundColor: ['#FAAF40', '#8BC53F', '#BE1E2D','#E6E7E8'],
      hoverBackgroundColor: ['#FAAF40', '#8BC53F', '#BE1E2D','#E6E7E8']
    }],
  },
  options: {
    
    legend: {
      display: false
  },
    responsive: true,
    cutoutPercentage: 70,
  }
}); // eslint-disable-next-line no-unused-vars


var doughnutChart = new Chart(document.getElementById('job-outdate'), {
  type: 'doughnut',
  data: {
    labels: [ 'Red', 'Default'],
    datasets: [{
      data: [30, 100],
      backgroundColor: [ '#BE1E2D','#E6E7E8'],
      hoverBackgroundColor: [ '#BE1E2D','#E6E7E8']
    }],
  },
  options: {
    
    legend: {
      display: false
  },
    responsive: true,
    cutoutPercentage: 75,
  }
}); // eslint-disable-next-line no-unused-vars
