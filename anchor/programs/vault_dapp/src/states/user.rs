use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserState {
    pub owner: Pubkey,
    pub vault_count: u64,
}
