//! Everfolk ranked lives: seeded births, live influence draws, verified mints and source royalties.
mod admin;
mod lives;
mod random;
mod types;

use near_sdk::store::LookupMap;
use near_sdk::{near, AccountId, BorshStorageKey, NearToken, PanicOnDefault};
use types::{CatalogConfig, Life, Params, TokenRecord};

#[near]
#[derive(BorshStorageKey)]
enum StorageKey {
    Lives,
    ActiveLife,
    AbandonedAt,
    Records,
    NpcPools,
    FigureCopies,
}

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
    pub(crate) lives: LookupMap<u64, Life>,
    pub(crate) active_life: LookupMap<AccountId, u64>,
    pub(crate) abandoned_at: LookupMap<AccountId, u64>,
    pub(crate) next_life_id: u64,
    pub(crate) records: LookupMap<String, TokenRecord>,
    /// NPC token ids by influence category.
    pub(crate) npc_pools: LookupMap<String, Vec<String>>,
    /// Figure copy token ids by figure id.
    pub(crate) figure_copies: LookupMap<String, Vec<String>>,
    pub(crate) next_token_id: u64,
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
            lives: LookupMap::new(StorageKey::Lives),
            active_life: LookupMap::new(StorageKey::ActiveLife),
            abandoned_at: LookupMap::new(StorageKey::AbandonedAt),
            next_life_id: 1,
            records: LookupMap::new(StorageKey::Records),
            npc_pools: LookupMap::new(StorageKey::NpcPools),
            figure_copies: LookupMap::new(StorageKey::FigureCopies),
            next_token_id: 1,
        }
    }
}

#[cfg(test)]
mod test_utils;
#[cfg(test)]
mod tests_admin;
#[cfg(test)]
mod tests_lives;
