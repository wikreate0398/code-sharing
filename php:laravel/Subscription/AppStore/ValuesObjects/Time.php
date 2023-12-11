<?php

namespace App\Services\Subscription\App\AppStore\ValuesObjects;

use Carbon\Carbon;

class Time
{
    private $carbon;

    public function __construct($date)
    {
        $this->carbon = Carbon::createFromTimestamp($date/1000);
    }

    public function getCarbon()
    {
        return $this->carbon;
    }

    public function getDateTimeStr()
    {
        return $this->carbon->format('Y-m-d H:i:s');
    }
}