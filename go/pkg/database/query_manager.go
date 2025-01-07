package database

import (
	"context"
	"github.com/jmoiron/sqlx"
	"wikreate/fimex/pkg/database/mysql"
	"wikreate/fimex/pkg/failed"
)

type DbManager interface {
	GetDB() *sqlx.DB
	Get(entity interface{}, query string, args ...interface{})
	Select(entity interface{}, query string, args ...interface{})
}

type dbManager struct {
	db *sqlx.DB
}

func NewDBManager(ctx context.Context, creds mysql.DBCreds) DbManager {
	db := mysql.NewClient(ctx, creds)
	return &dbManager{db}
}

func (q *dbManager) GetDB() *sqlx.DB {
	return q.db
}

func (q *dbManager) Get(entity interface{}, query string, args ...interface{}) {
	failed.PanicOnError(q.db.Get(&entity, query, args...), "Failed get query")
}

func (q *dbManager) Select(entity interface{}, query string, args ...interface{}) {
	failed.PanicOnError(q.db.Select(entity, query, args...), "Failed select query")
}
