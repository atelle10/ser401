export const isUnverifiedUser = (user) => {
  if (!user) return false
  if (typeof user.isUnverified === 'boolean') return user.isUnverified
  return user.verified === false
}

export const countUnverifiedUsers = (users = []) =>
  users.reduce((total, user) => total + (isUnverifiedUser(user) ? 1 : 0), 0)
