// 警告: このファイルは検証/教育目的のみで、実際のプロジェクトでは絶対に使用しないでください
// これらのシークレットは全て偽のものですが、形式は本物と同じです

// GitHub Secret Scanningで検知されるシークレットの例
const config = {
  // AWS
  aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
  aws_secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  
  // GitHub
  github_token: 'ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789',
  
  // Stripe API Key
  stripe_api_key: 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
  
  // Azure API Key
  azure_api_key: '8a7b5cde3f2g1h6ij4k5lm7n8o9pqrs0t1u2v3w4x',
  
  // Slack Webhook
  slack_webhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
  
  // Private Key (PEM形式)
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBj08sp5++4anG
cmQxJjAkBgNVBAoTHUNvbnRvc28gQ2VydGlmaWNhdGUgQXV0aG9yaXR5MB4XDTEy
MDUwNDAyMTIyMloXDTIyMDUwNDAyMjIyMlowgZIxCzAJBgNVBAYTAlVTMRMwEQYD
VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
b3NvZnQgQ29ycG9yYXRpb24xDTALBgNVBAsTBFRlc3QxDTALBgNVBAMTBFRlc3Qx
JDAiBgkqhkiG9w0BCQEWFXRlc3RAbWljcm9zb2Z0LmNvbQIQV6YU8GY7BxLMjNGF
Yd7+kDANBgkqhkiG9w0BAQUFAAeCAQChqFYa7u1r
-----END PRIVATE KEY-----`,
  
  // GitHub Code scanningで検出されない独自のパスワード
  custom_password: 'P@ssw0rd123!',
  admin_credentials: {
    username: 'admin_user',
    password: 'SuperSecretAdmin2023'
  },
  database_connection: {
    host: 'localhost',
    port: 5432,
    user: 'db_user',
    password: 'Db$Password456'
  }
};

// 脆弱性: シークレットを直接エクスポート
export default config;

// 脆弱性: シークレットを使用する関数
export function authenticateWithAWS() {
  return {
    accessKeyId: config.aws_access_key,
    secretAccessKey: config.aws_secret_key
  };
}

export function makeStripePayment(amount) {
  console.log(`支払い処理中: ${amount}円 - API Key: ${config.stripe_api_key}`);
}

// 環境変数として設定すべきシークレット（誤った方法）
window.ENV = {
  GITHUB_TOKEN: config.github_token,
  AZURE_API_KEY: config.azure_api_key,
  ADMIN_PASSWORD: config.admin_credentials.password
};