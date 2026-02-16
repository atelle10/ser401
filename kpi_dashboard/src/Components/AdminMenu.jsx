import React, { useEffect, useMemo, useState } from 'react'
import { authClient } from '../utils/authClient'

const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'admin', label: 'Admin' },
]

const AdminMenu = () => {
  const [users, setUsers] = useState([])
  const [roleEdits, setRoleEdits] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [updatingUserIds, setUpdatingUserIds] = useState(new Set())
  const [deletingUserIds, setDeletingUserIds] = useState(new Set())
  const [confirmSelfDemotion, setConfirmSelfDemotion] = useState(null)
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null)
  const [confirmApproveUser, setConfirmApproveUser] = useState(null)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      setIsLoading(true)
      setLoadError('')
      const result = await authClient.admin.listUsers()

      if (!isMounted) return

      if (result?.error) {
        const fallback = result.error.status
          ? `Failed to load users (${result.error.status} ${result.error.statusText})`
          : 'Failed to load users.'
        setLoadError(result.error.message || fallback)
        setUsers([])
        setIsLoading(false)
        return
      }

      const normalizedUsers = (result?.data?.users || []).map((user) => {
        const rawRole = user.role || ''
        const primaryRole = rawRole
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)[0] || 'viewer'

        return {
          id: user.id,
          name: user.name || user.email || 'Unknown user',
          email: user.email || '',
          role: primaryRole,
          status:
            user.verified === false
              ? 'Unverified'
              : user.banned
                ? 'Banned'
                : 'Active',
        }
      })

      setUsers(normalizedUsers)
      setIsLoading(false)
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  const editableUsers = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        pendingRole: roleEdits[user.id] || user.role,
      })),
    [users, roleEdits]
  )

  const handleRoleChange = (userId, nextRole) => {
    setRoleEdits((prev) => ({
      ...prev,
      [userId]: nextRole,
    }))
  }

  const handleApplyRole = async (userId) => {
    const nextRole = roleEdits[userId]
    const currentRole = users.find((user) => user.id === userId)?.role

    if (!nextRole || nextRole === currentRole) {
      setRoleEdits((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
      return
    }

    setActionError('')
    setActionSuccess('')

    const isSelf = session?.user?.id && session.user.id === userId
    if (isSelf && currentRole === 'admin' && nextRole !== 'admin') {
      setConfirmSelfDemotion({ userId, nextRole })
      return
    }

    setUpdatingUserIds((prev) => new Set(prev).add(userId))

    const result = await authClient.admin.setRole({
      userId,
      role: nextRole,
    })

    if (result?.error) {
      const fallback = result.error.status
        ? `Failed to update role (${result.error.status} ${result.error.statusText})`
        : 'Failed to update role.'
      setActionError(result.error.message || fallback)
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: nextRole }
            : user
        )
      )
      setRoleEdits((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
      setActionSuccess('Role updated successfully.')
    }

    setUpdatingUserIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }

  const handleApproveUser = async (userId) => {
    const targetUser = users.find((user) => user.id === userId)
    setConfirmApproveUser({
      userId,
      name: targetUser?.name || targetUser?.email || 'this user',
    })
  }

  const handleConfirmApproveUser = async () => {
    if (!confirmApproveUser) return
    const { userId } = confirmApproveUser
    setConfirmApproveUser(null)

    setActionError('')
    setActionSuccess('')
    setUpdatingUserIds((prev) => new Set(prev).add(userId))

    const result = await authClient.admin.updateUser({
      userId,
      data: { verified: true },
    })

    if (result?.error) {
      const fallback = result.error.status
        ? `Failed to approve user (${result.error.status} ${result.error.statusText})`
        : 'Failed to approve user.'
      setActionError(result.error.message || fallback)
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: 'Active' }
            : user
        )
      )
      setActionSuccess('User approved successfully.')
    }

    setUpdatingUserIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }

  const handleConfirmSelfDemotion = async () => {
    if (!confirmSelfDemotion) return
    const { userId, nextRole } = confirmSelfDemotion
    setConfirmSelfDemotion(null)

    setUpdatingUserIds((prev) => new Set(prev).add(userId))
    setActionError('')
    setActionSuccess('')

    const result = await authClient.admin.setRole({
      userId,
      role: nextRole,
    })

    if (result?.error) {
      const fallback = result.error.status
        ? `Failed to update role (${result.error.status} ${result.error.statusText})`
        : 'Failed to update role.'
      setActionError(result.error.message || fallback)
    } else {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: nextRole }
            : user
        )
      )
      setRoleEdits((prev) => {
        const next = { ...prev }
        delete next[userId]
        return next
      })
      setActionSuccess('Role updated successfully.')
    }

    setUpdatingUserIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }

  const handleRemoveUser = (userId) => {
    const isSelf = session?.user?.id && session.user.id === userId
    if (isSelf) {
      setActionError('You cannot delete your own account from the admin console.')
      setActionSuccess('')
      return
    }

    const targetUser = users.find((user) => user.id === userId)
    setConfirmDeleteUser({
      userId,
      name: targetUser?.name || targetUser?.email || 'this user',
    })
  }

  const handleConfirmDeleteUser = async () => {
    if (!confirmDeleteUser) return
    const { userId } = confirmDeleteUser
    setConfirmDeleteUser(null)

    setActionError('')
    setActionSuccess('')
    setDeletingUserIds((prev) => new Set(prev).add(userId))

    const result = await authClient.admin.removeUser({ userId })

    if (result?.error) {
      const fallback = result.error.status
        ? `Failed to remove user (${result.error.status} ${result.error.statusText})`
        : 'Failed to remove user.'
      setActionError(result.error.message || fallback)
    } else {
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      setActionSuccess('User removed successfully.')
    }

    setDeletingUserIds((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }

  return (
    <div className="p-2 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Admin Console
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold">User Management</h2>
          <p className="text-sm text-white/80 mt-1">
            Review registered users, adjust roles, or remove access.
          </p>
        </div>
        {false && (
          <div className="flex flex-wrap gap-2">
            {/* TODO: Wire export list action to backend/users service. */}
            <button
              className="rounded-lg px-4 py-2 text-sm bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
              type="button"
            >
              Export list
            </button>
            {/* TODO: Wire invite user flow to better-auth or email invite service. */}
            <button
              className="rounded-lg px-4 py-2 text-sm bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              type="button"
            >
              Invite user
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/70 bg-blue-500/60">
          <div className="col-span-5 sm:col-span-4">User</div>
          <div className="col-span-4 hidden md:block">Email</div>
          <div className="col-span-3 sm:col-span-2">Role</div>
          <div className="col-span-4 sm:col-span-2 text-right">Actions</div>
        </div>

        {isLoading ? (
          <div className="px-4 py-10 text-center text-white/70">
            Loading users...
          </div>
        ) : loadError ? (
          <div className="px-4 py-10 text-center text-red-100">
            {loadError}
          </div>
        ) : actionSuccess ? (
          <div className="px-4 py-4 text-center text-green-100 space-y-3">
            <p>{actionSuccess}</p>
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
              onClick={() => setActionSuccess('')}
            >
              OK
            </button>
          </div>
        ) : actionError ? (
          <div className="px-4 py-4 text-center text-red-100 space-y-3">
            <p>{actionError}</p>
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
              onClick={() => setActionError('')}
            >
              OK
            </button>
          </div>
        ) : editableUsers.length === 0 ? (
          <div className="px-4 py-10 text-center text-white/70">
            No users found.
          </div>
        ) : (
          editableUsers.map((user) => {
            const isUnverified = user.status === 'Unverified'

            return (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-3 px-4 py-4 items-center border-t border-white/10"
              >
              <div className="col-span-5 sm:col-span-4">
                <p className="font-semibold">{user.name}</p>
                <p
                  className={
                    user.status === 'Active'
                      ? 'text-xs text-green-200'
                      : isUnverified
                        ? 'text-xs text-red-200'
                        : 'text-xs text-white/70'
                  }
                >
                  {user.status}
                </p>
                <p className="text-xs text-white/70 md:hidden">{user.email}</p>
              </div>
              <div className="col-span-4 hidden md:block text-sm text-white/80">
                {user.email}
              </div>
              {!isUnverified && (
                <div className="col-span-3 sm:col-span-2">
                  <select
                    className="w-full rounded-md bg-white text-blue-900 text-sm px-2 py-1"
                    value={user.pendingRole}
                    onChange={(event) =>
                      handleRoleChange(user.id, event.target.value)
                    }
                  >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                  </select>
                </div>
              )}
              <div
                className={
                  isUnverified
                    ? 'col-span-7 sm:col-span-4 flex flex-col sm:flex-row justify-end gap-2 text-sm'
                    : 'col-span-4 sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 text-sm'
                }
              >
                <button
                  className="rounded-md px-3 py-1 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
                  type="button"
                  onClick={() =>
                    isUnverified
                      ? handleApproveUser(user.id)
                      : handleApplyRole(user.id)
                  }
                  disabled={updatingUserIds.has(user.id)}
                >
                  {updatingUserIds.has(user.id)
                    ? isUnverified ? 'Approving...' : 'Updating...'
                    : isUnverified ? 'Approve' : 'Update role'}
                </button>
                <button
                  className="rounded-md px-3 py-1 bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  type="button"
                  onClick={() => handleRemoveUser(user.id)}
                  disabled={deletingUserIds.has(user.id)}
                >
                  {deletingUserIds.has(user.id)
                    ? 'Removing...'
                    : 'Remove'}
                </button>
              </div>
            </div>
            )
          })
        )}
      </div>
      {confirmSelfDemotion && (
        <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white rounded-lg px-4 py-4 text-center space-y-3">
          <p>
            You are removing your own admin access. This may lock you out of admin features.
            Continue?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
              onClick={() => {
                if (confirmSelfDemotion) {
                  setRoleEdits((prev) => {
                    const next = { ...prev }
                    delete next[confirmSelfDemotion.userId]
                    return next
                  })
                }
                setConfirmSelfDemotion(null)
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              onClick={handleConfirmSelfDemotion}
            >
              Yes, remove admin
            </button>
          </div>
        </div>
      )}
      {confirmDeleteUser && (
        <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white rounded-lg px-4 py-4 text-center space-y-3">
          <p>
            Remove access for <span className="font-semibold">{confirmDeleteUser.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
              onClick={() => setConfirmDeleteUser(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              onClick={handleConfirmDeleteUser}
            >
              Yes, remove user
            </button>
          </div>
        </div>
      )}
      {confirmApproveUser && (
        <div className="bg-blue-500/40 shadow-blue-500/20 shadow-md text-white rounded-lg px-4 py-4 text-center space-y-3">
          <p>
            Approve access for <span className="font-semibold">{confirmApproveUser.name}</span>?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
              onClick={() => setConfirmApproveUser(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-1.5 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={handleConfirmApproveUser}
            >
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMenu
