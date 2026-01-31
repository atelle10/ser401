import React, { useMemo, useState } from 'react'

const roleOptions = ['User', 'Manager', 'Admin']

const AdminMenu = () => {
  const [users, setUsers] = useState([])
  const [roleEdits, setRoleEdits] = useState({})

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

  const handleApplyRole = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, role: roleEdits[userId] || user.role }
          : user
      )
    )
    setRoleEdits((prev) => {
      const next = { ...prev }
      delete next[userId]
      return next
    })
  }

  const handleRemoveUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
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

        {editableUsers.length === 0 ? (
          <div className="px-4 py-10 text-center text-white/70">
            No users loaded yet. Connect to the auth service to populate this list.
          </div>
        ) : (
          editableUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-3 px-4 py-4 items-center border-t border-white/10"
            >
              <div className="col-span-5 sm:col-span-4">
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-white/70">{user.status}</p>
                <p className="text-xs text-white/70 md:hidden">{user.email}</p>
              </div>
              <div className="col-span-4 hidden md:block text-sm text-white/80">
                {user.email}
              </div>
              <div className="col-span-3 sm:col-span-2">
                <select
                  className="w-full rounded-md bg-white text-blue-900 text-sm px-2 py-1"
                  value={user.pendingRole}
                  onChange={(event) =>
                    handleRoleChange(user.id, event.target.value)
                  }
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4 sm:col-span-2 flex flex-col sm:flex-row justify-end gap-2 text-sm">
                <button
                  className="rounded-md px-3 py-1 bg-white/80 text-blue-900 font-semibold hover:bg-white transition"
                  type="button"
                  onClick={() => handleApplyRole(user.id)}
                >
                  Update role
                </button>
                <button
                  className="rounded-md px-3 py-1 bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  type="button"
                  onClick={() => handleRemoveUser(user.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminMenu
