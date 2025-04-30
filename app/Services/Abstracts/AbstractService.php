<?php
namespace App\Services\Abstracts;
use App\Models\User;
use App\Repositories\Abstracts\AbstractRepository;
use Illuminate\Database\Eloquent\Collection;
use MongoDB\Laravel\Eloquent\Model;

abstract class AbstractService
{
    public function getModel()
    {
        return $this->repository->getModel();
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update(array $data, int $id): int
    {
        return $this->repository->update($data, $id);
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }

    public function all(): Collection
    {
        return $this->repository->all();
    }

    public function find(int $id)
    {
        return $this->repository->find($id);
    }

    public function findByName(string $name):? Model
    {

        return $this->repository->getModel()->where('name', $name)->first();
    }

}
