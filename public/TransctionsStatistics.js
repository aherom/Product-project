const transactionsStatisticsBtn = document.getElementById('Transactions Statistics');

transactionsStatisticsBtn.addEventListener('click', () => {
    const container = document.getElementById('transactions-container');

    container.innerHTML = ''; // Clear previous content
const search = document.getElementById('SearchBar');

search.innerHTML = '';

const pagination = document.getElementById('pagination-info');

 pagination.innerHTML = '';
  // Create a container for the month-year input
  const selectionContainer = document.createElement('div');
  selectionContainer.classList.add('selection-container');

  // Create an input element for month-year selection
  const monthYearInput = document.createElement('input');
  monthYearInput.type = 'month';
  monthYearInput.id = 'monthYearInput';
  monthYearInput.name = 'monthYear';
  monthYearInput.max = new Date().toISOString().slice(0, 7); // Restrict to the current month or earlier

  // Add a label for the input
  const label = document.createElement('label');
  label.htmlFor = 'monthYearInput';
  label.textContent = 'Select Month and Year:';

  // Append label and input to the container
  selectionContainer.appendChild(label);
  selectionContainer.appendChild(monthYearInput);

  // Append container to the transactions-container
  const transactionsContainer = document.getElementById('transactions-container');
  transactionsContainer.innerHTML = ''; // Clear previous content
  transactionsContainer.appendChild(selectionContainer);

  // Add event listener to handle selection change and API call
  monthYearInput.addEventListener('change', () => {
    const selectedMonthYear = monthYearInput.value; // Format: YYYY-MM
    const [selectedYear, selectedMonth] = selectedMonthYear.split('-');

    // Remove previous statistics if any
    const previousStats = document.getElementById('statisticsContainer');
    if (previousStats) previousStats.remove();

    // Make API call to fetch statistics for the selected month and year
    axios.get(`/api/statistics?month=${selectedMonth}&year=${selectedYear}`)
      .then(response => {
        // Create a container for the statistics
        const statisticsContainer = document.createElement('div');
        statisticsContainer.id = 'statisticsContainer';
        statisticsContainer.innerHTML = `
          <p>Total Sale: ${response.data.totalSaleAmount}</p>
          <p>Total Sold Items: ${response.data.totalSoldItems}</p>
          <p>Total Not Sold Items: ${response.data.totalNotSoldItems}</p>
        `;

        // Append the statistics container after the selectionContainer
        transactionsContainer.appendChild(statisticsContainer);
      })
      .catch(error => {
        console.error(error);

        // Create an error message container
        const errorContainer = document.createElement('div');
        errorContainer.id = 'statisticsContainer'; // Reuse ID to ensure one at a time
        errorContainer.classList.add('error');
        errorContainer.textContent = 'Failed to load statistics. Please try again.';

        // Append the error container after the selectionContainer
        transactionsContainer.appendChild(errorContainer);
      });
  });
});
