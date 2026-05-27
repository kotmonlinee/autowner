#!/bin/bash
cd /Users/amy.wang/autowner
python3 -c "
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

with open('.claude/gsc-key.json') as f:
    creds = service_account.Credentials.from_service_account_info(
        json.load(f), scopes=['https://www.googleapis.com/auth/webmasters.readonly'])

service = build('searchconsole', 'v1', credentials=creds)
end = datetime.now().strftime('%Y-%m-%d')
start = (datetime.now() - timedelta(days=28)).strftime('%Y-%m-%d')

resp = service.searchanalytics().query(
    siteUrl='sc-domain:www.autowner.com',
    body={
        'startDate': start, 'endDate': end,
        'dimensions': ['page'],
        'rowLimit': 50,
        'orderBy': [{'field': 'impressions', 'sortOrder': 'DESCENDING'}]
    }).execute()

print(f'Top pages by impressions ({start} to {end}):\n')
for row in resp.get('rows', []):
    page = row['keys'][0].replace('https://www.autowner.com', '')[:60]
    imp = row['impressions']
    clicks = row['clicks']
    ctr = f'{(clicks/imp*100):.1f}%' if imp > 0 else '0%'
    pos = f'{row[\"position\"]:.1f}'
    print(f'{ctr:>6} CTR | {imp:>5} imp | pos {pos:>4} | {page}')
"
