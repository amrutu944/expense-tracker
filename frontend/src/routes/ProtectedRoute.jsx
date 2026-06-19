import { Navigate } from 'react-router-dom'

function ProtectedRoute({
  children,
}) {
  const token =
    localStorage.getItem(
      'token'
    )

  const user =
    localStorage.getItem(
      'user'
    )

  // Not logged in
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  // Logged in
  return children
}

export default ProtectedRoute