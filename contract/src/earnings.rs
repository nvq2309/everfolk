use crate::shares::{split_amount, Share};
use crate::types::{TokenStats, MAX_BPS};
use crate::{Contract, ContractExt};
use near_sdk::json_types::U128;
use near_sdk::{env, near, require, AccountId, NearToken, Promise};

#[near]
impl Contract {
    /// Pays out everything this account has earned as a source (or as treasury).
    pub fn withdraw(&mut self) -> Promise {
        let account = env::predecessor_account_id();
        let amount = self.balances.remove(&account).unwrap_or(0);
        require!(amount > 0, "Nothing to withdraw");
        Promise::new(account).transfer(NearToken::from_yoctonear(amount))
    }

    pub fn balance_of(&self, account_id: AccountId) -> U128 {
        U128(self.balances.get(&account_id).copied().unwrap_or(0))
    }

    pub fn sources_of(&self, token_id: String) -> Vec<Share> {
        self.sources.get(&token_id).cloned().unwrap_or_default()
    }

    pub fn children_of(&self, token_id: String, from_index: u32, limit: u32) -> Vec<String> {
        let children = self.children.get(&token_id).cloned().unwrap_or_default();
        children.into_iter().skip(from_index as usize).take(limit.min(100) as usize).collect()
    }

    pub fn token_stats(&self, token_id: String) -> TokenStats {
        self.stats.get(&token_id).cloned().unwrap_or_default()
    }
}

impl Contract {
    pub(crate) fn credit(&mut self, account: &AccountId, amount: u128) {
        if amount == 0 {
            return;
        }
        let balance = self.balances.get(account).copied().unwrap_or(0);
        self.balances.insert(account.clone(), balance + amount);
    }

    fn owner_of(&self, token_id: &str) -> AccountId {
        self.nft.owner_by_id.get(&token_id.to_string()).unwrap_or_else(|| env::panic_str("Token not found"))
    }

    /// Splits the sources' part of a mint fee by impact, credits each source's current owner, and sends the rest to treasury.
    pub(crate) fn pay_sources(&mut self, child: &str, fee: u128, shares: &[Share]) {
        self.sources.insert(child.to_string(), shares.to_vec());
        let source_part = fee / MAX_BPS as u128 * self.params.source_mint_share_bps as u128
            + fee % MAX_BPS as u128 * self.params.source_mint_share_bps as u128 / MAX_BPS as u128;
        let (parts, _) = split_amount(source_part, shares);
        let mut paid = 0;
        for (token_id, amount) in parts {
            let owner = self.owner_of(&token_id);
            self.credit(&owner, amount);
            paid += amount;
            let mut stats = self.token_stats(token_id.clone());
            stats.lives_influenced += 1;
            stats.earned = U128(stats.earned.0 + amount);
            self.stats.insert(token_id.clone(), stats);
            let mut children = self.children.get(&token_id).cloned().unwrap_or_default();
            children.push(child.to_string());
            self.children.insert(token_id, children);
        }
        let treasury = self.treasury_id.clone();
        self.credit(&treasury, fee - paid);
    }
}
