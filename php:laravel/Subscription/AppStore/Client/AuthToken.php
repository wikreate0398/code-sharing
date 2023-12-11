<?php

namespace App\Services\Subscription\App\AppStore\Client;

use Firebase\JWT\JWT;

class AuthToken
{
    public function __construct(private $conf)
    {}

    public function get()
    {
        return JWT::encode(
            $this->_payload(),
            file_get_contents($this->conf['key_path']),
            'ES256',
            head: $this->_header()
        );
    }

    private function _payload()
    {
        return [
            'iss' => $this->conf['issue_id'],
            'iat' => now()->timestamp,
            'exp' => now()->addHours()->timestamp,
            'aud' => 'appstoreconnect-v1',
            'bid' => $this->conf['boundle_id'],
        ];
    }

    private function _header()
    {
        return [
            'alg' => 'ES256',
            'kid' => $this->conf['key_id'],
            'typ' => 'JWT',
        ];
    }
}