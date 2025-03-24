package db_adapter

import (
	"context"
	"database/sql"
	"github.com/jmoiron/sqlx"
	"wikreate/fimex/internal/constant"
	"wikreate/fimex/internal/domain/interfaces"
	"wikreate/fimex/pkg/mysql"
)

var _ interfaces.DB = (*DB)(nil)

type DB struct {
	db *sqlx.DB
}

func NewDBAdapter(db *sqlx.DB) *DB {
	return &DB{db: db}
}

func (dbm *DB) BeginTx() (*sqlx.Tx, error) {
	tx, err := dbm.db.Beginx()
	if err != nil {
		return nil, err
	}
	return tx, nil
}

func (dbm *DB) CommitTx(tx *sqlx.Tx) error {
	return tx.Commit()
}

func (dbm *DB) RollbackTx(tx *sqlx.Tx) error {
	return tx.Rollback()
}

func (dbm *DB) Transaction(ctx context.Context, fnc func(ctx context.Context) error) error {
	tx, err := dbm.BeginTx()

	defer func() {
		if err := recover(); err != nil {
			err := tx.Rollback()
			panic(err)
		}
	}()

	if err != nil {
		return err
	}

	ctx = context.WithValue(ctx, constant.KeyTx, tx)

	if err := fnc(ctx); err != nil {
		if err := tx.Rollback(); err != nil {
			return err
		}
		return err
	}

	return tx.Commit()
}

func instance(ctx context.Context, db *sqlx.DB) DbInstance {
	if tx, ok := ctx.Value(constant.KeyTx).(*sqlx.Tx); ok {
		return tx
	}
	return db
}

func (dbm *DB) GetCtx(ctx context.Context, entity interface{}, query string, args ...interface{}) error {
	if err := instance(ctx, dbm.db).GetContext(ctx, entity, query, args...); err != nil {
		return err
	}
	return nil
}

func (dbm *DB) SelectCtx(ctx context.Context, entity interface{}, query string, args ...interface{}) error {
	if err := instance(ctx, dbm.db).SelectContext(ctx, entity, query, args...); err != nil {
		return err
	}
	return nil
}

func (dbm *DB) Select(entity interface{}, query string, args ...interface{}) error {
	if err := dbm.db.Select(entity, query, args...); err != nil {
		return err
	}
	return nil
}

func (dbm *DB) QueryCtx(ctx context.Context, query string, args ...any) (*sql.Rows, error) {
	rows, err := instance(ctx, dbm.db).QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (dbm *DB) Query(query string, args ...any) (*sql.Rows, error) {
	rows, err := dbm.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	return rows, nil
}

func (dbm *DB) BatchUpdateCtx(ctx context.Context, table string, identifier string, arg interface{}) (sql.Result, error) {
	query, err := mysql.NewBatchUpdate(table, identifier, arg).Query()

	if err != nil {
		return nil, err
	}

	return instance(ctx, dbm.db).ExecContext(ctx, query)
}

func (dbm *DB) NamedExecCtx(ctx context.Context, query string, args interface{}) error {
	if _, err := instance(ctx, dbm.db).NamedExecContext(ctx, query, args); err != nil {
		return err
	}
	return nil
}

func (dbm *DB) ExecCtx(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	res, err := instance(ctx, dbm.db).ExecContext(ctx, query, args...)
	return res, err
}
