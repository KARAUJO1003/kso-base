import { IPermissions } from "../interfaces/permissions";
import { SIDEBAR_PAGES } from "@/config/sidebar-menu.config";

export function groupPermissionsByGroup(permissions: IPermissions[]) {
  const groupsMap = new Map();

  permissions?.forEach((permission) => {
    permission.permissao_grupos?.forEach((group: any) => {
      if (!groupsMap.has(group._id)) {
        groupsMap.set(group._id, {
          _id: group._id,
          name: group.name,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          moduleId: group._id,
          permissions: [],
        });
      }

      groupsMap.get(group._id).permissions.push({
        _id: permission._id,
        value: permission._id,
        label: permission.name,
        name: permission.name,
        roles: permission.roles,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      });
    });
  });

  return Array.from(groupsMap.values());
}

export function mapPermissionsToModules(
  userPermissions: any[],
  allGroupedPermissions: any[],
) {
  const modules: any[] = [];
  allGroupedPermissions.forEach((group, index) => {
    const getPermissionId = (permission: any) =>
      typeof permission === "string" ? permission : permission?._id;

    const groupPermissions = userPermissions.filter((permissionId) =>
      group.permissions.some((p: any) => p._id === getPermissionId(permissionId)),
    );

    if (groupPermissions.length > 0) {
      modules[index] = {
        moduleId: group._id,
        _id: group._id,
        name: group.name,
        permissions: groupPermissions.map((perm) => getPermissionId(perm)),
      };
    } else {
      modules[index] = {
        moduleId: group._id,
        _id: group._id,
        name: group.name,
        permissions: [],
      };
    }
  });

  return modules;
}

function removePagesWithInvalidURL(url: string) {
  return [
    ...SIDEBAR_PAGES.navMain,
    ...SIDEBAR_PAGES.navSecondary,
    ...SIDEBAR_PAGES.controleUsuarios,
  ].filter((page) => page.url !== url);
}
export const APP_PAGES = removePagesWithInvalidURL("#");
