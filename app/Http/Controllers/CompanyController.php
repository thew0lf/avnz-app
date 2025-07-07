<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CompanyController extends Controller
{
    /**
     * Display a listing of the companies.
     *
     * @return Response
     */
    public function index(): Response
    {
        $companies = Company::all();

        return Inertia::render('security/companies/index', [
            'companies' => $companies,
        ]);
    }

    /**
     * Store a newly created company in storage.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255|unique:companies',
                'address_book_id' => 'nullable|string',
                'client_id' => 'required|string|exists:clients,_id',
                'status' => 'nullable|string',
            ]);

            // Create the company with the client relationship
            $company = Company::create($data);

            return redirect()->route('security.companies.index')->with('success', 'Company created successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in CompanyController::store(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create company. Please try again.');
        }
    }

    /**
     * Update the specified company in storage.
     *
     * @param Request $request
     * @param Company $company
     * @return RedirectResponse
     */
    public function update(Request $request, Company $company): RedirectResponse
    {
        try {
            $data = $request->validate([
                'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('companies')->ignore($company->id),
                ],
                'address_book_id' => 'nullable|string',
                'client_id' => 'nullable|string|exists:clients,_id',
                'status' => 'nullable|string',
            ]);

            $company->update($data);

            return redirect()->route('security.companies.index')->with('success', 'Company updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in CompanyController::update(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update company. Please try again.');
        }
    }

    /**
     * Remove the specified company from storage.
     *
     * @param Company $company
     * @return RedirectResponse
     */
    public function destroy(Company $company): RedirectResponse
    {
        try {
            // Delete all user-company associations
            $company->userCompanies()->delete();

            // Delete all teams belonging to this company
            foreach ($company->teams as $team) {
                // This will trigger the team's delete method which should clean up its own associations
                $team->delete();
            }

            // Delete all role assignments for this company
            $company->roleAssignments()->delete();

            // Delete the company
            $company->delete();

            return redirect()->route('security.companies.index')->with('success', 'Company deleted successfully.');
        } catch (\Exception $e) {
            \Log::error('Error in CompanyController::destroy(): ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete company. Please try again.');
        }
    }
}
