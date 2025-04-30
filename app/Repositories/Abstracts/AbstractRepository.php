<?php

namespace App\Repositories\Abstracts;

use Illuminate\Support\Facades\DB;
use MongoDB\BSON\ObjectId;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Interfaces\RepositoryInterface;
use Illuminate\Database\Query\Builder;
use MongoDB\Laravel\Eloquent\Model;

abstract class AbstractRepository implements RepositoryInterface
{
    protected string $collectionName;
    protected $model;

    /**
     * Constructor.
     *
     * @param string $modelClass
     */
    public function __construct(string $modelClass)
    {
        $this->model = new $modelClass();
        $this->collectionName = $this->model->getTable();
    }

    /**
     * Returns the model instance.
     *
     * @return Model
     */
    public function getModel(): Model
    {
        return $this->model;
    }

    /**
     * Creates a new query builder instance for the collection.
     *
     * @return Builder
     */
    public function getQuery(): Builder
    {
        return DB::table($this->collectionName);
    }

    /**
     * Get all records.
     *
     * @return Collection
     */
    public function all(): Collection
    {
        return $this->getQuery()->get();
    }

    /**
     * Create a new record.
     *
     * @param array $data
     * @return Model|null
     */
    public function create(array $data): ?object
    {
        return $this->model->create($data);
    }

    /**
     * Update an existing record.
     *
     * @param array $data
     * @param string $id
     * @return int
     */
    public function update(array $data, string $id): int
    {
        return $this->getQuery()
            ->where('_id', $this->makeObjectId($id))
            ->update($data);
    }

    /**
     * Delete a record by its ID.
     *
     * @param string $id
     * @return bool
     */
    public function deleteById(string $id): bool
    {
        return (bool) $this->getQuery()
            ->where('_id', $this->makeObjectId($id))
            ->delete();
    }

    /**
     * Find a record by its ID.
     *
     * @param string $id
     * @return Model|null
     */
    public function findById(string $id): ?object
    {
        return $this->getQuery()
            ->where('_id', $this->makeObjectId($id))
            ->first();
    }

    /**
     * Find a record by name.
     *
     * @param string $name
     * @return Model|null
     */
    public function findByName(string $name): ?object
    {
        return $this->getQuery()
                    ->where('name', $name)
                    ->first();
    }

    /**
     * Convert a string ID to a MongoDB ObjectId instance.
     *
     * @param string $id
     * @return ObjectId
     */
    protected function makeObjectId(string $id): ObjectId
    {
        return new ObjectId($id);
    }
}
