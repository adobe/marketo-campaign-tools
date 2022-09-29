/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const defaultConfig = {
    "Delimiter": "_",
    "ReplacePattern": {
        "pattern": "\\s",
        "symbol": "-"
    },
    "CampaignDetails": {
        "name": "",
        "Inputs": {
            "campaignDate": {
                "label": "Campaign Date",
                "placeholder": "Input Type",
                "index": 1,
                "type": "date",
                "subs": {},
                "value": "2022-06-08T03:13:26.892Z"
            },
            "campaignType": {
                "label": "Campaign Type",
                "placeholder": "Input Type",
                "index": 2,
                "type": "input",
                "subs": {}
            },
            "campaignDetails": {
                "label": "Campaign Details",
                "placeholder": "Details",
                "index": 3,
                "type": "input",
                "subs": {}
            }
        }
    },
    "UrlBuilder": {
        "entries": {
            "1": {
                "index": 1,
                "url": "",
                "values": {
                    "baseUrl": ""
                }
            }
        },
        "prefix": "utm_",
        "inputs": {
            "baseUrl": {
                "label": "Base URL",
                "type": "input",
                "index": 0
            } 
        }
    }
}

module.exports = defaultConfig;