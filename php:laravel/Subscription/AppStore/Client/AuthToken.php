<?php

namespace App\Services\Subscription\App\AppStore\Client;

use Firebase\JWT\JWT;

class AuthToken
{
    public function __construct(private $conf, private $boundle_id = null)
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
            'bid' => $this->boundle_id ?: $this->conf['boundle_id'],
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