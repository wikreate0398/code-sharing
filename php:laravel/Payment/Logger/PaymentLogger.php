<?php

namespace App\Services\User\Payment\Logger;

use App\Models\User;
use App\Repository\Interfaces\PaymentServiceRepositoryInterface;
use App\Services\User\Payment\Invokable\BallanceRecalculation;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInfo;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInterface;
use App\Services\User\Payment\Logger\Services\ServiceLog;
use HaydenPierce\ClassFinder\ClassFinder;

class PaymentLogger
{
    /**
     * @var string
     */
    private string $cashbox;

    /**
     * @param  LogHistoryInfo  $historyInfo
     * @param  PaymentServiceRepositoryInterface  $paymentServiceRepository
     */
    public function __construct(
        private LogHistoryInfo $historyInfo,
        private PaymentServiceRepositoryInterface $paymentServiceRepository
    ) {}

    /**
     * @param  User  $user
     * @return $this
     */
    public function user(User $user)
    {
        $this->historyInfo->setUser($user);
        return $this;
    }

    /**
     * @param  float  $amount
     * @return $this
     */
    public function amount(float $amount)
    {
        $this->historyInfo->setAmount($amount);
        return $this;
    }

    /**
     * @return $this
     */
    public function charge()
    {
        $this->historyInfo->setIncrease('up');
        return $this;
    }

    /**
     * @return $this
     */
    public function extract()
    {
        $this->historyInfo->setIncrease('down');
        return $this;
    }

    /**
     * @param $value
     * @return $this
     */
    public function cashbox($value)
    {
        $this->cashbox = $value;
        return $this;
    }

    /**
     * @return LogHistoryInterface
     */
    public function getHistoryInfo(): LogHistoryInterface
    {
        return $this->historyInfo;
    }

    /**
     * @param  string|ServiceLog  $loggerService
     * @param  array  $params
     * @throws \ReflectionException
     */
    public function log(string|ServiceLog $loggerService, $params = [])
    {
        $loggerService = is_string($loggerService) ? $this->detectService($loggerService, $params) : $loggerService;

        $this->historyInfo->setServiceId(
            $this->getServiceId($loggerService)
        );

        $loggerService->setCashbox($this->cashbox)
                      ->setHistoryInfo($this->historyInfo)
                      ->save();

        $this->recalculateBallance();
    }

    /**
     * @param $type
     * @param  array  $params
     * @return \Illuminate\Contracts\Foundation\Application|mixed|void
     * @throws \ReflectionException
     */
    private function detectService($type, $params = [])
    {
        $userType = $this->historyInfo->getUser()->isClient() ? 'Customer' : 'Supplier';

        $namespace = "App\Services\User\Payment\Logger\Services\\$userType\\" . ucfirst($this->cashbox);
        $objects = collect(ClassFinder::getClassesInNamespace($namespace))
            ->filter(function ($className) {
                return is_subclass_of($className, ServiceLog::class);
            });

        foreach ($objects as $object) {
            $obj = app($object, $params);
            if ($type === $this->getServiceTypeProp($obj)) {
                return $obj;
            }
        }

        throwE("Undefined $type log service from $userType in $this->cashbox cashbox");
    }

    /**
     * @param  ServiceLog  $loggerService
     * @return int|null
     * @throws \ReflectionException
     */
    private function getServiceId(ServiceLog $loggerService): int|null
    {
        $define = $this->getServiceTypeProp($loggerService);
        return $this->paymentServiceRepository->getRecordByParams(compact('define'))?->id;
    }

    /**
     * @param  ServiceLog  $logService
     * @return mixed
     * @throws \ReflectionException
     */
    private function getServiceTypeProp(ServiceLog $logService)
    {
        $class = new \ReflectionClass($logService);
        return $class->getProperty('logServiceType')->getValue($logService);
    }

    private function recalculateBallance()
    {
        app(BallanceRecalculation::class)->recalculate(
            $this->historyInfo->getUser()->id, $this->cashbox
        );
    }
}