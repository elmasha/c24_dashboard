export default function ({ app, route, redirect }) {
  const user = app.$fire?.auth?.currentUser

  const protectedRoutes = [
    '/admin/dashboard',
    '/campaigns/all',
    '/machines',
    '/clients',
    
  ]

  const protectedRoutes1 = [
    '/client-dashboard',
  ]

  const authRoutes = [
     '/admin/dashboard',
    '/campaigns/all',
    '/machines',
    '/clients',
  ]

  const authRoutes1 = [
    '/client-dashboard',
  ]

  //Not logged in & trying to access protected routes
  // if (protectedRoutes.includes(route.path) && !user) {
  //   return redirect('/auth/admin.login')
  // }

  // if (protectedRoutes1.includes(route.path) && !user) {
  //   return redirect('/auth/client.login')
  // }

 // Logged in & trying to access auth pages
  // if (authRoutes.includes(route.path) && user) {
  //   return redirect('/auth/admin.login')
  // }
  // // Logged in & trying to access auth pages
  // if (authRoutes1.includes(route.path) && user) {
  //   return redirect('/auth/client.login')
  // }
}
