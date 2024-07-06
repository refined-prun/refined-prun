var transmitted_events = {
  "ACTION_COMPLETED": {
    "action": "subprocess_payload",
    'req_admin': false,
    "payload_events": {
      'DATA_DATA': {
        'action': 'process_by_path',
        'req_admin': false,
        "paths": [
          {"count": 2, "matches": {"0": "planets"}, "req_admin": false, 'action': 'send_payload', 'suburl': "/planet"}, // PLANET_DATA_DATA
          {
            "count": 3,
            "matches": {"0": "planets", "2": "sites"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/planet/sites"
          }, // PLANET_SITES
          {
            "count": 2,
            "matches": {"0": "stations"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/exchange/station"
          }, // STATION_DATA
          {
            "count": 1,
            "matches": {"0": "commodityexchanges"},
            "req_admin": true,
            'action': 'send_payload',
            'suburl': "/global/comexexchanges"
          }, // COMEX_EXCHANGE_LIST
          // TODO: Validate that this entry for INFRASTRUCTURE PROJECTS is correct.
          {
            "count": 2,
            "matches": {"0": "projects"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/infrastructure/project"
          }, // INFRASTRUCTURE_PROJECTS_DATA
          {
            "count": 2,
            "matches": {"0": "populations"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/infrastructure"
          }, // INFRASTRUCTURE_DATA_DATA
          {
            "count": 2,
            "matches": {"0": "admincenters"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/infrastructure/programs"
          }, // INFRASTRUCTURE_PROGRAMS_DATA
          {"count": 3, "matches": {"2": "ads"}, "req_admin": false, 'action': 'send_payload', 'suburl': "/localmarket"}, // LOCAL_MARKET_DATA_DATA
          {
            "count": 4,
            "matches": {"2": "cogc"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/planet/cogc"
          }, // PLANET_COGC_DATA
          {
            "count": 2,
            "matches": {"0": "systems"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/systemstars/star"
          }, // STAR_DATA
          {
            "count": 2,
            "matches": {"0": "users"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/user/users"
          }, // USER_DATA_USERS
          {
            "count": 2,
            "matches": {"0": "companies"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/user/companies"
          }, // USER_DATA_COMPANIES
          {
            "count": 3,
            "matches": {"0": "companies", "2": "offices"},
            "req_admin": false,
            'action': 'send_payload',
            'suburl': "/user/offices"
          }, // USER_DATA_OFFICES
        ]
      },
      'COMPANY_DATA': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/user/company_data'
      },
      'COMEX_BROKER_DATA': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/exchange'
      },
      'COMEX_BROKER_PRICES': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/exchange/cxpc'
      },
      'SHIP_SHIPS': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/ship/ships'
      },
      'SHIP_FLIGHT_FLIGHTS': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/ship/flights'
      },
      'SITE_SITES': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/sites'
      },
      'STORAGE_STORAGES': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/storage'
      },
      'WAREHOUSE_STORAGES': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/sites/warehouses'
      },
      'PRODUCTION_SITE_PRODUCTION_LINES': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/production'
      },
      'WORKFORCE_WORKFORCES': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/workforce'
      },
      'CHANNEL_DATA': {
        'action': 'process_chat_special',
        'req_admin': false,
        'suburl': '/chat/data',
        'group_regex_match': [
          // These are regex pieces, so plan accordingly.
          // They get shoved into a matching string:
          // /(val1|val2|val3|...)/i
          ".* Global Site Owners$",
        ]
      },
      "CHANNEL_MESSAGE_ADDED": {
        // this version is for self-added messages.
        'action': 'send_chat_if',
        'req_admin': false,
        'suburl': '/chat/message_added_self'
      },
      'CHANNEL_MESSAGE_LIST': {
        'action': 'send_chat_if',
        'req_admin': false,
        'suburl': '/chat/message_list'
      },
      'CONTRACTS_CONTRACTS': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/contract'
      },
      'COMEX_TRADER_ORDERS': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/cxos'
      },
      'COMEX_TRADER_ORDER_REMOVED': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/cxos/removed'
      },
      'FOREX_CURRENCY_PAIRS': {
        'action': 'send_payload',
        'req_admin': false,
        'suburl': '/currency'
      },
      // Everything below is "admin only:
      'SYSTEM_STARS_DATA': {
        'action': 'send_payload',
        'req_admin': true,
        'suburl': '/systemstars'
      },
      'WORLD_SECTORS': {
        'action': 'send_payload',
        'req_admin': true,
        'suburl': '/systemstars/worldsectors'
      },
      'COUNTRY_REGISTRY_COUNTRIES': {
        'action': 'send_payload',
        'req_admin': true,
        'suburl': '/global/countries'
      },
      'SIMULATION_DATA': {
        'action': 'send_payload',
        'req_admin': true,
        'suburl': '/global/simulationdata'
      },
      'WORLD_MATERIAL_CATEGORIES': {
        'action': 'send_payload',
        'req_admin': true,
        'suburl': '/material'
      },
      'WORLD_REACTOR_DATA': {
        'action': 'send_payload',
        'req_admin': true,
        'suburl': '/building'
      },
    },
  },
  "PRODUCTION_PRODUCTION_LINE_UPDATED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/production/lineupdated'
  },
  "PRODUCTION_PRODUCTION_LINE_REMOVED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/production/lineremoved'
  },
  "PRODUCTION_ORDER_ADDED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/production/orderadded'
  },
  "PRODUCTION_ORDER_UPDATED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/production/orderupdated'
  },
  "PRODUCTION_ORDER_REMOVED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/production/orderremoved'
  },
  "WORKFORCE_WORKFORCES_UPDATED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/workforce/updated'
  },
  "SITE_PLATFORM_BUILT": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/sites/built'
  },
  "SITE_SECTION_DEMOLISH": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/sites/demolish'
  },
  "STORAGE_CHANGE": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/storage/change'
  },
  "CHANNEL_MESSAGE_ADDED": {
    'action': 'send_chat_if',
    'req_admin': false,
    'suburl': '/chat/message_added'
  },
  "CHANNEL_MESSAGE_DELETED": {
    'action': 'send_chat_if',
    'req_admin': false,
    'suburl': '/chat/message_deleted'
  },
  "CHANNEL_USER_JOINED": {
    'action': 'send_chat_if',
    'req_admin': false,
    'suburl': '/chat/user_joined'
  },
  "CHANNEL_USER_LEFT": {
    'action': 'send_chat_if',
    'req_admin': false,
    'suburl': '/chat/user_left'
  },
  "CONTRACTS_CONTRACT": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/contract/change'
  },
  "COMEX_TRADER_ORDER_UPDATED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/cxos/updated'
  },
  "COMEX_TRADER_ORDER_ADDED": {
    'action': 'send_payload',
    'req_admin': false,
    'suburl': '/cxos/added'
  },
};
