<?php

namespace App\Services\Subscription\App\GooglePlay\ValuesObjects;

use Carbon\Carbon;

class Time
{
    private $carbon;

    public function __construct($date)
    {
        $this->carbon = Carbon::create($date);
    }

    public function getCarbon()
    {
        return $this->carbon;
    }
}