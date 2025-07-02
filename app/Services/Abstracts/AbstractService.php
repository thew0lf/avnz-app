<?php
namespace App\Services\Abstracts;
use App\Models\User;
use App\Repositories\Abstracts\AbstractRepository;
use Illuminate\Database\Eloquent\Collection;
use MongoDB\Laravel\Eloquent\Model;

abstract class AbstractService
{
    /**
     * The repository instance.
     *
     * @var \App\Repositories\Abstracts\AbstractRepository
     */
    protected $repository;
    public function getModel()
    {
        return $this->repository->getModel();
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update(array $data, string $id): int
    {
        return $this->repository->update($data, $id);
    }

    public function delete(string $id): bool
    {
        return $this->repository->deleteById($id);
    }

    public function all(): Collection
    {
        return $this->repository->all();
    }

    public function find(string $id)
    {
        return $this->repository->findById($id);
    }

    public function findByName(string $name):? Model
    {

        return $this->repository->getModel()->where('name', $name)->first();
    }

}
