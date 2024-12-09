const FetchData= document.getElementById('Fetch Data');
FetchData.addEventListener('click',async()=>{
        const result = await axios.get('api/initialize')
        alert(result.data.message);
        
})

// Variables to track pagination and search
let currentPage = 1;
const perPage = 10;

// Function to fetch and display transactions
async function fetchTransactions(page = 1, search = '', monthYear = '') {
  try {
    const response = await axios.get('/api/transactions', {
      params: { page, perPage, search, monthYear },
    });

    const { transactions, total } = response.data;

    // Display transactions
    const container = document.getElementById('transactions-container');
    container.innerHTML = ''; // Clear previous content

    if (transactions.length === 0) {
      container.innerHTML += `<p>No transactions found.</p>`;
      return;
    }
        console.log(transactions)
    transactions.forEach((transaction) => {
      const transactionCard = `
        <div class="card mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${transaction.image}" class="img-fluid rounded-start" alt="${transaction.title}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${transaction.id}</h5>
                <h5 class="card-title">${transaction.title}</h5>
                <p class="card-text">${transaction.description}</p>
                <p class="card-text"><strong>Price: $${transaction.price}</strong></p>
                <p class="card-text">${transaction.category}</p>
                <p class="card-text">Sold:${transaction.sold}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += transactionCard;
    });

    // Pagination controls
    const totalPages = Math.ceil(total / perPage);
    const paginationInfo = document.getElementById('pagination-info');
    paginationInfo.innerHTML = `
      <button id="prev-btn" class="btn btn-primary me-2" ${page === 1 ? 'disabled' : ''}>Previous</button>
      Page ${page} of ${totalPages}
      <button id="next-btn" class="btn btn-primary ms-2" ${page === totalPages ? 'disabled' : ''}>Next</button>
    `;

    // Event listeners for pagination buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchTransactions(currentPage, document.getElementById('search').value.trim(), document.getElementById('monthYearInput').value);
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchTransactions(currentPage, document.getElementById('search').value.trim(), document.getElementById('monthYearInput').value);
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
}

// Function to create the search bar
function createSearchBar() {
  const searchBar = `
    <div class="input-group mb-3">
      <form class="d-flex" id="search-form" autocomplete="off">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" id="search">
        <input class="form-control me-2" type="month" id="monthYearInput" max="${new Date().toISOString().slice(0, 7)}">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  `;
  const container = document.getElementById('SearchBar');
  container.innerHTML = searchBar;

  // Add search form submit event listener
  document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    const searchInput = document.getElementById('search').value.trim(); // Trim input
    const monthYearInput = document.getElementById('monthYearInput').value; // Get month and year input
    currentPage = 1; // Reset to page 1 for new search
    fetchTransactions(currentPage, searchInput, monthYearInput); // Fetch transactions with search and date filter
  });
}

// Function to set up the page
function setupPage() {
  // Create search bar
  createSearchBar();

  // Create transactions container
  const container = document.getElementById('transactions-container');
  container.innerHTML = `
    <div id="transactions-list"></div>
    <div id="pagination-info"></div>
  `;

  // Fetch initial transactions
  fetchTransactions(currentPage); // Initial fetch with no search
}

const dashboard = document.getElementById('dashboard-btn');

 dashboard.addEventListener('click',()=>{
  setupPage();
})

// Set up the page when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupPage();
});


