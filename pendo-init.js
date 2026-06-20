// Boot the Pendo SDK with an anonymous visitor.
// Empty visitor.id lets the SDK resolve from cookies/localStorage if available,
// otherwise it falls back to a new anonymous visitor.
pendo.initialize({
  visitor: {
    id: ''
  }
});

// After sign-in, call pendo.identify() to register the authenticated user.
// Example:
//   pendo.identify({
//     visitor: {
//       id: user.id
//     }
//   });

// On sign-out, call pendo.clearSession() to reset to a fresh anonymous visitor.
// Example:
//   pendo.clearSession();
