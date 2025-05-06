package listeners

import "go.uber.org/fx"

var Module = fx.Module("listeners",
	fx.Provide(NewPusherListener),
	fx.Provide(NewBestSaleListener),
)
