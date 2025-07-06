<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ClientController extends Controller
{
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

            $client = Client::create($data);

            return redirect()->route('security.clients.index')->with('success', 'Client created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ClientController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create client. Please try again.');
        }
    }

    /**
     * Update the specified client in storage.
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
                'project_id' => 'nullable|string',
                'status' => 'nullable|string',
                'short_code' => 'nullable|string|max:10',
            ]);

            $client->update($data);

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
            $client->delete();

            return redirect()->route('security.clients.index')->with('success', 'Client deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in ClientController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete client. Please try again.');
        }
    }
}
