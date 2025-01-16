# PagerDuty Setup Instructions

To set up PagerDuty API access, follow these steps:

Head over to your PagerDuty main page.

On the Main page choose "Integrations" -> "App Registration"

[![](/docs/assets/setup/pagerduty-setup-01.png)](/docs/assets/setup/pagerduty-setup-01.png)

Inside that page, click on the "+ New App" button.

[![](/docs/assets/setup/pagerduty-setup-02.png)](/docs/assets/setup/pagerduty-setup-02.png)

Here, we fill out the Name and Description and choose "OAuth 2.0".

Then click on "-> Next" button.

[![](/docs/assets/setup/pagerduty-setup-03.png)](/docs/assets/setup/pagerduty-setup-03.png)

Here, we fill out the following fields:

* Choose __Scoped OAuth__
* __Redirect URL:__ you can copy this from the PagerDuty settings tab located in the admin drawer of Deskpro.
* Choose the next __Permission Scopes:__
  * __Incidents__ - Read, Write Access
  * __Priorities__ - Read Access
  * __Services__ - Read Access
  * __Users__ - Read Access

[![](/docs/assets/setup/pagerduty-setup-04.png)](/docs/assets/setup/pagerduty-setup-04.png)

Click on __"Register App"__ button.

[![](/docs/assets/setup/pagerduty-setup-05.png)](/docs/assets/setup/pagerduty-setup-05.png)

Additionally, please copy the "Client ID" and "Client Secret" for secure keeping.

Only thing left is to copy your PagerDuty URL and paste it in the PagerDuty Instance URL field, similar to the example below it.

[![](/docs/assets/setup/pagerduty-setup-06.png)](/docs/assets/setup/pagerduty-setup-06.png)

To configure who can see and use the Space app, head to the "Permissions" tab and select those users and/or groups you'd like to have access.

When you're happy, click "Install" and you're done.
