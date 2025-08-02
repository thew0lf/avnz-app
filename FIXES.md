# Project Fixes

## Issues Found and Fixed

### 1. Kernel File Issues
- **Issue**: The middleware namespace references in `app/Http/Kernel.php` were missing leading backslashes for fully qualified namespaces.
- **Fix**: Added leading backslashes to the middleware namespace references:
  ```php
  // Before
  'permission' => App\Http\Middleware\PermissionMiddleware::class,
  'scoped-permission' => App\Http\Middleware\CheckScopedPermission::class,
  
  // After
  'permission' => \App\Http\Middleware\PermissionMiddleware::class,
  'scoped-permission' => \App\Http\Middleware\CheckScopedPermission::class,
  ```

### 2. User Model Issues
- **Issue**: The User model was missing the `hasPermissionTo` method that is used in the PermissionMiddleware class.
- **Fix**: Added the missing method to the User model:
  ```php
  /**
   * Check if a user has a specific permission
   * 
   * This method is used by the PermissionMiddleware
   * 
   * @param string $permission The permission name to check
   * @return bool Whether the user has the permission
   */
  public function hasPermissionTo(string $permission): bool
  {
      // Check if user has global admin access or the specific permission
      return $this->hasGlobalPermission('administrator') || $this->hasGlobalPermission($permission);
  }
  ```

### 3. RegistrationService Issues
- **Issue 1**: The RegistrationService class was injecting a ProjectService dependency in the constructor but wasn't storing it in a class property.
- **Fix 1**: Added the missing ProjectService property and initialized it in the constructor:
  ```php
  // Added property
  protected ProjectService $projectService;
  
  // Updated constructor
  public function __construct(
      ProjectService    $projectService,
      ClientService     $clientService,
      CompanyService    $companyService,
      UserService       $userService,
      RoleService       $roleService,
      PermissionService $permissionService
  ) {
      $this->projectService    = $projectService;  // Added this line
      $this->clientService     = $clientService;
      $this->companyService    = $companyService;
      $this->userService       = $userService;
      $this->roleService       = $roleService;
      $this->permissionService = $permissionService;
  }
  ```

- **Issue 2**: The userExists check in the registerUser method was convoluted and hard to understand.
- **Fix 2**: Simplified the userExists check to make it more readable and efficient:
  ```php
  // Before
  $userExists = !$this->userService
                      ->repository->getQuery()
                      ->limit(1)
                      ->first() ? false : true;
  
  // After
  // Check if any users exist in the system
  $userExists = $this->userService->repository->getQuery()->exists();
  ```

## Summary
These fixes address several issues in the codebase:
1. Fixed namespace references in the Kernel.php file
2. Added a missing method to the User model
3. Fixed property initialization and improved code readability in the RegistrationService class

These changes should improve the stability and maintainability of the application.
