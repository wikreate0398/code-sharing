<?php

namespace App\Services\User\Payment\Middleware\Core;

use App\Enum\PaymentMiddlewareTypeEnum;
use App\Services\User\Payment\Middleware\Interfaces\AfterTransaction;
use App\Services\User\Payment\Middleware\Interfaces\BeforeTransaction;
use App\Services\User\Payment\Middleware\KernelPaymentMiddleware;
use Illuminate\Pipeline\Pipeline;

class PaymentMiddlewareManager
{
    /**
     * @var PaymentMiddleware[]
     */
    protected $beforeTransaction = [];

    protected $afterTransaction = [];

    /**
     * @param PaymentMiddlewareTypeEnum $type
     * @param BeforeTransaction|BeforeTransaction[] $middlewares
     * @return $this
     */
    public function addBeforeTransaction(PaymentMiddlewareTypeEnum $type, BeforeTransaction|array $middlewares): self
    {
        $this->add($type, $middlewares);
        return $this;
    }

    /**
     * @param PaymentMiddlewareTypeEnum $type
     * @param AfterTransaction|AfterTransaction[] $middlewares
     * @return $this
     */
    public function addAfterTransaction(PaymentMiddlewareTypeEnum $type, AfterTransaction|array $middlewares): self
    {
        $this->add($type, $middlewares);
        return $this;
    }

    /**
     * @param PaymentMiddlewareTypeEnum $type
     * @param PaymentMiddleware|PaymentMiddleware[] $middlewares
     * @return void
     */
    private function add(PaymentMiddlewareTypeEnum $type, PaymentMiddleware|array $middlewares)
    {
        foreach (is_array($middlewares) ? $middlewares : [$middlewares] as $middleware) {
            $this->{$type->value}[] = $middleware;
        }
    }

    public function apply(
        PaymentMiddlewareTypeEnum $type,
        PaymentMiddlewareDto $dto,
        \Closure $destination = null
    )
    {
        $additionalsMiddlewares = collect(
            (new KernelPaymentMiddleware())->{"{$type->value}Middleware"}()
        )->filter(function ($middleware) use ($dto, $type) {
            return $this->considerAdditionalMdlware(app($middleware), $dto);
        })->toArray();

        $pipeline = app(Pipeline::class)
            ->send($dto)
            ->through([
                ...$additionalsMiddlewares,
                ...$this->{$type->value}
            ])
            ->via("{$type->value}Handler");

        if ($destination) {
            return $pipeline->then($destination);
        }

        return $pipeline->thenReturn();
    }

    private function considerAdditionalMdlware(PaymentMiddleware $middleware, PaymentMiddlewareDto $dto): bool
    {
        return $middleware->auth($dto->user) && $middleware->getCashboxAccess() == $dto->cashbox;
    }
}