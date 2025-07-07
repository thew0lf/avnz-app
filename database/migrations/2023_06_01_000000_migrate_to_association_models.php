<?php

use App\Models\Client;
use App\Models\Company;
use App\Models\Project;
use App\Models\ProjectClient;
use App\Models\Team;
use App\Models\User;
use App\Models\UserClient;
use App\Models\UserCompany;
use App\Models\UserProject;
use App\Models\UserTeam;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;

class MigrateToAssociationModels extends Migration
{
    /**
     * Run the migration.
     *
     * @return void
     */
    public function up()
    {
        Log::info('Starting migration to association models');

        // Migrate User-Project relationships
        $this->migrateUserProjects();

        // Migrate User-Client relationships
        $this->migrateUserClients();

        // Migrate User-Company relationships
        $this->migrateUserCompanies();

        // Migrate User-Team relationships
        $this->migrateUserTeams();

        // Migrate Project-Client relationships
        $this->migrateProjectClients();

        Log::info('Completed migration to association models');
    }

    /**
     * Reverse the migration.
     *
     * @return void
     */
    public function down()
    {
        // This migration is not reversible
        Log::warning('This migration cannot be reversed');
    }

    /**
     * Migrate User-Project relationships
     */
    private function migrateUserProjects()
    {
        Log::info('Migrating User-Project relationships');

        // Get all users
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                // Check if the user has project_ids
                if (isset($user->project_ids) && is_array($user->project_ids)) {
                    foreach ($user->project_ids as $projectId) {
                        try {
                            // Create UserProject association
                            UserProject::create([
                                'user_id' => $user->id,
                                'project_id' => $projectId,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating User-Project relationship: {$e->getMessage()}", [
                                'user_id' => $user->id,
                                'project_id' => $projectId,
                            ]);
                        }
                    }
                }
            }
        });

        // Get all projects
        Project::chunk(100, function ($projects) {
            foreach ($projects as $project) {
                // Check if the project has user_ids
                if (isset($project->user_ids) && is_array($project->user_ids)) {
                    foreach ($project->user_ids as $userId) {
                        try {
                            // Create UserProject association if it doesn't exist
                            UserProject::firstOrCreate([
                                'user_id' => $userId,
                                'project_id' => $project->id,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating Project-User relationship: {$e->getMessage()}", [
                                'project_id' => $project->id,
                                'user_id' => $userId,
                            ]);
                        }
                    }
                }
            }
        });
    }

    /**
     * Migrate User-Client relationships
     */
    private function migrateUserClients()
    {
        Log::info('Migrating User-Client relationships');

        // Get all users
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                // Check if the user has client_ids
                if (isset($user->client_ids) && is_array($user->client_ids)) {
                    foreach ($user->client_ids as $clientId) {
                        try {
                            // Create UserClient association
                            UserClient::create([
                                'user_id' => $user->id,
                                'client_id' => $clientId,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating User-Client relationship: {$e->getMessage()}", [
                                'user_id' => $user->id,
                                'client_id' => $clientId,
                            ]);
                        }
                    }
                }
            }
        });

        // Get all clients
        Client::chunk(100, function ($clients) {
            foreach ($clients as $client) {
                // Check if the client has user_ids
                if (isset($client->user_ids) && is_array($client->user_ids)) {
                    foreach ($client->user_ids as $userId) {
                        try {
                            // Create UserClient association if it doesn't exist
                            UserClient::firstOrCreate([
                                'user_id' => $userId,
                                'client_id' => $client->id,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating Client-User relationship: {$e->getMessage()}", [
                                'client_id' => $client->id,
                                'user_id' => $userId,
                            ]);
                        }
                    }
                }
            }
        });
    }

    /**
     * Migrate User-Company relationships
     */
    private function migrateUserCompanies()
    {
        Log::info('Migrating User-Company relationships');

        // Get all users
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                // Check if the user has company_ids
                if (isset($user->company_ids) && is_array($user->company_ids)) {
                    foreach ($user->company_ids as $companyId) {
                        try {
                            // Create UserCompany association
                            UserCompany::create([
                                'user_id' => $user->id,
                                'company_id' => $companyId,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating User-Company relationship: {$e->getMessage()}", [
                                'user_id' => $user->id,
                                'company_id' => $companyId,
                            ]);
                        }
                    }
                }
            }
        });

        // Get all companies
        Company::chunk(100, function ($companies) {
            foreach ($companies as $company) {
                // Check if the company has user_ids
                if (isset($company->user_ids) && is_array($company->user_ids)) {
                    foreach ($company->user_ids as $userId) {
                        try {
                            // Create UserCompany association if it doesn't exist
                            UserCompany::firstOrCreate([
                                'user_id' => $userId,
                                'company_id' => $company->id,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating Company-User relationship: {$e->getMessage()}", [
                                'company_id' => $company->id,
                                'user_id' => $userId,
                            ]);
                        }
                    }
                }
            }
        });
    }

    /**
     * Migrate User-Team relationships
     */
    private function migrateUserTeams()
    {
        Log::info('Migrating User-Team relationships');

        // Get all users
        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                // Check if the user has team_ids
                if (isset($user->team_ids) && is_array($user->team_ids)) {
                    foreach ($user->team_ids as $teamId) {
                        try {
                            // Create UserTeam association
                            UserTeam::create([
                                'user_id' => $user->id,
                                'team_id' => $teamId,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating User-Team relationship: {$e->getMessage()}", [
                                'user_id' => $user->id,
                                'team_id' => $teamId,
                            ]);
                        }
                    }
                }
            }
        });

        // Get all teams
        Team::chunk(100, function ($teams) {
            foreach ($teams as $team) {
                // Check if the team has user_ids
                if (isset($team->user_ids) && is_array($team->user_ids)) {
                    foreach ($team->user_ids as $userId) {
                        try {
                            // Create UserTeam association if it doesn't exist
                            UserTeam::firstOrCreate([
                                'user_id' => $userId,
                                'team_id' => $team->id,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating Team-User relationship: {$e->getMessage()}", [
                                'team_id' => $team->id,
                                'user_id' => $userId,
                            ]);
                        }
                    }
                }
            }
        });
    }

    /**
     * Migrate Project-Client relationships
     */
    private function migrateProjectClients()
    {
        Log::info('Migrating Project-Client relationships');

        // Get all projects
        Project::chunk(100, function ($projects) {
            foreach ($projects as $project) {
                // Check if the project has client_ids
                if (isset($project->client_ids) && is_array($project->client_ids)) {
                    foreach ($project->client_ids as $clientId) {
                        try {
                            // Create ProjectClient association
                            ProjectClient::create([
                                'project_id' => $project->id,
                                'client_id' => $clientId,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating Project-Client relationship: {$e->getMessage()}", [
                                'project_id' => $project->id,
                                'client_id' => $clientId,
                            ]);
                        }
                    }
                }
            }
        });

        // Get all clients
        Client::chunk(100, function ($clients) {
            foreach ($clients as $client) {
                // Check if the client has project_ids
                if (isset($client->project_ids) && is_array($client->project_ids)) {
                    foreach ($client->project_ids as $projectId) {
                        try {
                            // Create ProjectClient association if it doesn't exist
                            ProjectClient::firstOrCreate([
                                'project_id' => $projectId,
                                'client_id' => $client->id,
                            ]);
                        } catch (\Exception $e) {
                            Log::error("Error migrating Client-Project relationship: {$e->getMessage()}", [
                                'client_id' => $client->id,
                                'project_id' => $projectId,
                            ]);
                        }
                    }
                }
            }
        });
    }
}
