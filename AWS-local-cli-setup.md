# Configure AWS SSO

➜  module-mgr git:(main) aws configure sso
SSO session name (Recommended): amplify-admin
SSO start URL [None]: https://d-91671cd973.awsapps.com/start
SSO region [None]: us-west-1
SSO registration scopes [sso:account:access]:
Attempting to automatically open the SSO authorization page in your default browser.
If the browser does not open or you wish to use a different device to authorize this request, open the following URL:

https://oidc.us-west-1.amazonaws.com/authorize?response_type=code&client_id=HLBiBaOlGIggssZTbw7pOXVzLXdlc3QtMQ&redirect_uri=http%3A%2F%2F127.0.0.1%3A60895%2Foauth%2Fcallback&state=3a483907-42c5-4f8f-b22a-7932123612d2&code_challenge_method=S256&scopes=sso%3Aaccount%3Aaccess&code_challenge=PFfE8xvGVi-d-9FeuD_cUN_IoAdx1_Quo2Uf31eYNNU
The only AWS account available to you is: 864899855920
Using the account ID 864899855920
The only role available to you is: amplify-policy
Using the role name "amplify-policy"
CLI default client Region [us-west-1]:
CLI default output format [None]:
CLI profile name [amplify-policy-864899855920]: default

To use this profile, specify the profile name using --profile, as shown:

aws s3 ls --profile default

# List S3 data

➜  module-mgr git:(main) aws s3 ls --profile default
2025-01-24 15:12:11 amplify-d2h5jciat66rkz-ma-amplifydataamplifycodege-1sxevf1ex5mx
2025-01-18 23:00:38 amplify-modulemanager-dpk-amplifydataamplifycodege-wm9od1erav4j
2025-01-18 23:00:38 amplify-modulemanager-dpk-amplifynotesdrivebucket1-9z68emvszeij
2025-01-18 23:00:38 amplify-modulemanager-dpk-modelintrospectionschema-pgtfpi2j83kz
2025-01-20 21:16:55 amplify-modulemgr-dvkelly-amplifydataamplifycodege-8hamxli6ijlh
2025-01-18 22:54:15 amplify-notesapp-dvkelly--amplifydataamplifycodege-ijkhob3u4sme
2025-01-18 22:54:14 amplify-notesapp-dvkelly--amplifynotesdrivebucket1-lourmgjjdy8p
2025-01-18 22:54:15 amplify-notesapp-dvkelly--modelintrospectionschema-0ov64zfjqkdk
2025-01-18 19:31:27 cdk-hnb659fds-assets-864899855920-us-west-1
2025-01-18 22:05:04 cdk-hnb659fds-assets-864899855920-us-west-2

# See AWS config

➜  module-mgr git:(main) ✗ cat ~/.aws/config 
[default]
region = us-west-1
sso_session = amplify-admin
sso_account_id = 864899855920
sso_role_name = amplify-policy
[sso-session amplify-admin]
sso_start_url = https://d-91671cd973.awsapps.com/start
sso_region = us-west-1
sso_registration_scopes = sso:account:access

