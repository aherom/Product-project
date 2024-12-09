document.addEventListener('DOMContentLoaded', () => { 
    const barChartBtn = document.getElementById('transactions-bar-chart');
    const searchBarContainer = document.getElementById('SearchBar');
    const transactionsContainer = document.getElementById('transactions-container');
    let barChart; 
  
    function createMonthYearInput() {
      searchBarContainer.innerHTML = ''; // Clear the search bar container
  
      const monthYearInput = document.createElement('input');
      monthYearInput.type = 'month';
      monthYearInput.id = 'monthYearInput';
      monthYearInput.name = 'monthYear';
      monthYearInput.max = new Date().toISOString().slice(0, 7); // Restrict to current month or earlier
      monthYearInput.className = 'form-control d-inline-block w-auto';
  
      const fetchBtn = document.createElement('button');
      fetchBtn.textContent = 'Fetch Data';
      fetchBtn.className = 'btn btn-primary ms-2';
      fetchBtn.addEventListener('click', () => {
        const selectedMonthYear = monthYearInput.value;
        if (selectedMonthYear) {
          fetchBarChartData(selectedMonthYear);
        } else {
          alert('Please select a valid month and year!');
        }
      });
  
      searchBarContainer.appendChild(monthYearInput);
      searchBarContainer.appendChild(fetchBtn);
    }
  
    async function fetchBarChartData(monthYear) {
      try {
        const response = await axios.get('/api/barChart', {
          params: { monthYear },
        });
  
        const { priceRanges, counts } = response.data;
      //  console.log(priceRanges, counts);
  
        if (barChart) {
          barChart.destroy();
        }
  
        const canvas = document.createElement('canvas');
        canvas.id = 'barChart';
        
        // Set explicit width and height
        canvas.width = 600;
        canvas.height = 300;
  
        transactionsContainer.innerHTML = ''; // Clear previous content
        transactionsContainer.appendChild(canvas);
  
        barChart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: priceRanges,
            datasets: [
              {
                label: `Transactions for ${monthYear}`,
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: false, // Disable responsiveness to control the size
            plugins: {
              legend: { display: true },
              title: { display: true, text: `Transactions Bar Chart - ${monthYear}` },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
        alert('Failed to fetch data. Please try again later.');
      }
    }
  
    barChartBtn.addEventListener('click', () => {
      createMonthYearInput();
      transactionsContainer.innerHTML = ''; // Clear previous transaction data
      const pagination = document.getElementById('pagination-info');
      pagination.innerHTML = '';
    });
});
