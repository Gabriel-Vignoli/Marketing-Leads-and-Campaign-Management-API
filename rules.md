In our application, it is important to ensure that the lead lifecycle is properly respected, so we will implement the following rules:

Leads must be created with the status 'New' unless a different status is explicitly provided.

A lead with the status 'New' must be contacted, having its status changed to 'Contacted', before receiving any other status.

In order to be archived, meaning having the status changed to 'Archived', the lead must have received the last update at least 6 months ago.