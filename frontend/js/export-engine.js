/**
 * VERITAS MASTERCORE — Granular Multi-Tier Download Engine
 *
 * Alpine.js component for the four export modes.
 * Tracks: individual_case_exported, batch_export_completed,
 *         filtered_export_completed, parametric_export_completed
 */

document.addEventListener("alpine:init", () => {
  Alpine.data("exportEngine", () => ({
    selectedIds: [],
    parametricPanelOpen: false,

    // Parametric panel filters
    filingYearFilter: "",
    categoryFilter: "",
    forumFilter: "",
    assignmentStateFilter: "",

    authHeaders() {
      return {
        Authorization: "Bearer " + (localStorage.getItem("access_token") || ""),
      };
    },

    /* -------------------------------------------------------------- */
    /*  Separate Individual Isolation — single-row export trigger      */
    /* -------------------------------------------------------------- */
    async exportSingleCase(caseRecord) {
      try {
        const response = await fetch("/api/cases/" + caseRecord.id + "/export", {
          headers: this.authHeaders(),
        });

        if (!response.ok) throw new Error("Export failed");

        var blob = await response.blob();
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "case_" + caseRecord.id + ".pdf";
        a.click();
        URL.revokeObjectURL(url);

        // Pendo Track: individual_case_exported
        trackIndividualCaseExported({
          case_id: String(caseRecord.id),
          export_format: "pdf",
          file_size: blob.size,
          judicial_forum: caseRecord.judicial_forum,
          classification_category: caseRecord.classification_category,
        });
      } catch (err) {
        console.error("Individual export error:", err);
      }
    },

    /* -------------------------------------------------------------- */
    /*  Multi-Select Batch Compilation — checkbox matrix export        */
    /* -------------------------------------------------------------- */
    toggleSelection(caseId) {
      var idx = this.selectedIds.indexOf(caseId);
      if (idx === -1) {
        this.selectedIds.push(caseId);
      } else {
        this.selectedIds.splice(idx, 1);
      }
    },

    async exportBatch() {
      if (this.selectedIds.length === 0) return;

      try {
        const response = await fetch("/api/cases/export/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...this.authHeaders(),
          },
          body: JSON.stringify({ case_ids: this.selectedIds }),
        });

        if (!response.ok) throw new Error("Batch export failed");

        var blob = await response.blob();
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "cases_batch.zip";
        a.click();
        URL.revokeObjectURL(url);

        // Pendo Track: batch_export_completed
        trackBatchExportCompleted({
          item_count: this.selectedIds.length,
          export_format: "zip",
          file_size: blob.size,
          selection_method: "checkbox",
        });

        this.selectedIds = [];
      } catch (err) {
        console.error("Batch export error:", err);
      }
    },

    /* -------------------------------------------------------------- */
    /*  Active Filter Aggregation — export visible filtered results    */
    /* -------------------------------------------------------------- */
    async exportFilteredResults(visibleCases, searchQuery, activeFilters) {
      try {
        var ids = visibleCases.map((c) => c.id);

        const response = await fetch("/api/cases/export/filtered", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...this.authHeaders(),
          },
          body: JSON.stringify({ case_ids: ids }),
        });

        if (!response.ok) throw new Error("Filtered export failed");

        var blob = await response.blob();
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "cases_filtered.zip";
        a.click();
        URL.revokeObjectURL(url);

        // Pendo Track: filtered_export_completed
        trackFilteredExportCompleted({
          item_count: ids.length,
          export_format: "zip",
          file_size: blob.size,
          active_filters: activeFilters || "",
          search_query: (searchQuery || "").substring(0, 100),
        });
      } catch (err) {
        console.error("Filtered export error:", err);
      }
    },

    /* -------------------------------------------------------------- */
    /*  Advanced Parametric Matrix Panel — slide-out tray export       */
    /* -------------------------------------------------------------- */
    async exportParametric() {
      try {
        var params = {};
        var paramCount = 0;

        if (this.filingYearFilter) {
          params.filing_year = this.filingYearFilter;
          paramCount++;
        }
        if (this.categoryFilter) {
          params.category = this.categoryFilter;
          paramCount++;
        }
        if (this.forumFilter) {
          params.forum = this.forumFilter;
          paramCount++;
        }
        if (this.assignmentStateFilter) {
          params.assignment_state = this.assignmentStateFilter;
          paramCount++;
        }

        const response = await fetch("/api/cases/export/parametric", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...this.authHeaders(),
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) throw new Error("Parametric export failed");

        var blob = await response.blob();
        var itemCount = parseInt(
          response.headers.get("X-Total-Count") || "0",
          10
        );

        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "cases_parametric.zip";
        a.click();
        URL.revokeObjectURL(url);

        // Pendo Track: parametric_export_completed
        trackParametricExportCompleted({
          item_count: itemCount,
          export_format: "zip",
          file_size: blob.size,
          filing_year_filter: this.filingYearFilter,
          category_filter: this.categoryFilter,
          forum_filter: this.forumFilter,
          assignment_state_filter: this.assignmentStateFilter,
          parameter_count: paramCount,
        });

        this.parametricPanelOpen = false;
      } catch (err) {
        console.error("Parametric export error:", err);
      }
    },
  }));
});
