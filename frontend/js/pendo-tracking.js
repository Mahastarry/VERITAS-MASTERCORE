/**
 * VERITAS MASTERCORE — Pendo Track Events
 *
 * Centralised tracking module. Every pendo.track() call in the application
 * goes through one of the functions exported here so event names and
 * property shapes stay consistent.
 */

/* ------------------------------------------------------------------ */
/*  1. Authentication Events                                          */
/* ------------------------------------------------------------------ */

function trackLoginCompleted(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("user_login_completed", {
        auth_method: metadata.auth_method || "credentials",
        tenant_id: metadata.tenant_id || "",
        session_duration_limit: metadata.session_duration_limit || 0,
        user_role: metadata.user_role || "",
      });
    }
  } catch (e) {
    console.error("Pendo track error (user_login_completed):", e);
  }
}

function trackLoginFailed(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("user_login_failed", {
        failure_reason: metadata.failure_reason || "unknown",
        attempt_count: metadata.attempt_count || 1,
        tenant_id: metadata.tenant_id || "",
      });
    }
  } catch (e) {
    console.error("Pendo track error (user_login_failed):", e);
  }
}

/* ------------------------------------------------------------------ */
/*  2. Case Registry Events (CRUD)                                    */
/* ------------------------------------------------------------------ */

function trackCaseRegistered(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("case_registered", {
        judicial_forum: metadata.judicial_forum || "",
        writ_case_type: metadata.writ_case_type || "",
        filing_year_target: metadata.filing_year_target || "",
        classification_category: metadata.classification_category || "",
        case_status: metadata.case_status || "",
        keywords_count: metadata.keywords_count || 0,
        has_filing_date_window: !!metadata.has_filing_date_window,
        has_hearing_range: !!metadata.has_hearing_range,
      });
    }
  } catch (e) {
    console.error("Pendo track error (case_registered):", e);
  }
}

function trackCaseUpdated(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("case_updated", {
        case_id: metadata.case_id || "",
        fields_modified_count: metadata.fields_modified_count || 0,
        fields_modified_list: metadata.fields_modified_list || "",
        judicial_forum: metadata.judicial_forum || "",
        classification_category: metadata.classification_category || "",
        case_status: metadata.case_status || "",
      });
    }
  } catch (e) {
    console.error("Pendo track error (case_updated):", e);
  }
}

function trackCaseDeleted(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("case_deleted", {
        case_id: metadata.case_id || "",
        judicial_forum: metadata.judicial_forum || "",
        classification_category: metadata.classification_category || "",
        case_status: metadata.case_status || "",
        case_age_days: metadata.case_age_days || 0,
      });
    }
  } catch (e) {
    console.error("Pendo track error (case_deleted):", e);
  }
}

function trackCaseStatusChanged(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("case_status_changed", {
        case_id: metadata.case_id || "",
        previous_status: metadata.previous_status || "",
        new_status: metadata.new_status || "",
        judicial_forum: metadata.judicial_forum || "",
        classification_category: metadata.classification_category || "",
      });
    }
  } catch (e) {
    console.error("Pendo track error (case_status_changed):", e);
  }
}

/* ------------------------------------------------------------------ */
/*  3. Export Events                                                   */
/* ------------------------------------------------------------------ */

function trackIndividualCaseExported(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("individual_case_exported", {
        case_id: metadata.case_id || "",
        export_format: metadata.export_format || "pdf",
        file_size: metadata.file_size || 0,
        judicial_forum: metadata.judicial_forum || "",
        classification_category: metadata.classification_category || "",
      });
    }
  } catch (e) {
    console.error("Pendo track error (individual_case_exported):", e);
  }
}

function trackBatchExportCompleted(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("batch_export_completed", {
        item_count: metadata.item_count || 0,
        export_format: metadata.export_format || "pdf",
        file_size: metadata.file_size || 0,
        selection_method: metadata.selection_method || "checkbox",
      });
    }
  } catch (e) {
    console.error("Pendo track error (batch_export_completed):", e);
  }
}

function trackFilteredExportCompleted(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("filtered_export_completed", {
        item_count: metadata.item_count || 0,
        export_format: metadata.export_format || "pdf",
        file_size: metadata.file_size || 0,
        active_filters: metadata.active_filters || "",
        search_query: metadata.search_query || "",
      });
    }
  } catch (e) {
    console.error("Pendo track error (filtered_export_completed):", e);
  }
}

function trackParametricExportCompleted(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("parametric_export_completed", {
        item_count: metadata.item_count || 0,
        export_format: metadata.export_format || "pdf",
        file_size: metadata.file_size || 0,
        filing_year_filter: metadata.filing_year_filter || "",
        category_filter: metadata.category_filter || "",
        forum_filter: metadata.forum_filter || "",
        assignment_state_filter: metadata.assignment_state_filter || "",
        parameter_count: metadata.parameter_count || 0,
      });
    }
  } catch (e) {
    console.error("Pendo track error (parametric_export_completed):", e);
  }
}

/* ------------------------------------------------------------------ */
/*  4. Search & Filter Events                                         */
/* ------------------------------------------------------------------ */

function trackCaseSearchExecuted(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("case_search_executed", {
        search_query: metadata.search_query || "",
        results_count: metadata.results_count || 0,
        search_type: metadata.search_type || "text",
        response_time_ms: metadata.response_time_ms || 0,
      });
    }
  } catch (e) {
    console.error("Pendo track error (case_search_executed):", e);
  }
}

function trackAdvancedFilterApplied(metadata) {
  try {
    if (typeof pendo !== "undefined") {
      pendo.track("advanced_filter_applied", {
        filter_dimensions: metadata.filter_dimensions || "",
        filter_count: metadata.filter_count || 0,
        results_count: metadata.results_count || 0,
        filing_year_filter: metadata.filing_year_filter || "",
        category_filter: metadata.category_filter || "",
        forum_filter: metadata.forum_filter || "",
        status_filter: metadata.status_filter || "",
        response_time_ms: metadata.response_time_ms || 0,
      });
    }
  } catch (e) {
    console.error("Pendo track error (advanced_filter_applied):", e);
  }
}
