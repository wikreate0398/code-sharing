package mysql

import (
	"context"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"time"
	"wikreate/fimex/internal/config"
	"wikreate/fimex/pkg/failed"
)

var timeout = 5 * time.Second

func NewClient(dbConf config.MySql) *sqlx.DB {

	dsn := fmt.Sprintf(
		"%s:%s@(%s:%d)/%s",
		dbConf.User, dbConf.Password, dbConf.Host, dbConf.Port, dbConf.Database,
	)

	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	db, err := sqlx.ConnectContext(ctx, "mysql", dsn)
	failed.PanicOnError(err, "Failed to connect to the database")

	err = db.PingContext(ctx)
	failed.PanicOnError(err, "Failed to ping the database")

	return db
}
