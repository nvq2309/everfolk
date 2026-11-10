use near_sdk::json_types::U128;
use near_sdk::near;

pub const MAX_BPS: u16 = 10_000;

/// Admin-tunable economics. Every `*_bps` value is in basis points.
#[near(serializers = [json, borsh])]
#[derive(Clone, Debug, PartialEq)]
pub struct Params {
    pub mint_fee: U128,
    pub drop_rate_bps: u16,
    pub source_mint_share_bps: u16,
    pub royalty_sources_bps: u16,
    pub royalty_treasury_bps: u16,
    pub nobody_weight_bps: u16,
    pub abandon_cooldown_ms: u64,
    pub evidence_base_url: String,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug, PartialEq)]
pub struct FigureConfig {
    pub figure_id: String,
    pub title: String,
    pub media: String,
    pub supply_cap: u32,
    pub action_ids: Vec<String>,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug, PartialEq)]
pub struct NpcActionConfig {
    pub action_id: String,
    pub career_group: String,
    pub category: String,
}

#[near(serializers = [json, borsh])]
#[derive(Clone, Debug, Default, PartialEq)]
pub struct CatalogConfig {
    pub figures: Vec<FigureConfig>,
    pub npc_actions: Vec<NpcActionConfig>,
}
