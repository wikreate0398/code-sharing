package mocks

import (
	"context"
	"database/sql"
	"github.com/stretchr/testify/mock"
)

type MockDb struct {
	mock.Mock
}

func (db *MockDb) BeginTx(ctx context.Context) (context.Context, error) {
	return ctx, nil
}

func (db *MockDb) CommitTx(ctx context.Context) error {
	return nil
}

func (db *MockDb) RollbackTx(ctx context.Context) {}

func (db *MockDb) Transaction(ctx context.Context, fnc func(ctx context.Context) error) error {
	return fnc(ctx)
}

func (db *MockDb) GetCtx(ctx context.Context, entity interface{}, query string, args ...interface{}) error {
	return nil
}

func (db *MockDb) Select(entity interface{}, query string, args ...interface{}) error {
	return nil
}

func (db *MockDb) SelectCtx(ctx context.Context, entity interface{}, query string, args ...interface{}) error {
	return nil
}

func (db *MockDb) ExecCtx(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return nil, nil
}

func (db *MockDb) BatchUpdateCtx(ctx context.Context, table string, identifier string, arg interface{}) (sql.Result, error) {
	return nil, nil
}

func (db *MockDb) QueryCtx(ctx context.Context, query string, args ...any) (*sql.Rows, error) {
	return nil, nil
}

func (db *MockDb) Query(query string, args ...any) (*sql.Rows, error) {
	return nil, nil
}
