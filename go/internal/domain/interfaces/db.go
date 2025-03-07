package interfaces

import (
	"context"
	"database/sql"
)

type DB interface {
	Get(ctx context.Context, entity interface{}, query string, args ...interface{}) error
	Select(ctx context.Context, entity interface{}, query string, args ...interface{}) error
	Query(ctx context.Context, query string, args ...any) (*sql.Rows, error)
	NamedExec(ctx context.Context, query string, args interface{}) error
	BatchUpdate(ctx context.Context, table string, identifier string, arg interface{}) (sql.Result, error)

	Transaction(ctx context.Context, fnc func(ctx context.Context) error) error
}
