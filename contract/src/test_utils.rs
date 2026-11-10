//! Test-only fixtures shared by every module's unit tests.
use crate::types::*;
use crate::Contract;
use ed25519_dalek::SigningKey;
use near_sdk::test_utils::VMContextBuilder;
use near_sdk::{testing_env, AccountId, NearToken};

pub const OWNER: &str = "owner.testnet";
pub const TREASURY: &str = "treasury.testnet";
pub const ALICE: &str = "alice.testnet";
pub const BOB: &str = "bob.testnet";
pub const CAROL: &str = "carol.testnet";
pub const CONTRACT: &str = "lives.owner.testnet";
pub const START_MS: u64 = 1_800_000_000_000;

pub fn verifier() -> SigningKey {
    SigningKey::from_bytes(&[7; 32])
}

pub fn verifier_key_string() -> String {
    format!("ed25519:{}", bs58::encode(verifier().verifying_key().to_bytes()).into_string())
}

pub fn account(name: &str) -> AccountId {
    name.parse().unwrap()
}

/// Sets the caller, time, deposit and block randomness for the next contract call.
pub fn context(caller: &str, ms: u64, deposit: NearToken, seed: [u8; 32]) {
    let mut b = VMContextBuilder::new();
    b.current_account_id(account(CONTRACT))
        .predecessor_account_id(account(caller))
        .signer_account_id(account(caller))
        .block_timestamp(ms * 1_000_000)
        .attached_deposit(deposit)
        .account_balance(NearToken::from_near(1_000))
        .random_seed(seed);
    testing_env!(b.build());
}

pub fn as_account(caller: &str) {
    context(caller, START_MS, NearToken::from_yoctonear(0), [5; 32]);
}

pub fn fresh() -> Contract {
    as_account(OWNER);
    Contract::new(account(OWNER), account(TREASURY), vec![verifier_key_string()])
}

pub fn sample_catalog() -> CatalogConfig {
    CatalogConfig {
        figures: vec![
            FigureConfig {
                figure_id: "euclid".into(),
                title: "Euclid".into(),
                media: "https://example.test/euclid.png".into(),
                supply_cap: 5,
                action_ids: vec!["euclid.school".into(), "euclid.museum".into()],
            },
            FigureConfig {
                figure_id: "alexander".into(),
                title: "Alexander".into(),
                media: "https://example.test/alexander.png".into(),
                supply_cap: 5,
                action_ids: vec!["alexander.levy".into(), "alexander.found".into()],
            },
        ],
        npc_actions: vec![
            npc("letters.teach", "letters", "education"),
            npc("letters.lend-books", "letters", "education"),
            npc("military.mentor", "military", "war"),
            npc("military.warn-levy", "military", "war"),
        ],
    }
}

fn npc(action: &str, group: &str, category: &str) -> NpcActionConfig {
    NpcActionConfig { action_id: action.into(), career_group: group.into(), category: category.into() }
}
