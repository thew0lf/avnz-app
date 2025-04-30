<?php

declare(strict_types=1);

namespace App\Services\Interfaces;

use App\Repositories\Abstracts\AbstractRepository;
use Illuminate\Database\Eloquent\Collection;

interface ServiceInterface
{
    public function __construct(AbstractRepository $repository);

    public function create(array $data);

    public function update(array $data, int $id): int;

    public function delete(int $id): bool;

    public function all(): Collection;

    public function find(int $id);
}
