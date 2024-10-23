<?php

namespace App\Services\User\Payment\Logger;

use App\Models\User;
use App\Repository\Interfaces\PaymentServiceRepositoryInterface;
use App\Services\User\Payment\Enums\PaymentActionEnum;
use App\Services\User\Payment\Invokable\BallanceRecalculation;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInfo;
use App\Services\User\Payment\Logger\InfoValues\LogHistoryInterface;
use App\Services\User\Payment\Logger\Services\ServiceLog;

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
     * @param  User  $admin
     * @return $this
     */
    public function admin(?User $admin)
    {
        $this->historyInfo->setAdmin($admin);
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
    public function log(PaymentActionEnum|ServiceLog $loggerService, $params = [])
    {
        $enumLogService = $loggerService instanceof PaymentActionEnum ? $loggerService : null;

        $loggerServiceObj = $enumLogService !== null ?
            $this->detectService($enumLogService, $params) : $loggerService;

        $this->historyInfo->setServiceId(
            $this->getServiceId($loggerServiceObj, $enumLogService)
        );

        $loggerServiceObj->setCashbox($this->cashbox)
                      ->setHistoryInfo($this->historyInfo)
                      ->save();

        $this->recalculateBallance();
    }

    /**
     * @param PaymentActionEnum $type
     * @param $params
     * @return ServiceLog|null
     * @throws \ReflectionException
     */
    private function detectService(PaymentActionEnum $type, $params = []): ?ServiceLog
    {
        $userType = $this->historyInfo->getUser()->isClientGate() ? 'Customer' : 'Supplier';

        $namespace = "Services\User\Payment\Logger\Services\\$userType\\" . ucfirst(camel_case($this->cashbox));

        $files = collect(glob(app_path(str_replace('\\', '/', $namespace) . "/*.php")))->map(function ($file) use ($namespace) {
            return "App\\$namespace\\" . str_replace('.php', '', basename($file));
        });

        $objects = $files
            ->filter(function ($className) {
                return is_subclass_of($className, ServiceLog::class);
            });

        foreach ($objects as $object) {
            $obj = app($object, $params);
            $propTypeValue = $this->getServiceTypeProp($obj);

            if (is_array($propTypeValue) && in_array($type, $propTypeValue) || $type == $propTypeValue) {
                return $obj;
            }
        }

        throwE("Undefined $type->value log service from $userType in $this->cashbox cashbox");
    }

    /**
     * @param  ServiceLog  $loggerService
     * @return int|null
     * @throws \ReflectionException
     */
    private function getServiceId(ServiceLog $loggerService, PaymentActionEnum $enumLogService = null): int|null
    {
        $define = $this->getServiceTypeProp($loggerService);

        if (is_array($define)) {
            if (!$enumLogService) throwE('Log service must be a valid string');
            $define = in_array($enumLogService, $define) ? $enumLogService : null;
        }

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

    /**
     * @return void
     */
    private function recalculateBallance()
    {
        $id_user = $this->historyInfo->getUser()->id;
        $cashbox = $this->cashbox;

        dispatch(function () use ($id_user, $cashbox) {
            app(BallanceRecalculation::class)->recalculate($id_user, $cashbox);
        })->afterCommit();
    }
}