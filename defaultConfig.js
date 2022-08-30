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