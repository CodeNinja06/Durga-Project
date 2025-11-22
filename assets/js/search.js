// Site Search Functionality
(function() {
  'use strict';

  // Search data (index all pages)
  const searchIndex = [
    { title: 'Home', url: 'index.html', keywords: 'home, industrial, civil, railway, projects' },
    { title: 'About Us', url: 'about.html', keywords: 'about, company, story, safety, quality' },
    { title: 'Services', url: 'services.html', keywords: 'services, industrial projects, civil infrastructure, railway works' },
    { title: 'Projects', url: 'projects.html', keywords: 'projects, portfolio, industrial, civil, railway' },
    { title: 'Clients', url: 'clients.html', keywords: 'clients, partners, cement, infrastructure' },
    { title: 'Contact', url: 'contact.html', keywords: 'contact, get in touch, proposal, request' }
  ];

  // Create search bar
  const createSearchBar = () => {
    const header = document.querySelector('.site-header .nav');
    if (!header) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input type="search" class="search-bar" placeholder="Search..." aria-label="Search website">
      <span class="search-icon">🔍</span>
    `;

    const searchInput = searchContainer.querySelector('.search-bar');
    
    // Insert search (before theme toggle or at end)
    const themeToggle = header.querySelector('.theme-toggle');
    if (themeToggle) {
      header.insertBefore(searchContainer, themeToggle);
    } else {
      header.appendChild(searchContainer);
    }

    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim().toLowerCase();
      
      if (query.length < 2) {
        hideResults();
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    // Hide on outside click
    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) {
        hideResults();
      }
    });
  };

  // Perform search
  const performSearch = (query) => {
    const results = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.keywords.toLowerCase().includes(query);
    });

    showResults(results, query);
  };

  // Show results
  const showResults = (results, query) => {
    hideResults(); // Remove existing results

    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;

    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'search-results';
    resultsDiv.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-secondary);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      margin-top: 8px;
      max-height: 400px;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
    `;

    if (results.length === 0) {
      resultsDiv.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
          No results found for "${query}"
        </div>
      `;
    } else {
      resultsDiv.innerHTML = results.map(item => `
        <a href="${item.url}" class="search-result-item">
          <strong>${item.title}</strong>
          <div class="search-result-url">${item.url}</div>
        </a>
      `).join('');
    }

    searchContainer.style.position = 'relative';
    searchContainer.appendChild(resultsDiv);
  };

  // Hide results
  const hideResults = () => {
    const results = document.querySelector('.search-results');
    if (results) results.remove();
  };

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSearchBar);
  } else {
    createSearchBar();
  }

})();

