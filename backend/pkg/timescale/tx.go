package timescale

import (
	"context"
	"database/sql"
	"time"

	"gorm.io/gorm"
)

type Context struct {
	tx  *gorm.DB
	ctx context.Context
}

func NewTx(level sql.IsolationLevel) *Context {
	return &Context{
		tx: GetPostgresGormDB().Begin(&sql.TxOptions{
			Isolation: level,
		}),
		ctx: context.Background(),
	}
}

// Deadline implements context.Context.
func (t *Context) Deadline() (deadline time.Time, ok bool) {
	return t.ctx.Deadline()
}

// Done implements context.Context.
func (t *Context) Done() <-chan struct{} {
	return t.ctx.Done()
}

// Err implements context.Context.
func (t *Context) Err() error {
	return t.ctx.Err()
}

// Value implements context.Context.
func (t *Context) Value(key any) any {
	return t.ctx.Value(key)
}

var _ context.Context = &Context{}

func (t *Context) GetTxTypedDB(ctx context.Context, model Table) *gorm.DB {
	GetPostgresGormTypedDB(ctx, model)
	return t.tx.Table(model.TableName())
}

func (t *Context) Tx() *gorm.DB {
	return t.tx
}
