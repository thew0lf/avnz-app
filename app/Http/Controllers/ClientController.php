<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Services\ShortCodeService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ClientController extends Controller
{
    protected ShortCodeService $shortCodeService;

    public function __construct(ShortCodeService $shortCodeService)
    {
        $this->shortCodeService = $shortCodeService;
    }
    /**
     * Display a listing of the clients.
     *
     * @return Response
     */
    public function index(): Response
    {
        $clients = Client::all();

        return Inertia::render('security/clients/index', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a newly created client in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255|unique:clients',
                'address_book_id' => 'nullable|string',
                'project_id' => 'nullable|string',
                'status' => 'nullable|string',
                'short_code' => 'nullable|string|max:10',
            ]);

            // Extract project_id from the data
            $projectId = $data['project_id'] ?? null;
            unset($data['project_id']); // Remove from data array as it's not a direct field in Client model

            // Create the client
            $client = Client::create($data);

            // Ensure a short_code is set
            if (empty($client->short_code)) {
                $client->short_code = $this->shortCodeService->getCode();
                $client->save();
            }

            // If a project_id was provided, create the project-client association
            if ($projectId) {
                $client->projectClients()->create(['project_id' => $projectId]);
            }

            return redirect()->route('security.clients.index')->with('success', 'Client created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ClientController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create client. Please try again.');
        }
    }

    /**
     * Update the specified client in storage.
     * Also handles updating project associations.
     *
     * @param Request $request
     * @param Client $client
     * @return RedirectResponse
     */
    public function update(Request $request, Client $client): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('clients')->ignore($client->id),
                ],
                'address_book_id' => 'nullable|string',
                'project_id' => 'nullable|string|exists:projects,_id',
                'status' => 'nullable|string',
                'short_code' => 'nullable|string|max:10',
            ]);

            // Extract project_id from the data
            $projectId = $data['project_id'] ?? null;
            unset($data['project_id']); // Remove from data array as it's not a direct field in Client model

            // Update the client's attributes
            $client->update($data);

            // Ensure a short_code is set
            if (empty($client->short_code)) {
                $client->short_code = $this->shortCodeService->getCode();
                $client->save();
            }

            // If a project_id was provided, update the project-client association
            if ($projectId) {
                // Check if the association already exists
                if (!$client->projectClients()->where('project_id', $projectId)->exists()) {
                    // Create new association
                    $client->projectClients()->create(['project_id' => $projectId]);
                }
            }

            return redirect()->route('security.clients.index')->with('success', 'Client updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ClientController::update(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update client. Please try again.');
        }
    }

    /**
     * Remove the specified client from storage.
     *
     * @param Client $client
     * @return RedirectResponse
     */
    public function destroy(Client $client): RedirectResponse
    {
        try {
            // Delete all user-client associations
            $client->userClients()->delete();

            // Delete all project-client associations
            $client->projectClients()->delete();

            // Delete all companies belonging to this client
            foreach ($client->companies as $company) {
                // This will trigger the company's delete method which should clean up its own associations
                $company->delete();
            }

            // Delete all role assignments for this client
            $client->roleAssignments()->delete();

            // Delete the client
            $client->delete();

            return redirect()->route('security.clients.index')->with('success', 'Client deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ClientController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete client. Please try again.');
        }
    }
}
