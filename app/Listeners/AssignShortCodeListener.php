<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Registered;
use App\Services\ShortCodeService;

class AssignShortCodeListener
{
    protected ShortCodeService $shortCodeService;

    public function __construct(ShortCodeService $shortCodeService)
    {
        $this->shortCodeService = $shortCodeService;
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;

        // Only assign short_code to client
        $client = $user->clients()->first();
        if ($client && empty($client->short_code)) {
            $client->short_code = $this->shortCodeService->getCode();
            $client->save();
        }
    }
}
