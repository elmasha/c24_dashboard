export default ({ app }) => {
  if (!app.$fire || !app.$fire.auth) return;

  app.$fire.auth.setPersistence(
    app.$fireModule.auth.Auth.Persistence.LOCAL
  ).catch((error) => {
    console.error("Failed to set auth persistence:", error);
  });
};