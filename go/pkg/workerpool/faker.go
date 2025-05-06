package workerpool

import "context"

type FakeWorkerPool struct {
	errChan chan error
}

func NewFakeWorkerPool(errChan chan error) *FakeWorkerPool {
	return &FakeWorkerPool{
		errChan: errChan,
	}
}

func (f FakeWorkerPool) Start(ctx context.Context) {}

func (f FakeWorkerPool) AddJob(job Job) {
	job.Run(context.Background(), f.errChan)
}

func (f FakeWorkerPool) Wait(ctx context.Context) {}

func (f FakeWorkerPool) Stop() {}

func (f FakeWorkerPool) GetResultChan() <-chan error {
	return f.errChan
}
