import { AssetSortBy, AssetSortDirection, Interface, Scope, Context, OwnershipModel, RoyaltyModel, UseMethods } from './enums';
import { FullRwaAccount } from './types';
export declare namespace DAS {
    interface AssetsByOwnerRequest {
        ownerAddress: string;
        page: number;
        limit?: number;
        before?: string;
        after?: string;
        displayOptions?: DisplayOptions;
        sortBy?: AssetSortingRequest;
    }
    type AssetsByCreatorRequest = {
        creatorAddress: string;
        page: number;
        onlyVerified?: boolean;
        limit?: number;
        before?: string;
        after?: string;
        displayOptions?: DisplayOptions;
        sortBy?: AssetSortingRequest;
    };
    type GetAssetBatchRequest = {
        ids: Array<string>;
        displayOptions?: GetAssetDisplayOptions;
    };
    type AssetsByGroupRequest = {
        groupValue: string;
        groupKey: string;
        page: number;
        limit?: number;
        before?: string;
        after?: string;
        displayOptions?: DisplayOptions;
        sortBy?: AssetSortingRequest;
    };
    type GetAssetsBatchRequest = {
        ids: string[];
    };
    interface SearchAssetsRequest {
        page: number;
        limit?: number;
        before?: string;
        after?: string;
        creatorAddress?: string;
        ownerAddress?: string;
        jsonUri?: string;
        grouping?: string[];
        burnt?: boolean;
        sortBy?: AssetSortingRequest;
        frozen?: boolean;
        supplyMint?: string;
        supply?: number;
        interface?: string;
        delegate?: string;
        ownerType?: OwnershipModel;
        royaltyAmount?: number;
        royaltyTarget?: string;
        royaltyTargetType?: RoyaltyModel;
        compressible?: boolean;
        compressed?: boolean;
        tokenType?: TokenType;
    }
    type AssetsByAuthorityRequest = {
        authorityAddress: string;
        page: number;
        limit?: number;
        before?: string;
        after?: string;
        displayOptions?: DisplayOptions;
        sortBy?: AssetSortingRequest;
    };
    type GetAssetRequest = {
        id: string;
        displayOptions?: GetAssetDisplayOptions;
    };
    type GetRwaAssetRequest = {
        id: string;
    };
    type GetAssetProofRequest = {
        id: string;
    };
    type GetSignaturesForAssetRequest = {
        id: string;
        page: number;
        limit?: number;
        before?: string;
        after?: string;
    };
    interface AssetSorting {
        sort_by: AssetSortBy;
        sort_direction: AssetSortDirection;
    }
    type AssetSortingRequest = {
        sortBy: AssetSortBy;
        sortDirection: AssetSortDirection;
    };
    type GetAssetResponse = {
        interface: Interface;
        id: string;
        content?: Content;
        authorities?: Authorities[];
        compression?: Compression;
        grouping?: Grouping[];
        royalty?: Royalty;
        ownership: Ownership;
        creators?: Creators[];
        uses?: Uses;
        supply?: Supply;
        mutable: boolean;
        burnt: boolean;
        mint_extensions?: MintExtensions;
        token_info?: TokenInfo;
    };
    type GetRwaAssetResponse = {
        items: FullRwaAccount;
    };
    type GetAssetResponseList = {
        grand_total?: number;
        total: number;
        limit: number;
        page: number;
        items: GetAssetResponse[];
    };
    interface GetAssetProofResponse {
        root: string;
        proof: Array<string>;
        node_index: number;
        leaf: string;
        tree_id: string;
    }
    interface GetSignaturesForAssetResponse {
        total: number;
        limit: number;
        page?: number;
        before?: string;
        after?: string;
        items: Array<Array<string>>;
    }
    type DisplayOptions = {
        showUnverifiedCollections?: boolean;
        showCollectionMetadata?: boolean;
        showGrandTotal?: boolean;
        showRawData?: boolean;
        showFungible?: boolean;
        requireFullIndex?: boolean;
        showSystemMetadata?: boolean;
        showZeroBalance?: boolean;
        showClosedAccounts?: boolean;
        showNativeBalance?: boolean;
    };
    type GetAssetDisplayOptions = {
        showUnverifiedCollections?: boolean;
        showCollectionMetadata?: boolean;
        showRawData?: boolean;
        showFungible?: boolean;
        requireFullIndex?: boolean;
        showSystemMetadata?: boolean;
        showNativeBalance?: boolean;
        showInscription?: boolean;
    };
    interface Ownership {
        frozen: boolean;
        delegated: boolean;
        delegate?: string;
        ownership_model: OwnershipModel;
        owner: string;
    }
    interface Supply {
        print_max_supply: number;
        print_current_supply: number;
        edition_nonce?: number;
    }
    interface Uses {
        use_method: UseMethods;
        remaining: number;
        total: number;
    }
    interface Creators {
        address: string;
        share: number;
        verified: boolean;
    }
    interface Royalty {
        royalty_model: RoyaltyModel;
        target?: string;
        percent: number;
        basis_points: number;
        primary_sale_happened: boolean;
        locked: boolean;
    }
    interface Grouping {
        group_key: string;
        group_value: string;
        verified?: boolean;
        collection_metadata?: CollectionMetadata;
    }
    interface CollectionMetadata {
        name?: string;
        symbol?: string;
        image?: string;
        description?: string;
        external_url?: string;
    }
    interface Authorities {
        address: string;
        scopes: Array<Scope>;
    }
    type Links = {
        external_url?: string;
        image?: string;
        animation_url?: string;
        [Symbol.iterator](): Iterator<Links>;
    };
    interface Content {
        $schema: string;
        json_uri: string;
        files?: Files;
        metadata: Metadata;
        links?: Links;
    }
    interface File {
        uri?: string;
        mime?: string;
        cdn_uri?: string;
        quality?: FileQuality;
        contexts?: Context[];
        [Symbol.iterator](): Iterator<File>;
    }
    type Files = File[];
    interface FileQuality {
        schema: string;
    }
    interface Metadata {
        attributes?: Attribute[];
        description: string;
        name: string;
        symbol: string;
        token_standard?: TokenType;
    }
    interface Attribute {
        value: string;
        trait_type: string;
    }
    interface Compression {
        eligible: boolean;
        compressed: boolean;
        data_hash: string;
        creator_hash: string;
        asset_hash: string;
        tree: string;
        seq: number;
        leaf_id: number;
    }
    interface Editions {
        mint?: string;
        edition_address?: string;
        edition?: number;
    }
    interface GetNftEditionsRequest {
        mint?: string;
        page?: number;
        limit?: number;
    }
    interface GetNftEditionsResponse {
        total?: number;
        limit?: number;
        page?: number;
        master_edition_address?: string;
        supply?: number;
        max_supply?: number;
        editions?: Editions[];
    }
    interface TokenAccounts {
        address?: string;
        mint?: string;
        owner?: string;
        amount?: number;
        delegated_amount?: number;
        frozen?: boolean;
        token_extensions: any;
    }
    interface GetTokenAccountsRequest {
        mint?: string;
        owner?: string;
        page?: number;
        limit?: number;
        cursor?: string;
        before?: string;
        after?: string;
        options?: {
            showZeroBalance?: boolean;
        };
    }
    interface GetTokenAccountsResponse {
        total?: number;
        limit?: number;
        page?: number;
        cursor?: string;
        token_accounts?: TokenAccounts[];
    }
    type TokenType = 'fungible' | 'nonFungible' | 'compressedNft' | 'regularNft' | 'all' | (string & {});
    interface MintExtensions {
        confidential_transfer_mint?: ConfidentialTransferMint;
        confidential_transfer_fee_config?: ConfidentialTransferFeeConfig;
        transfer_fee_config?: TransferFeeConfig;
        metadata_pointer?: MetadataPointer;
        mint_close_authority?: MintCloseAuthority;
        permanent_delegate?: PermanentDelegate;
        transfer_hook?: TransferHook;
        interest_bearing_config?: InterestBearingConfig;
        default_account_state?: DefaultAccountState;
        confidential_transfer_account?: ConfidentialTransferAccount;
        metadata?: MintExtensionMetadata;
    }
    interface ConfidentialTransferMint {
        authority: string;
        auto_approve_new_accounts: boolean;
        auditor_elgamal_pubkey: string;
    }
    interface ConfidentialTransferFeeConfig {
        authority: string;
        withdraw_withheld_authority_elgamal_pubkey: string;
        harvest_to_mint_enabled: boolean;
        withheld_amount: string;
    }
    interface TransferFeeConfig {
        transfer_fee_config_authority: string;
        withdraw_withheld_authority: string;
        withheld_amount: number;
        older_transfer_fee: OlderTransferFee;
        newer_transfer_fee: NewTransferFee;
    }
    interface OlderTransferFee {
        epoch: string;
        maximum_fee: string;
        transfer_fee_basis_points: string;
    }
    interface NewTransferFee {
        epoch: string;
    }
    interface MetadataPointer {
        authority: string;
        metadata_address: string;
    }
    interface MintCloseAuthority {
        close_authority: string;
    }
    interface PermanentDelegate {
        delegate: string;
    }
    interface TransferHook {
        authority: string;
        programId: string;
    }
    interface InterestBearingConfig {
        rate_authority: string;
        initialization_timestamp: number;
        pre_update_average_rate: number;
        last_update_timestamp: number;
        current_rate: number;
    }
    interface DefaultAccountState {
        state: string;
    }
    interface ConfidentialTransferAccount {
        approved: boolean;
        elgamal_pubkey: string;
        pending_balance_lo: string;
        pending_balance_hi: string;
        available_balance: string;
        decryptable_available_balance: string;
        allow_confidential_credits: boolean;
        allow_non_confidential_credits: boolean;
        pending_balance_credit_counter: number;
        maximum_pending_balance_credit_counter: number;
        expected_pending_balance_credit_counter: number;
        actual_pending_balance_credit_counter: number;
    }
    interface MintExtensionMetadata {
        updateAuthority: string;
        mint: string;
        name: string;
        symbol: string;
        uri: string;
        additionalMetadata: AdditionalMetadata;
    }
    interface AdditionalMetadata {
        key: string;
        value: string;
    }
    interface TokenInfo {
        symbol?: string;
        balance?: number;
        supply?: number;
        decimals?: number;
        token_program?: string;
        associated_token_address?: string;
        price_info?: PriceInfo;
        mint_authority?: string;
        freeze_authority?: string;
    }
    interface PriceInfo {
        price_per_token: number;
        currency: string;
        total_price?: number;
    }
}
