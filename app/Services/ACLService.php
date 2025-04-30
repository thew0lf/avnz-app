<?php

namespace App\Services;

use App\Repositories\ACLRepository; // Adjust the namespace as necessary
use Exception;

class ACLService
{
    /**
     * The ACL repository instance.
     *
     * @var ACLRepository
     */
    protected ACLRepository $repository;

    /**
     * ACLService constructor.
     *
     * @param ACLRepository $repository
     */
    public function __construct(ACLRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Attempts to find an ACL record using the given criteria. If no record is found,
     * a new record is created using the merged attributes.
     *
     * @param array $attributes The attributes to search by.
     * @param array $values Additional attributes for the creation if not found.
     *
     * @return mixed The found or newly created ACL record.
     *
     * @throws Exception If creation fails.
     */
    public function findOrCreate(array $attributes, array $values = []): mixed
    {
        // Begin a query using the repository's query builder.
        $query = $this->repository->getQuery();
        // Add where clauses for each of the provided attributes.
        foreach ($attributes as $key => $value) {
            $query->where($key, $value);
        }
        // Attempt to fetch the first matching record.
        $record = $query->first();

        if (!$record) {
            // Merge attributes and additional values and create a new record.
            $data = array_merge($attributes, $values);
            $record = $this->repository->create($data);
        }

        return $record;
    }
}
