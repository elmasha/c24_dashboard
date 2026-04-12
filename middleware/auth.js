export default function ({ app, route, redirect }) {
  return new Promise((resolve) => {
    const path = route.path;

    const adminEmails = [
      "test@gmail.com",
      "admin2@example.com",
    ];

    const adminProtectedRoutes = [
      "/admin/dashboard",
      "/campaigns/all",
      "/machines",
      "/clients",
    ];

    const clientProtectedRoutes = [
      "/client-dashboard",
      "/clients/campaign",
      "/clients/assigned-machine",
      "/clients/notification",
    ];

    const adminAuthPages = [
      "/auth/admin.login",
    ];

    const clientAuthPages = [
      "/auth/client.login",
      "/client.set.password",
    ];

    const isAdminProtected = adminProtectedRoutes.includes(path);
    const isClientProtected = clientProtectedRoutes.includes(path);
    const isAdminAuthPage = adminAuthPages.includes(path);
    const isClientAuthPage = clientAuthPages.includes(path);

    const unsubscribe = app.$fire.auth.onAuthStateChanged((user) => {
      unsubscribe();

      const isLoggedIn = !!user;
      const userEmail = (user?.email || "").toLowerCase();
      const isAdmin = isLoggedIn && adminEmails.includes(userEmail);

      if (isAdminProtected && !isLoggedIn) {
        redirect("/auth/admin.login");
        return resolve();
      }

      if (isClientProtected && !isLoggedIn) {
        redirect("/auth/client.login");
        return resolve();
      }

      if (isAdminProtected && isLoggedIn && !isAdmin) {
        redirect("/client-dashboard");
        return resolve();
      }

      if (isClientProtected && isLoggedIn && isAdmin) {
        redirect("/admin/dashboard");
        return resolve();
      }

      if (isAdminAuthPage && isLoggedIn && isAdmin) {
        redirect("/admin/dashboard");
        return resolve();
      }

      if (isAdminAuthPage && isLoggedIn && !isAdmin) {
        redirect("/client-dashboard");
        return resolve();
      }

      if (isClientAuthPage && isLoggedIn && !isAdmin) {
        redirect("/client-dashboard");
        return resolve();
      }

      if (isClientAuthPage && isLoggedIn && isAdmin) {
        redirect("/admin/dashboard");
        return resolve();
      }

      resolve();
    });
  });
}