<?php

namespace App\Services\Subscription\App\AppStore\Client;

class JwsDecoder
{
    private $headers;

    private $payload;

    public function __construct(private $signedString)
    {
        $this->jwsDecode();
    }

    public static function toArray($signedString)
    {
        return (new self($signedString))->getPayload();
    }

    private function jwsDecode()
    {
        $components = explode('.', $this->signedString);
        $this->headers = json_decode($this->_base64DecodeUrl($components[0]));
        $this->payload = json_decode($this->_base64DecodeUrl($components[1]));
    }

    private function _base64DecodeUrl($data)
    {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function getPayload(): array
    {
        return (array) $this->payload;
    }
}