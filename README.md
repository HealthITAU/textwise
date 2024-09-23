
[![Health IT Logo](https://healthit.com.au/wp-content/uploads/2019/06/HIT-proper-logo.png)](https://healthit.com.au)

# TextWise - An SMS messaging and authentication pod for ConnectWise Manage (PSA) and Nilear

TextWise is an SMS messaging and authentication pod for ConnectWise Manage (PSA) and Nilear. It provides an integration for sending SMS messages and performing authentication directly from within tickets.

We've developed TextWise and have been using it internally for a while, and have now open-sourced it for the benefit of the community. We find it's perfect for authenticating unknown users, or for sending sensitive information to a ticket's contact.

Care has been taken to ensure that TextWise works in both platforms, and has been styled to fit in with the rest of the ConnectWise Manage (PSA) user interface to provide a seamless experience.

# Features
- Supports SMSBroadcast and Twilio
- Send SMS messages or authentication codes directly to a ticket's contact
- Authenticate ticket contacts with randomly generated 4 digit codes
- Optional configuration for:
	- Cooldown timers on messages to prevent misuse
- Supports both ConnectWise Manage (PSA) and Nilear MTX

# Screenshots
![TextWise Screenshot](https://healthit.com.au/textwise_ss.png)
  
# Documentation
The application uses the following environment variables:

## ConnectWise Variables
| Variable | Required | Description | Expected Shape | Default |
|--|--|--|--|--|
|CW_CLIENT_ID|**true**  |Your ConnectWise Developer Client ID|string
|CW_CODE_BASE|**false**|Your ConnectWise instance codebase - in most cases, this is "v4_6_release", and defaults to this. You can provide this variable to override the default if necessary|string|v4_6_release
|CW_COMPANY_URL|**true**|The URL for your ConnectWise instance, used for API calls|string|

## SMS Provider Variables
| Variable | Required | Description | Expected Shape | Default |
|--|--|--|--|--|
|SMS_PROVIDER|**false**|The SMS provider to use. Currently only supports Twilio or SmsBroadcast|**twilio** or **smsbroadcast**|**smsbroadcast**
|SMSBROADCAST_USERNAME|**true** if **SMS_PROVDER** is set to **smsbroadcast**|Your SmsBroadcast username|string
|SMSBROADCAST_PASSWORD|**true** if **SMS_PROVDER** is set to **smsbroadcast**|Your SmsBroadcast password|string
|SMSBROADCAST_FROM|**true** if **SMS_PROVDER** is set to **smsbroadcast**|The from label for your messages|string
|TWILIO_AUTH_TOKEN|**true** if **SMS_PROVDER** is set to **twilio**|Your Twilio auth token|string
|TWILIO_ACCOUNT_SID|**true** if **SMS_PROVDER** is set to **twilio**|Your Twilio account SID|string
|TWILIO_PHONE_NUMBER|**true** if **SMS_PROVDER** is set to **twilio**|The phone number to use for sending|string

## Optional Config Variables
| Variable | Required | Description | Expected Shape | Default |
|--|--|--|--|--|
|NEXT_PUBLIC_ENABLE_COOLDOWNS|**false**|Enables a cooldown timer on sending messages to prevent misuse, accidental double-clicks, etc.|**true** or **false**|**true**
|NEXT_PUBLIC_COOLDOWN_TIMER|**false**|How long the cooldown should be (in seconds)|number|30
|SMS_AUTH_MSG|**false**|The template to use for authentication messages. Can be changed to whatever you like, as long as it includes the `{code}` token|string containing `{code}`|Hi! Your auth code is {code}.

# Usage
This is a **NextJS** application and is provided as-is. It's up to you to build and serve it on whichever platform you'd like. We use **bun** as our package manager - the below instructions can be adapted to whichever package manager you'd prefer (npm, pnpm, yarn)

## To clone
`git clone https://github.com/HealthITAU/textwise.git `

## To install dependencies
`bun install`

## Run dev
`bun dev`

## Build
`bun build`

# Pod Setup
1. Navigate to **System** > **Setup Tables** > **Manage Hosted API** in ConnectWise Manage
2. Create a new entry with the **+** button
3. Configure as follows:
	- **Description** should be *TextWise* (or whatever you'd prefer)
	- **Screen** must be *Service Ticket*
	- **Origin** must be *
	- **URL** must be set to the URL where you're hosting the pod - for example, https://mywebsite.com/pod?id=[cw_id]&screen=[cw_screen] 
		- It is **essential** you include `?id=[cw_id]&screen=[cw_screen]` after the URL. The pod will not work unless you do so.
	- Out of **Tab** or **Pod**, select **Pod**
	- Set **Pod Height** to whatever you like - we think **256** looks great!
	- Optionally enable **Location Restrictions**

# Contributing
Contributions to the project are welcome. If you find any issues or have suggestions for improvement, please feel free to open an issue or submit a pull request.

# Supporting the project
:heart: the project and would like to show your support? Please consider donating to the following charities:
- [Black Dog](https://donate.blackdoginstitute.org.au/)
- [Cure4 CysticFibrosis Foundation](https://app.etapestry.com/onlineforms/Cure4CFFoundation/Donatenow.html)
- [Vinnies CEO Sleepout](https://www.ceosleepout.org.au/donation)
- [Care.org.au's Ukraine Humanitarian Crisis fund](https://www.care.org.au/appeals/ukraine-humanitarian-crisis/)
- [RedFrogs Australia](https://redfrogs.com.au/support/donate)
- [Love Your Sister (Sam's 1000)](https://www.loveyoursister.org/makeadonation)