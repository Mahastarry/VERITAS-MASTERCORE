/**
 * VERITAS MASTERCORE — 12-Parameter Data Registry
 *
 * Alpine.js store managing case CRUD operations.
 * Tracks: case_registered, case_updated, case_deleted, case_status_changed
 */

document.addEventListener("alpine:init", () => {
  Alpine.store("cases", {
    items: [],
    loading: false,

    authHeaders() {
      return {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (localStorage.getItem("access_token") || ""),
      };
    },

    /* -------------------------------------------------------------- */
    /*  Create — 12-Parameter Data Registry form submission            */
    /* -------------------------------------------------------------- */
    async registerCase(formData) {
      this.loading = true;
      try {
        const response = await fetch("/api/cases", {
          method: "POST",
          headers: this.authHeaders(),
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to register case");
        const created = await response.json();
        this.items.push(created);

        // Pendo Track: case_registered
        trackCaseRegistered({
          judicial_forum: formData.judicial_forum,
          writ_case_type: formData.writ_case_type,
          filing_year_target: formData.filing_year_target,
          classification_category: formData.classification_category,
          case_status: formData.case_status,
          keywords_count: (formData.keywords || []).length,
          has_filing_date_window: !!formData.filing_date_start && !!formData.filing_date_end,
          has_hearing_range: !!formData.hearing_date_start && !!formData.hearing_date_end,
        });

        return created;
      } finally {
        this.loading = false;
      }
    },

    /* -------------------------------------------------------------- */
    /*  Update — modify existing case record                          */
    /* -------------------------------------------------------------- */
    async updateCase(caseId, originalData, updatedData) {
      this.loading = true;
      try {
        const response = await fetch("/api/cases/" + caseId, {
          method: "PUT",
          headers: this.authHeaders(),
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error("Failed to update case");
        const saved = await response.json();

        const idx = this.items.findIndex((c) => c.id === caseId);
        if (idx !== -1) this.items[idx] = saved;

        // Compute which fields changed
        var modifiedFields = Object.keys(updatedData).filter(
          (key) => JSON.stringify(updatedData[key]) !== JSON.stringify(originalData[key])
        );

        // Pendo Track: case_updated
        trackCaseUpdated({
          case_id: String(caseId),
          fields_modified_count: modifiedFields.length,
          fields_modified_list: modifiedFields.join(","),
          judicial_forum: updatedData.judicial_forum,
          classification_category: updatedData.classification_category,
          case_status: updatedData.case_status,
        });

        // If the status specifically changed, also fire case_status_changed
        if (
          originalData.case_status &&
          updatedData.case_status &&
          originalData.case_status !== updatedData.case_status
        ) {
          // Pendo Track: case_status_changed
          trackCaseStatusChanged({
            case_id: String(caseId),
            previous_status: originalData.case_status,
            new_status: updatedData.case_status,
            judicial_forum: updatedData.judicial_forum,
            classification_category: updatedData.classification_category,
          });
        }

        return saved;
      } finally {
        this.loading = false;
      }
    },

    /* -------------------------------------------------------------- */
    /*  Delete — remove case record                                   */
    /* -------------------------------------------------------------- */
    async deleteCase(caseRecord) {
      this.loading = true;
      try {
        const response = await fetch("/api/cases/" + caseRecord.id, {
          method: "DELETE",
          headers: this.authHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete case");
        this.items = this.items.filter((c) => c.id !== caseRecord.id);

        // Compute age in days from creation date
        var ageDays = 0;
        if (caseRecord.created_at) {
          ageDays = Math.floor(
            (Date.now() - new Date(caseRecord.created_at).getTime()) / 86400000
          );
        }

        // Pendo Track: case_deleted
        trackCaseDeleted({
          case_id: String(caseRecord.id),
          judicial_forum: caseRecord.judicial_forum,
          classification_category: caseRecord.classification_category,
          case_status: caseRecord.case_status,
          case_age_days: ageDays,
        });
      } finally {
        this.loading = false;
      }
    },

    /* -------------------------------------------------------------- */
    /*  Read — fetch case list                                        */
    /* -------------------------------------------------------------- */
    async fetchCases() {
      this.loading = true;
      try {
        const response = await fetch("/api/cases", {
          headers: this.authHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch cases");
        this.items = await response.json();
      } finally {
        this.loading = false;
      }
    },
  });
});
