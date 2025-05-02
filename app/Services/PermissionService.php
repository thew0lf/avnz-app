<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\PermissionRepository;
use App\Services\Abstracts\AbstractService;
use App\Models\Project;
use App\Models\Client;
use App\Models\Company;

class PermissionService extends AbstractService
{

    protected $projectPermissions = ['admin'];
    protected $clientPermissions = ['client_admin', 'client_user', 'dashboard',];
    protected $companyPermissions = ['company_admin', 'company_user'];

    public function __construct()
    {
        $this->repository = new PermissionRepository();
    }
    public function hasPermission(Project $project, Client $client,Company $company, User $user,string $role): bool
    {
        $record = $this->repository->getQuery()
            ->where('user_id',$user->_id)
            ->where('project_id', $project->_id)
            ->where('client_id', $client->_id)
            ->where('company_id', $company->_id)
            ->first();

        return $record && in_array($role, $record->roles ?? []);
    }

    public function getPermissions(User $user):array
    {

        $record = $this->repository
                        ->getQuery()
                        ->where('user_id', $user->_id)
                        ->first();
        return ($record->roles ?? []);
    }
    public function hasAnyPermission(User $user, array $roles): bool
    {

        $record = $this->repository->getQuery()->where('user_id',$user->_id)->first();

        return !empty(array_intersect($record->permissions ?? [], $roles));
    }
    /**
     * Assign the given permissions to the user.
     *
     * @param User  $user
     * @param array $roles Array of permission names.
     */
    public function givePermissionsTo(User $user, Project $project, Client $client, Company $company,array $roles): void
    {
        $attributes = [
            'user_id'    => (string) $user->id,
            'project_id' => (string) $project->id,
            'client_id'  => (string) $client->id,
            'company_id' => (string) $company->id,
        ];

        $this->repository->getModel()
            ->updateOrCreate(
                $attributes,
                [ 'roles' => $roles ]
        );
    }

    public function getProjectPermissions(): array
    {
        return $this->projectPermissions;
    }
    public function getClientPermissions(): array
    {
        return $this->clientPermissions;
    }
    public function getCompanyPermissions(): array
    {
        return $this->companyPermissions;
    }
    public function getRegistrationPermissions(): array
    {
        return array_merge($this->clientPermissions, $this->companyPermissions);
    }
}
