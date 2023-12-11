<?php

namespace App\Services\Subscription\App\Adapter;

abstract class AdapterSubscriptionAbstract
{
    public function toArray(): array
    {
        $data = [];
        foreach (get_class_methods($this) as $methodName) {
            if (substr($methodName, 0, 3) == 'get') {
                $data[lcfirst(substr($methodName,  3))] = $this->{$methodName}();
            }
        }
        return $data;
    }
}