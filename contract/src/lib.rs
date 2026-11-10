//! Everfolk ranked lives: seeded births, live influence draws, verified mints and source royalties.
mod admin;
mod random;
mod types;

use near_sdk::{near, AccountId, NearToken, PanicOnDefault};
use types::{CatalogConfig, Params};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    pub(crate) owner_id: AccountId,
    pub(crate) treasury_id: AccountId,
    /// Raw 32-byte ed25519 public keys of trusted life verifiers.
    pub(crate) verifier_keys: Vec<[u8; 32]>,
    pub(crate) params: Params,
    pub(crate) catalog: CatalogConfig,
    pub(crate) world_versions: Vec<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId, treasury_id: AccountId, verifier_keys: Vec<String>) -> Self {
        Self {
            owner_id,
            treasury_id,
            verifier_keys: admin::parse_verifier_keys(&verifier_keys),
            params: Params {
                mint_fee: NearToken::from_near(1).as_yoctonear().into(),
                drop_rate_bps: 500,
                source_mint_share_bps: 5000,
                royalty_sources_bps: 500,
                royalty_treasury_bps: 500,
                nobody_weight_bps: 5000,
                abandon_cooldown_ms: 600_000,
                evidence_base_url: String::new(),
            },
            catalog: CatalogConfig::default(),
            world_versions: Vec::new(),
        }
    }
}

#[cfg(test)]
mod test_utils;
#[cfg(test)]
mod tests_admin;
