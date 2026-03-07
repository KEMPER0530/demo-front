const PUBLIC_ROUTES = new Set(['/signin', '/signup', '/activate', '/privacy', '/terms']);

export default defineNuxtRouteMiddleware(async (to) => {
  const path = to.path.replace(/\/+$/, '') || '/';
  if (PUBLIC_ROUTES.has(path)) {
    return;
  }

  const auth = useAuth();
  await auth.init();

  if (!auth.isAuthenticated.value) {
    return navigateTo('/signin');
  }
});
