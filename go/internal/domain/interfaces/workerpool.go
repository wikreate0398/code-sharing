package interfaces

import (
	"context"
	"wikreate/fimex/pkg/workerpool"
)

type WorkerPool interface {
	Start(ctx context.Context)
	AddJob(job workerpool.Job)
	Wait(ctx context.Context)
	Stop()
	GetResultChan() <-chan error
}
