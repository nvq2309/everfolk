#!/usr/bin/env bash
# Builds and deploys the Everfolk lives contract to NEAR testnet, then loads its catalog and settings.
#   CONTRACT_ID=everfolk-lives-demo.testnet VERIFIER_PUBLIC_KEY=ed25519:... scripts/ranked/deploy-contract.sh
# Optional: OWNER_ID (default CONTRACT_ID), TREASURY_ID (default OWNER_ID), EVIDENCE_BASE_URL, DROP_RATE_BPS (default 500).
# A missing CONTRACT_ID account is created from the testnet faucet; keys go to ~/.near-credentials/testnet.
# Use a new CONTRACT_ID after any change to the contract's stored state layout.
set -euo pipefail
source "$(dirname "$0")/near.sh"
export PATH="$HOME/.cargo/bin:$PATH"

: "${CONTRACT_ID:?Set CONTRACT_ID, e.g. everfolk-lives-demo.testnet}"
: "${VERIFIER_PUBLIC_KEY:?Set VERIFIER_PUBLIC_KEY (ed25519:<base58>) for the life verifier}"
OWNER_ID="${OWNER_ID:-$CONTRACT_ID}"
TREASURY_ID="${TREASURY_ID:-$OWNER_ID}"
EVIDENCE_BASE_URL="${EVIDENCE_BASE_URL:-}"
DROP_RATE_BPS="${DROP_RATE_BPS:-500}"

echo "→ building contract"
(cd "$ROOT/contract" && cargo near build non-reproducible-wasm >/dev/null)

account_exists "$CONTRACT_ID" || faucet_account "$CONTRACT_ID"

echo "→ deploying $WASM to $CONTRACT_ID"
near_cli contract deploy "$CONTRACT_ID" use-file "$WASM" with-init-call new \
  json-args "{\"owner_id\":\"$OWNER_ID\",\"treasury_id\":\"$TREASURY_ID\",\"verifier_keys\":[\"$VERIFIER_PUBLIC_KEY\"]}" \
  prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' network-config "$NETWORK" sign-with-legacy-keychain send

CATALOG="$(node "$ROOT/scripts/ranked/contract-catalog.ts")"
call "$OWNER_ID" "$CONTRACT_ID" set_catalog "{\"catalog\":$CATALOG}"
call "$OWNER_ID" "$CONTRACT_ID" set_world_versions "{\"versions\":[\"$WORLD_VERSION\"]}"
PARAMS="{\"mint_fee\":\"1000000000000000000000000\",\"drop_rate_bps\":$DROP_RATE_BPS,\"source_mint_share_bps\":5000,\"royalty_sources_bps\":500,\"royalty_treasury_bps\":500,\"nobody_weight_bps\":5000,\"abandon_cooldown_ms\":600000,\"evidence_base_url\":\"$EVIDENCE_BASE_URL\"}"
call "$OWNER_ID" "$CONTRACT_ID" set_params "{\"params\":$PARAMS}"

echo "✓ deployed: https://testnet.nearblocks.io/address/$CONTRACT_ID"
