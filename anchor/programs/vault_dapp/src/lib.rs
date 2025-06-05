use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;

declare_id!("2HBN2FKDHHe88xMNBwkKm234Yyd86v3jzeBcQvcMc2Fm");

#[program]
pub mod vault_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, description: String) -> Result<()> {
        ctx.accounts.initialize(name, description)?;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, vault_id: u64, amount: u64) -> Result<()> {
        ctx.accounts.deposit(vault_id, amount)?;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, vault_id: u64, amount: u64, bump: u8) -> Result<()> {
        ctx.accounts.withdraw(vault_id, amount, bump)?;
        Ok(())
    }

    pub fn lock(ctx: Context<Lock>, vault_id: u64) -> Result<()> {
        ctx.accounts.lock(vault_id)?;
        Ok(())
    }

    pub fn unlock(ctx: Context<Unlock>, vault_id: u64) -> Result<()> {
        ctx.accounts.unlock(vault_id)?;
        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, vault_id: u64) -> Result<()> {
        ctx.accounts.transfer(vault_id)?;
        Ok(())
    }
}
