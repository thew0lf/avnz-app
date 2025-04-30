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

        // Check and assign a short code for the user if not set
        if (empty($user->short_code)) {
            $user->short_code = $this->shortCodeService->getCode($user);
            $user->save();
        }
        // Check and assign a short code for the client if not set
        $client = $user->client()->first();
        if ($client && empty($client->short_code)) {
            $client->short_code = $this->shortCodeService->getCode();
            $client->save();
        }
    }
}
