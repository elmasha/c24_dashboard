export default function ({ app, route, redirect }) {
  return new Promise((resolve) => {
    const path = route.path;

    const adminEmails = [
      "test@gmail.com",
      "admin2@example.com",
    ];

    const isAdminProtected =
      path.startsWith("/admin") ||
      ["/campaigns/all", "/machines", "/clients"].includes(path);

    const isClientProtected =
      path.startsWith("/clients") ||
      ["/client-dashboard"].includes(path);

    const isAdminAuthPage = ["/auth/admin.login"].includes(path);

    const isClientAuthPage = [
      "/auth/client.login",
      "/client.set.password",
    ].includes(path);

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
        redirect("/auth/admin.login");
        return resolve();
      }

      if (isAdminProtected && isLoggedIn && !isAdmin) {
        redirect("/client-dashboard");
        return resolve();
      }

      // if (isClientProtected && isLoggedIn && isAdmin) {
      //   redirect("/admin/dashboard");
      //   return resolve();
      // }

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