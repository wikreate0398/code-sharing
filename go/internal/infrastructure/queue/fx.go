package queue

import (
	"context"
	"go.uber.org/fx"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/pkg/workerpool"
)

type Params struct {
	fx.In

	Lc      fx.Lifecycle
	Workers interfaces.WorkerPool
	Logger  interfaces.Logger
}

func runWorkerPool(p Params) {
	p.Lc.Append(fx.Hook{
		OnStart: func(_ context.Context) error {
			ctx := context.Background()
			p.Workers.Start(ctx)

			go func() {
				for res := range p.Workers.GetResultChan() {
					p.Logger.Errorf("err caught in worker pool: %v", res)
				}
			}()

			return nil
		},

		OnStop: func(ctx context.Context) error {
			p.Workers.Stop()
			p.Workers.Wait(ctx)
			return nil
		},
	})
}

var Module = func(workerCount int) fx.Option {
	return fx.Module("queue",
		fx.Provide(
			fx.Annotate(
				func() interfaces.WorkerPool {
					return workerpool.NewWorkerPool(workerCount)
				},
				fx.As(new(interfaces.WorkerPool)),
			),
		),

		fx.Invoke(runWorkerPool),
	)
}
