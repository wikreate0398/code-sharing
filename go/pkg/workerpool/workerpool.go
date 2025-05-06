package workerpool

import (
	"context"
	"fmt"
	"reflect"
	"sync"
	"time"
)

type Job interface {
	Run(ctx context.Context, charErr chan<- error)
}

type WorkerPool struct {
	stopped       bool
	workerCount   int
	jobChannel    chan Job
	wg            sync.WaitGroup
	resultErrChan chan error
}

func NewWorkerPool(workerCount int) *WorkerPool {
	return &WorkerPool{
		stopped:       false,
		workerCount:   workerCount,
		jobChannel:    make(chan Job),
		resultErrChan: make(chan error),
	}
}

func (wp *WorkerPool) Start(ctx context.Context) {
	for i := 0; i < wp.workerCount; i++ {
		go wp.worker(ctx, i)
	}
}

func (wp *WorkerPool) worker(ctx context.Context, id int) {
	for job := range wp.jobChannel {
		func(job Job) {
			defer func() {
				if e := recover(); e != nil {
					wp.resultErrChan <- fmt.Errorf(
						"handle panic from worker: jobName %v, %v", reflect.TypeOf(job).Name(), e,
					)
				}

				wp.wg.Done()
			}()

			job.Run(ctx, wp.resultErrChan)
		}(job)
	}
}

func (wp *WorkerPool) AddJob(job Job) {
	if wp.stopped {
		return
	}

	wp.wg.Add(1)
	wp.jobChannel <- job
}

func (wp *WorkerPool) Wait(ctx context.Context) {
	c, cancel := context.WithDeadline(ctx, time.Now().Add(5*time.Second))
	defer cancel()

	done := make(chan struct{})
	go func() {
		wp.wg.Wait()
		close(done)
	}()

	select {
	case <-c.Done():
		fmt.Println("wait workerPool ctx.Done", c.Err())
		return
	case <-done:
		return
	}
}

func (wp *WorkerPool) Stop() {
	wp.stopped = true
	close(wp.jobChannel)
	close(wp.resultErrChan)
}

func (wp *WorkerPool) GetResultChan() <-chan error {
	return wp.resultErrChan
}
