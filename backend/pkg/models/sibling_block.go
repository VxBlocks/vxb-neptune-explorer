package models

import (
	"context"
	"fetch"
	"timescale"
)

type SiblingBlocks struct {
	Block []Block
}

// Fetch implements fetch.DataSource.
func (s *SiblingBlocks) Fetch(ctx context.Context, block *Block) error {
	for _, siblingBlock := range block.SiblingBlocks {
		blockInfo, err := GetNeptuneClient().GetBlockByHash(ctx, siblingBlock)
		if err != nil {
			return err
		}
		s.Block = append(s.Block, *BlockFromRpcType(blockInfo))
	}

	return nil
}

// Name implements fetch.DataSource.
func (s *SiblingBlocks) Name() string {
	return "sibling_blocks"
}

// PreProcess implements fetch.DataSource.
func (s *SiblingBlocks) PreProcess(ctx context.Context, block *Block) error {
	return nil
}

// Process implements fetch.DataSource.
func (s *SiblingBlocks) Process(ctx context.Context, block *Block) error {
	return nil
}

// Save implements fetch.DataSource.
func (s *SiblingBlocks) Save(ctx context.Context, block *Block) error {
	if len(s.Block) == 0 {
		return nil
	}

	return timescale.GetPostgresGormTypedDB(ctx, &Block{}).Create(s.Block).Error
}

var _ fetch.DataSource[*Block] = (*SiblingBlocks)(nil)
