/**
 * VERITAS MASTERCORE — Search & Advanced Filter
 *
 * Alpine.js component for real-time search and parametric filtering.
 * Tracks: case_search_executed, advanced_filter_applied
 */

document.addEventListener("alpine:init", () => {
  Alpine.data("searchFilter", () => ({
    searchQuery: "",
    searchDebounceTimer: null,
    results: [],
    resultsCount: 0,

    // Advanced filter panel state
    filterPanelOpen: false,
    filingYearFilter: "",
    categoryFilter: "",
    forumFilter: "",
    statusFilter: "",

    authHeaders() {
      return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("access_token") || ""),
      };
    },

    /* -------------------------------------------------------------- */
    /*  Real-time search with debounce                                */
    /* -------------------------------------------------------------- */
    onSearchInput() {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = setTimeout(() => {
        if (this.searchQuery.trim().length > 0) {
          this.executeSearch();
        }
      }, 400);
    },

    async executeSearch() {
      var query = this.searchQuery.trim();
      if (!query) return;

      var startTime = performance.now();

      try {
        const response = await fetch(
          "/api/cases/search?q=" + encodeURIComponent(query),
          { headers: this.authHeaders() }
        );

        if (!response.ok) throw new Error("Search failed");

        var data = await response.json();
        var elapsed = Math.round(performance.now() - startTime);

        this.results = data.results || data;
        this.resultsCount = data.total || this.results.length;

        // Pendo Track: case_search_executed
        trackCaseSearchExecuted({
          search_query: query.substring(0, 100),
          results_count: this.resultsCount,
          search_type: "text",
          response_time_ms: elapsed,
        });
      } catch (err) {
        console.error("Search error:", err);
      }
    },

    /* -------------------------------------------------------------- */
    /*  Advanced Parametric Filter                                    */
    /* -------------------------------------------------------------- */
    async applyAdvancedFilters() {
      var startTime = performance.now();
      var dimensions = [];
      var filters = {};

      if (this.filingYearFilter) {
        filters.filing_year = this.filingYearFilter;
        dimensions.push("filing_year");
      }
      if (this.categoryFilter) {
        filters.category = this.categoryFilter;
        dimensions.push("category");
      }
      if (this.forumFilter) {
        filters.forum = this.forumFilter;
        dimensions.push("forum");
      }
      if (this.statusFilter) {
        filters.status = this.statusFilter;
        dimensions.push("status");
      }

      try {
        const response = await fetch("/api/cases/filter", {
          method: "POST",
          headers: this.authHeaders(),
          body: JSON.stringify(filters),
        });

        if (!response.ok) throw new Error("Filter failed");

        var data = await response.json();
        var elapsed = Math.round(performance.now() - startTime);

        this.results = data.results || data;
        this.resultsCount = data.total || this.results.length;

        // Pendo Track: advanced_filter_applied
        trackAdvancedFilterApplied({
          filter_dimensions: dimensions.join(","),
          filter_count: dimensions.length,
          results_count: this.resultsCount,
          filing_year_filter: this.filingYearFilter,
          category_filter: this.categoryFilter,
          forum_filter: this.forumFilter,
          status_filter: this.statusFilter,
          response_time_ms: elapsed,
        });
      } catch (err) {
        console.error("Filter error:", err);
      }
    },

    clearFilters() {
      this.filingYearFilter = "";
      this.categoryFilter = "";
      this.forumFilter = "";
      this.statusFilter = "";
      this.searchQuery = "";
    },
  }));
});
