/**
 * VERITAS MASTERCORE — Unified System Authorization
 *
 * Alpine.js component for the login gateway.
 * Tracks: user_login_completed, user_login_failed
 */

document.addEventListener("alpine:init", () => {
  Alpine.data("authForm", () => ({
    username: "",
    password: "",
    tenantId: "",
    loading: false,
    errorMessage: "",
    attemptCount: 0,

    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      this.attemptCount++;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            tenant_id: this.tenantId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.errorMessage = data.detail || "Authentication failed";

          // Pendo Track: user_login_failed
          trackLoginFailed({
            failure_reason: data.detail || "invalid_credentials",
            attempt_count: this.attemptCount,
            tenant_id: this.tenantId,
          });

          return;
        }

        // Store JWT session token
        localStorage.setItem("access_token", data.access_token);

        // Pendo Track: user_login_completed
        trackLoginCompleted({
          auth_method: "credentials",
          tenant_id: this.tenantId,
          session_duration_limit: data.expires_in || 3600,
          user_role: data.user_role || "",
        });

        // Redirect to dashboard
        window.location.href = "/dashboard.html";
      } catch (err) {
        this.errorMessage = "Network error. Please try again.";

        // Pendo Track: user_login_failed
        trackLoginFailed({
          failure_reason: "network_error",
          attempt_count: this.attemptCount,
          tenant_id: this.tenantId,
        });
      } finally {
        this.loading = false;
      }
    },
  }));
});
