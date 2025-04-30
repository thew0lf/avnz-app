<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Exception;
use App\Services\Abstracts\AbstractService;
use App\Models\{Client,Company,Project,User};
class RegistrationService extends AbstractService
{
    protected ClientService $clientService;
    protected CompanyService $companyService;
    protected UserService $userService;
    protected ACLService $ACLService;
    protected PermissionService $permissionService;

    protected Client $client;

    protected Project $project;

    protected Company $company;

    // Getter for client
    public function getClient(): Client
    {
        return $this->client;
    }

    // Setter for client
    public function setClient(Client $client): self
    {
        $this->client = $client;
        return $this;
    }

    // Getter for project
    public function getProject(): Project
    {
        return $this->project;
    }

    // Setter for project
    public function setProject(Project $project): self
    {
        $this->project = $project;
        return $this;
    }

    /**
     * Get the company.
     *
     * @return Company
     */
    public function getCompany(): Company
    {
        return $this->company;
    }

    /**
     * Set the company.
     *
     * @param Company $company
     * @return self
     */
    public function setCompany(Company $company): self
    {
        $this->company = $company;
        return $this;
    }

    public function __construct(
        ProjectService $projectService,
        ClientService $clientService,
        CompanyService $companyService,
        UserService $userService,
        ACLService $aclService,
        PermissionService $permissionService
    ) {
        $this->clientService     = $clientService;
        $this->companyService    = $companyService;
        $this->userService       = $userService;
        $this->ACLService        = $aclService;
        $this->permissionService = $permissionService;
    }

    /**
     * Registers a new user along with creating related client and company entries.
     *
     * This method uses a DB transaction to perform all the actions atomically.
     *
     * @param array $validated The validated registration data.
     * @param mixed $project   The project instance to associate with the user.
     *
     * @return mixed Returns the created user instance.
     *
     * @throws Exception If any step in the registration fails.
     */
    public function registerUser(array $validated, $project): mixed
    {
        $this->setProject($project);

        return DB::transaction(function () use ($validated, $project) {
            // Determine the user role based on whether any users exist.
            // If this is the first user, they are granted the "administrator" role, otherwise "account_administrator".
            $roleSlug = !$this->userService
                                ->repository->getQuery()
                                ->limit(1)
                                ->first() ? 'administrator' : 'account_administrator';
            $roleName = ucwords(str_replace('_', ' ', $roleSlug));
            $this->ACLService->findOrCreate(
                ['role' => $roleSlug, 'resource' => 'all', 'name' => $roleName],
                ['permissions' => ['all']]
            );

            // Create client and company instances
            $client = $this->clientService->create([
                'name' => $validated['name'],
            ]);

            $company = $this->companyService->create([
                'name' => $validated['name'],
            ]);

            // Create the user and assign the role.
            $user = $this->userService->create([
                'name'       => $validated['name'],
                'email'      => $validated['email'],
                'password'   => Hash::make($validated['password']),
                'project_id' => $project->id,
                'client_id'  => $client->id,
                'company_id' => $company->id
            ]);

            // Establish relationships
            $user->client()->attach($client);
            $user->company()->attach($company);
            $user->project()->attach($project);
            $this->setClient($client);
            $this->setCompany($company);
            $this->permissionService->givePermissionsTo($user, $project, $client, $company, [$roleSlug]);
            return $user;
        });
    }

}
