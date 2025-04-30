<?php

namespace App\Repositories\Interfaces;


interface RepositoryInterface
{
    public function all(): \Illuminate\Database\Eloquent\Collection;

    public function create(array $data);

    public function update(array $data, string $id): int;

    public function deleteById(string $id): bool;

    public function findById(string $id);
}
