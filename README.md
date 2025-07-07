# AVNZ Application - Hierarchical Data Model and RBAC

## Overview

This document describes the hierarchical data model and Role-Based Access Control (RBAC) system implemented in the AVNZ application.

## Hierarchical Data Model

The application uses a hierarchical data model with the following structure:

```
Project
  └── Client
       └── Company
            └── Team
```

- **Project** is the root entity.
- **Clients** can belong to multiple **Projects**.
- **Clients** can have multiple **Companies**.
- **Companies** can have multiple **Teams**.
- **Users** can belong to multiple **Projects**, **Clients**, **Companies**, and **Teams**.

## Association Models

To implement many-to-many relationships between entities, the following association models have been created:

- **UserProject**: Associates users with projects
- **UserClient**: Associates users with clients
- **UserCompany**: Associates users with companies
- **UserTeam**: Associates users with teams
- **ProjectClient**: Associates projects with clients

These association models replace the embedded arrays that were previously used to store relationships.

## Role-Based Access Control (RBAC)

The RBAC system allows for fine-grained control over user permissions at different levels of the hierarchy.

### Roles and Permissions

- **Roles** are collections of permissions.
- **Permissions** define what actions a user can perform.
- **RoleAssignments** associate roles with users in a specific scope.

### Scopes

Permissions can be scoped to different levels of the hierarchy:

- **Project scope**: Permissions apply to a specific project
- **Client scope**: Permissions apply to a specific client
- **Company scope**: Permissions apply to a specific company
- **Team scope**: Permissions apply to a specific team
- **Global scope**: Permissions apply globally (for administrators)

### Administrator Role

The system includes a special **Administrator** role that has global access to all resources. This role is assigned to superusers.

## Middleware

The application includes a middleware for checking scoped permissions:

- **CheckScopedPermission**: Checks if a user has a specific permission in a specific scope

## Migration

To migrate from the old data model to the new one, run the following migration:

```
php artisan migrate
php artisan db:seed --class=AdministrationRoleSeeder
```

This will:

1. Create the necessary association collections
2. Migrate existing embedded arrays to association documents
3. Create the Administrator role and assign it to superusers

## Usage

### Checking Permissions

To check if a user has a permission in a specific scope:

```php
$user->hasPermissionInScope('view', 'project', $projectId);
$user->hasPermissionInScope('modify', 'client', $clientId);
$user->hasPermissionInScope('delete', 'company', $companyId);
$user->hasPermissionInScope('create', 'team', $teamId);
```

### Assigning Roles

To assign a role to a user in a specific scope:

```php
$user->assignRoleScope($role, 'project', $projectId);
$user->assignRoleScope($role, 'client', $clientId);
$user->assignRoleScope($role, 'company', $companyId);
$user->assignRoleScope($role, 'team', $teamId);
```

### Protecting Routes

Routes can be protected using the `scoped.permission` middleware:

```php
Route::get('/{team}', [TeamController::class, 'show'])
    ->middleware('scoped.permission:view,team')
    ->name('show');
```

This will check if the authenticated user has the 'view' permission in the 'team' scope for the specified team.
