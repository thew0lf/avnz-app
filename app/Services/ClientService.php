<?php

namespace App\Services;

use App\Repositories\ClientRepository;
use App\Services\Abstracts\AbstractService;
use App\Models\Client;

/**
 * Service to handle Client related operations.
 */
class ClientService extends AbstractService
{
    protected ShortCodeService $shortCodeService;

    public function __construct(ShortCodeService $shortCodeService)
    {
        $this->repository = new ClientRepository();
        $this->shortCodeService = $shortCodeService;
    }

    /**
     * Create a new client with a short code.
     *
     * @param array $data
     * @return Client
     */
    public function create(array $data)
    {
        // Create the client
        $client = $this->repository->create($data);

        // Ensure a short_code is set
        if (empty($client->short_code)) {
            $client->short_code = $this->shortCodeService->getCode();
            $client->save();
        }

        return $client;
    }
}
