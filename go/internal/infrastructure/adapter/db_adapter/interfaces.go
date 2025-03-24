package db_adapter

import (
	"context"
	"database/sql"
)

type DbInstance interface {
	SelectContext(ctx context.Context, entity interface{}, query string, args ...interface{}) error
	GetContext(ctx context.Context, entity interface{}, query string, args ...interface{}) error
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)

	Exec(query string, args ...interface{}) (sql.Result, error)
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)

	MustExec(query string, args ...interface{}) sql.Result
	MustExecContext(ctx context.Context, query string, args ...interface{}) sql.Result
	NamedExec(query string, arg interface{}) (sql.Result, error)

	NamedExecContext(ctx context.Context, query string, arg interface{}) (sql.Result, error)
}
