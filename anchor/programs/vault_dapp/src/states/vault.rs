use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub owner: Pubkey,
    pub is_locked: bool,
    pub created_at: i64,
    #[max_len(32)]
    pub name: String,
    #[max_len(128)]
    pub description: String,
}