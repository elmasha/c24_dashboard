export default function ({ app, route, redirect }) {
  const user = app.$fire?.auth?.currentUser

  const protectedRoutes = [
    '/employer',
    '/selection',
  ]

  const protectedRoutes1 = [
    '/bureau',
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
    return redirect('/register/employer')
  }

  if (protectedRoutes1.includes(route.path) && !user) {
    return redirect('/register/bureau')
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
