use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, Token, TokenAccount, Transfer},
};

use crate::{
    errors::VaultError,
    states::{UserState, VaultState},
};

#[derive(Accounts)]
#[instruction(vault_id: u64)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    pub asset_mint: Account<'info, Mint>,

    #[account(
      seeds = [b"user_state", owner.key().as_ref()],
      bump
    )]
    pub user_state: Account<'info, UserState>,

    #[account(
        seeds = [b"vault_state", owner.key().as_ref(), &vault_id.to_le_bytes()],
        bump
    )]
    pub vault: Account<'info, VaultState>,

    #[account(
        mut,
        constraint = user_token_account.owner == owner.key(),
        constraint = user_token_account.mint == asset_mint.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = vault_token_account.owner == vault.key(),
        constraint = vault_token_account.mint == asset_mint.key()
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl Deposit<'_> {
    pub fn deposit(&mut self, vault_id: u64, amount: u64) -> Result<()> {
        require!(
            self.user_state.vault_count >= vault_id,
            VaultError::InvalidVault
        );
        require!(self.vault.is_locked == false, VaultError::VaultLocked);
        require!(amount > 0, VaultError::InvalidAmount);

        let cpi_accounts = Transfer {
            from: self.user_token_account.to_account_info(),
            to: self.vault_token_account.to_account_info(),
            authority: self.owner.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, amount)?;

        msg!("Deposited {} tokens", amount);

        Ok(())
    }
}
