interface Permission {
  resource: string
  actions: string[]
}

interface Role {
  name: string
  permissions: Permission[]
}

type RoleRecord = Record<string, Role>

/**
 * Role-based access control configuration
 * Defines permissions for each role
 */
const ROLES: RoleRecord = {
  admin: {
    name: "admin",
    permissions: [
      {
        resource: "documents",
        actions: ["create", "read", "update", "delete", "share", "encrypt"],
      },
      {
        resource: "groups",
        actions: ["create", "read", "update", "delete", "manage_members"],
      },
      {
        resource: "audit_logs",
        actions: ["read", "export"],
      },
      {
        resource: "settings",
        actions: ["read", "update"],
      },
      {
        resource: "keys",
        actions: ["generate", "read", "delete"],
      },
    ],
  },
  user: {
    name: "user",
    permissions: [
      {
        resource: "documents",
        actions: ["create", "read", "update", "share", "encrypt"],
      },
      {
        resource: "groups",
        actions: ["read", "create"],
      },
      {
        resource: "audit_logs",
        actions: ["read"],
      },
      {
        resource: "keys",
        actions: ["generate", "read"],
      },
    ],
  },
  viewer: {
    name: "viewer",
    permissions: [
      {
        resource: "documents",
        actions: ["read"],
      },
      {
        resource: "groups",
        actions: ["read"],
      },
      {
        resource: "audit_logs",
        actions: ["read"],
      },
    ],
  },
}

/**
 * Checks if a user has permission for an action
 * @param userRole - The user's role
 * @param resource - The resource being accessed
 * @param action - The action being performed
 * @returns True if user has permission, false otherwise
 */
export const hasPermission = (userRole: string, resource: string, action: string): boolean => {
  const role = ROLES[userRole]
  if (!role) {
    return false
  }

  const permission = role.permissions.find((p) => p.resource === resource)
  return permission?.actions.includes(action) ?? false
}

/**
 * Gets all permissions for a specific role
 * @param role - The role to get permissions for
 * @returns Array of permissions for the role
 */
export const getRolePermissions = (role: string): Permission[] => {
  return ROLES[role]?.permissions ?? []
}

/**
 * Checks if a user can perform multiple actions
 * @param userRole - The user's role
 * @param requirements - Array of [resource, action] tuples
 * @returns True if user has all permissions, false otherwise
 */
export const hasAllPermissions = (userRole: string, requirements: Array<[string, string]>): boolean => {
  return requirements.every(([resource, action]) => hasPermission(userRole, resource, action))
}

/**
 * Checks if a user can perform any of the given actions
 * @param userRole - The user's role
 * @param requirements - Array of [resource, action] tuples
 * @returns True if user has any permission, false otherwise
 */
export const hasAnyPermission = (userRole: string, requirements: Array<[string, string]>): boolean => {
  return requirements.some(([resource, action]) => hasPermission(userRole, resource, action))
}

/**
 * Gets all available roles
 */
export const getAllRoles = (): string[] => {
  return Object.keys(ROLES)
}
