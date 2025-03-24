package interfaces

import (
	"context"
	"database/sql"
)

type DB interface {
	GetCtx(ctx context.Context, entity interface{}, query string, args ...interface{}) error
	Select(entity interface{}, query string, args ...interface{}) error
	SelectCtx(ctx context.Context, entity interface{}, query string, args ...interface{}) error

	Query(query string, args ...any) (*sql.Rows, error)
	QueryCtx(ctx context.Context, query string, args ...any) (*sql.Rows, error)

	//NamedExecCtx(ctx context.Context, query string, args interface{}) error
	BatchUpdateCtx(ctx context.Context, table string, identifier string, arg interface{}) (sql.Result, error)

	ExecCtx(ctx context.Context, query string, args ...interface{}) (sql.Result, error)

	Transaction(ctx context.Context, fnc func(ctx context.Context) error) error
}
