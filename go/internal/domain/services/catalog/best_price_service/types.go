package best_price_service

import (
	"database/sql"
)

type IdImpl int

type IdProd int

type IdWhs int

type IdCat int

type PercentsMapKey map[IdImpl]map[IdWhs]map[IdCat]sql.NullFloat64
type CargosMapKey map[IdImpl]map[IdProd]sql.NullFloat64
