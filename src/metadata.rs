use serde::Deserialize;
use std::collections::BTreeMap;

pub type AlternativeDescriptions = BTreeMap<String, String>;
pub type AuthenticatorAttestationID = String;

#[derive(Debug, Clone, Deserialize)]
pub struct UnifiedProtocolVersion {
    pub major: u16,
    pub minor: u16,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VerificationMethodDescriptor {
    pub user_verification_method: Option<String>, // DOMString                   userVerificationMethod;
    pub ca_desc: Option<CodeAccuracyDescriptor>,  // CodeAccuracyDescriptor      caDesc;
    pub ba_desc: Option<BiometricAccuracyDescriptor>, // BiometricAccuracyDescriptor baDesc;
    pub pa_desc: Option<PatternAccuracyDescriptor>, // PatternAccuracyDescriptor   paDesc;
}

pub type VerificationMethodANDCombinations = Vec<VerificationMethodDescriptor>;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CodeAccuracyDescriptor {
    pub base: u16,           //required unsigned short base;
    pub min_length: u16,     //required unsigned short minLength;
    pub max_retries: u16,    //unsigned short          maxRetries;
    pub block_slowdown: u16, //unsigned short          blockSlowdown;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BiometricAccuracyDescriptor {
    #[serde(rename = "selfAttestedFRR")]
    pub self_attested_frr: f64, // double         selfAttestedFRR;
    #[serde(rename = "selfAttestedFAR")]
    pub self_attested_far: f64, // double         selfAttestedFAR;
    pub max_templates: u16,  // unsigned short maxTemplates;
    pub max_retries: u16,    // unsigned short maxRetries;
    pub block_slowdown: u16, // unsigned short blockSlowdown;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatternAccuracyDescriptor {
    pub min_complexity: u64, // required unsigned long minComplexity;
    pub max_retries: u16,    // unsigned short         maxRetries;
    pub block_slowdown: u16, // unsigned short         blockSlowdown;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DisplayPNGCharacteristicsDescriptor {
    pub width: u64,                         // required unsigned long width;
    pub height: u64,                        // required unsigned long height;
    pub bit_depth: u8,                      // required octet         bitDepth;
    pub color_type: u8,                     // required octet         colorType;
    pub compression: u8,                    // required octet         compression;
    pub filter: u8,                         // required octet         filter;
    pub interlace: u8,                      // required octet         interlace;
    pub plte: Option<Vec<RgbPaletteEntry>>, // rgbPaletteEntry[]      plte;
}

#[derive(Debug, Clone, Deserialize)]
pub struct RgbPaletteEntry {
    pub r: u16, // required unsigned short r;
    pub g: u16, // required unsigned short g;
    pub b: u16, // required unsigned short b;
}

#[derive(Debug, Clone, Deserialize)]
pub struct EcdaaTrustAnchor {
    pub x: String,  // required DOMString X;
    pub y: String,  // required DOMString Y;
    pub c: String,  // required DOMString c;
    pub sx: String, // required DOMString sx;
    pub sy: String, // required DOMString sy;
    #[serde(rename = "G1Curve")]
    pub g1_curve: String, // required DOMString G1Curve;
}

#[derive(Debug, Clone, Deserialize)]
pub struct ExtensionDescriptor {
    pub id: String,            // required DOMString id;
    pub tag: Option<u16>,      // unsigned short     tag;
    pub data: Option<String>,  // DOMString          data;
    pub fail_if_unknown: bool, // required boolean   fail_if_unknown;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthenticatorGetInfo {
    pub versions: Vec<String>,
    pub extensions: Option<Vec<String>>,
    pub aaguid: String,
    pub options: Option<BTreeMap<String, bool>>,
    pub max_msg_size: Option<u32>,
    pub pin_uv_auth_protocols: Option<Vec<u32>>,
    pub max_credential_count_in_list: Option<u32>,
    pub max_credential_id_length: Option<u32>,
    pub transports: Option<Vec<String>>,
    pub algorithms: Option<Vec<PublicKeyCredentialParameters>>,
    pub max_serialized_large_blob_array: Option<u32>,
    #[serde(rename = "forcePINChange")]
    pub force_pin_change: Option<bool>,
    #[serde(rename = "minPINLength")]
    pub min_pin_length: Option<u32>,
    pub firmware_version: Option<u32>,
    pub max_cred_blob_lengtth: Option<u32>,
    #[serde(rename = "maxRPIDsForSetMinPINLength")]
    pub max_rpids_for_set_min_pin_length: Option<u32>,
    pub preferred_platform_uv_attempts: Option<u32>,
    pub uv_modality: Option<u32>,
    pub certifications: Option<BTreeMap<String, i32>>,
    pub renaming_discoverable_credentials: Option<u32>,
    pub vendor_prototype_config_commands: Option<Vec<u32>>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct PublicKeyCredentialParameters {
    #[serde(rename = "type")]
    pub type_: String, // required DOMString                    type;
    pub alg: i32, //required COSEAlgorithmIdentifier      alg;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataStatement {
    pub legal_header: Option<String>, // DOMString                                    legalHeader;
    pub aaid: Option<AuthenticatorAttestationID>, // AAID                                         aaid;
    pub aaguid: Option<String>, // AAGUID                                       aaguid;
    pub attestation_certificate_key_identifiers: Option<Vec<String>>, // DOMString[]                                  attestationCertificateKeyIdentifiers;
    pub description: String, // required DOMString                           description;
    pub alternative_descriptions: Option<AlternativeDescriptions>, // AlternativeDescriptions                      alternativeDescriptions;
    pub authenticator_version: u64, // required unsigned long                       authenticatorVersion;
    pub protocol_family: String,    // required DOMString                           protocolFamily;
    pub schema: u8,                 // required unsigned short                      schema;
    pub upv: Vec<UnifiedProtocolVersion>, // required Version[]                           upv;
    pub authentication_algorithms: Vec<String>, // required DOMString[]                         authenticationAlgorithms;
    pub public_key_alg_and_encodings: Vec<String>, // required DOMString[]                         publicKeyAlgAndEncodings;
    pub attestation_types: Vec<String>, // required DOMString[]                         attestationTypes;
    pub user_verification_details: Vec<VerificationMethodANDCombinations>, // required VerificationMethodANDCombinations[] userVerificationDetails;
    pub key_protection: Vec<String>, // required DOMString[]                         keyProtection;
    pub is_key_restricted: Option<bool>, // boolean                                      isKeyRestricted;
    pub is_fresh_user_verification_required: Option<bool>, // boolean                                      isFreshUserVerificationRequired;
    pub matcher_protection: Vec<String>, // required DOMString[]                         matcherProtection;
    pub crypto_strength: Option<u16>, // unsigned short                               cryptoStrength;
    pub attachment_hint: Option<Vec<String>>, // DOMString[]                                  attachmentHint;
    pub tc_display: Vec<String>, // required DOMString[]                         tcDisplay;
    pub tc_display_content_type: Option<String>, // DOMString                                    tcDisplayContentType;
    #[serde(rename = "tcDisplayPNGCharacteristics")]
    pub tc_display_png_charicteristics: Option<Vec<DisplayPNGCharacteristicsDescriptor>>, // DisplayPNGCharacteristicsDescriptor[]        tcDisplayPNGCharacteristics;
    pub attestation_root_certificates: Vec<String>, // required DOMString[]                         attestationRootCertificates;
    pub ecdaa_trust_anchors: Option<Vec<EcdaaTrustAnchor>>, // EcdaaTrustAnchor[]                           ecdaaTrustAnchors;
    pub icon: Option<String>, // DOMString                                    icon;
    pub supported_extensions: Option<Vec<ExtensionDescriptor>>, // ExtensionDescriptor[]                        supportedExtensions;
                                                                // AuthenticatorGetInfo                         authenticatorGetInfo;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BiometricStatusReport {
    pub cert_level: u16,                // required unsigned short certLevel;
    pub modality: String,               // required DOMString      modality;
    pub effective_date: Option<String>, // DOMString               effectiveDate;
    pub certification_descriptor: Option<String>, // DOMString               certificationDescriptor;
    pub certificate_number: Option<String>,       // DOMString               certificateNumber;
    pub certification_policy_version: Option<String>, // DOMString               certificationPolicyVersion;
    pub certification_requirements_version: Option<String>, // DOMString               certificationRequirementsVersion;
}

#[derive(Debug, Clone, Deserialize)]
pub enum AuthenticatorStatus {
    #[serde(rename = "NOT_FIDO_CERTIFIED")]
    NotFidoCertified,
    #[serde(rename = "FIDO_CERTIFIED")]
    FidoCertified,
    #[serde(rename = "USER_VERIFICATION_BYPASS")]
    UserVerificationBypass,
    #[serde(rename = "ATTESTATION_KEY_COMPROMISE")]
    AttestationKeyCompromise,
    #[serde(rename = "USER_KEY_REMOTE_COMPROMISE")]
    UserKeyRemoteCompromise,
    #[serde(rename = "USER_KEY_PHYSICAL_COMPROMISE")]
    UserKeyPhysicalCompromise,
    #[serde(rename = "UPDATE_AVAILABLE")]
    UpdateAvailable,
    #[serde(rename = "REVOKED")]
    Revoked,
    #[serde(rename = "SELF_ASSERTION_SUBMITTED")]
    SelfAssertionSubmitted,
    #[serde(rename = "FIDO_CERTIFIED_L1")]
    FidoCertifiedL1,
    #[serde(rename = "FIDO_CERTIFIED_L1plus")]
    FidoCertifiedL1Plus,
    #[serde(rename = "FIDO_CERTIFIED_L2")]
    FidoCertifiedL2,
    #[serde(rename = "FIDO_CERTIFIED_L2plus")]
    FidoCertifiedL2Plus,
    #[serde(rename = "FIDO_CERTIFIED_L3")]
    FidoCertifiedL3,
    #[serde(rename = "FIDO_CERTIFIED_L3plus")]
    FidoCertifiedL3Plus,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatusReport {
    pub status: AuthenticatorStatus, // required AuthenticatorStatus status;
    pub effective_date: Option<String>, // DOMString                    effectiveDate;
    pub authenticator_version: Option<u64>, //unsigned long                authenticatorVersion;
    pub certificate: Option<String>, // DOMString                    certificate;
    pub url: Option<String>,         // DOMString                    url;
    pub certification_descriptor: Option<String>, // DOMString               certificationDescriptor;
    pub certificate_number: Option<String>,       // DOMString               certificateNumber;
    pub certification_policy_version: Option<String>, // DOMString               certificationPolicyVersion;
    pub certification_requirements_version: Option<String>, // DOMString               certificationRequirementsVersion;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataBLOBPayloadEntry {
    pub aaid: Option<String>,   // AAID                    aaid;
    pub aaguid: Option<String>, // AAGUID                  aaguid;
    pub attestation_certificate_key_identifiers: Option<Vec<String>>, // DOMString[]             attestationCertificateKeyIdentifiers;
    pub metadata_statement: Option<MetadataStatement>, // MetadataStatement       metadataStatement;
    pub biometric_status_reports: Option<Vec<BiometricStatusReport>>, // BiometricStatusReport[] biometricStatusReports;
    pub status_reports: Vec<StatusReport>, // required StatusReport[] statusReports;
    pub time_of_last_status_change: String, // required DOMString      timeOfLastStatusChange;
    #[serde(rename = "rogueListURL")]
    pub rogue_list_url: Option<String>, // DOMString               rogueListURL;
    pub rogue_list_hash: Option<String>,   // DOMString               rogueListHash;
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MetadataBLOBPayload {
    pub legal_header: Option<String>, // DOMString                          legalHeader;
    pub no: u32,                      // required Number                    no;
    pub next_update: String,          //required DOMString                 nextUpdate;
    pub entries: Vec<MetadataBLOBPayloadEntry>, // required MetadataBLOBPayloadEntry[] entries;
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json;
    #[test]
    fn test_statement() {
        let json = include_bytes!("../metadata_statement.json");

        let result: MetadataStatement = serde_json::from_slice(json).expect("oops");
        dbg!(&result);
    }

    #[test]
    fn test_blob() {
        let json = include_bytes!("../blob.json");

        let result: MetadataBLOBPayloadEntry = serde_json::from_slice(json).expect("oops");
        dbg!(&result);
    }

    #[test]
    fn test_metadata() {
        let json = include_bytes!("../metadata.json");

        let result: MetadataBLOBPayload = serde_json::from_slice(json).expect("oops");
        dbg!(&result);
    }
}
