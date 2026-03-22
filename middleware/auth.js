export default function ({ app, route, redirect }) {
  const user = app.$fire?.auth?.currentUser

  const protectedRoutes = [
    '/admin/dashboard',
    
  ]

  const protectedRoutes1 = [
    '/client-dashboard',
  ]

//   const authRoutes = [
//     '/employer',
//     '/auth/account'
//   ]

//   const authRoutes1 = [
//     '/bureau',
//     '/auth/account'
//   ]

  // Not logged in & trying to access protected routes
  if (protectedRoutes.includes(route.path) && !user) {
    return redirect('/auth/admin.login')
  }

  if (protectedRoutes1.includes(route.path) && !user) {
    return redirect('/auth/client.login')
  }

  // Logged in & trying to access auth pages
//   if (authRoutes.includes(route.path) && user) {
//     return redirect('/register/employer')
//   }
//   // Logged in & trying to access auth pages
//   if (authRoutes1.includes(route.path) && user) {
//     return redirect('/register/bureau')
//   }
}
