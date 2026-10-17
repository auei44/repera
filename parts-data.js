// Catalog compatibility is separate from diagnosing which part has failed.
const PARTS_CATALOG = {
    miele_classic_c1_sban0: {
        reviewed: '2026-10-17',
        source: {title: 'Miele SBAN0 Turbo Team: matching accessories', url: 'https://www.mieleusa.com/product/11181010/canister-vacuum-cleaners-classic-c1-turbo-team-powerline-sban0-tech-blue'},
        scope: 'Manufacturer lists these for Classic C1. Confirm SBAN0 and the installed filter/floorhead with Miele. Filters have different holders; do not stack exhaust filter types. Compatibility does not establish a failed part or the need to buy one. Check current regional availability.',
        parts: [
            {name:'GN HyClean Air bags, four pack', number:'12618920', url:'https://www.mieleusa.com/product/12618920/4-vacuum-bags-gn-hyclean-air'},
            {name:'SF-SAC 20/30 AirClean filter', number:'03944711', url:'https://www.mieleusa.com/product/3944711/airclean-filter-sf-sac-20-30'}
        ]
    },
    irobot_roomba_600_legacy: {
    "reviewed": "2026-10-15",
    "source": {
        "title": "iRobot AeroVac filter 3-pack",
        "url": "https://www.irobot.com/en_US/filter,-3-pack-for-roomba-600-and-500-series/4636450.html"
    },
    "scope": "US listing for original 600 Series robots with an AeroVac bin. Confirm the bin type; not Plus 600. Listed unavailable when reviewed. Do not apply this part to the 560 flow.",
    "parts": [
        {
            "name": "iRobot AeroVac filter 3-pack",
            "number": "4636450",
            "url": "https://www.irobot.com/en_US/filter,-3-pack-for-roomba-600-and-500-series/4636450.html"
        }
    ]
},
    irobot_roomba_700_legacy: {
    "reviewed": "2026-10-15",
    "source": {
        "title": "iRobot original 700 Series filter 3-pack",
        "url": "https://www.irobot.com/en_US/roomba-700-series-filter-3-pack/4503461.html"
    },
    "scope": "US listing for the original 700 Series, not Max 700 or Combo models. Listed unavailable when reviewed.",
    "parts": [
        {
            "name": "iRobot original 700 Series filter 3-pack",
            "number": "4503461",
            "url": "https://www.irobot.com/en_US/roomba-700-series-filter-3-pack/4503461.html"
        }
    ]
},
    irobot_roomba_800_legacy: {
    "reviewed": "2026-10-15",
    "source": {
        "title": "iRobot original 800 / 900 Series high-efficiency filter 3-pack",
        "url": "https://www.irobot.com/en_US/high-efficiency-filter,-3-pack-for-roomba-800-and-900-series/4636433.html"
    },
    "scope": "US listing explicitly covers original 800 and 900 Series. Confirm your exact model and current availability; newer Max models are not included.",
    "parts": [
            {"name": "Original 800 / 900 Series rubber brush pair", "number": "4636423", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-800-and-900-series/4636423.html", "source": {"title": "iRobot Original 800 / 900 Series rubber brush pair: manufacturer compatibility", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-800-and-900-series/4636423.html"}},
        {
            "name": "iRobot original 800 / 900 Series high-efficiency filter 3-pack",
            "number": "4636433",
            "url": "https://www.irobot.com/en_US/high-efficiency-filter,-3-pack-for-roomba-800-and-900-series/4636433.html"
        }
    ]
},
    irobot_roomba_900: {
    "reviewed": "2026-10-15",
    "source": {
        "title": "iRobot original 800 / 900 Series high-efficiency filter 3-pack",
        "url": "https://www.irobot.com/en_US/high-efficiency-filter,-3-pack-for-roomba-800-and-900-series/4636433.html"
    },
    "scope": "US listing explicitly covers original 800 and 900 Series. Confirm your exact model and current availability; newer Max models are not included.",
    "parts": [
            {"name": "Original 800 / 900 Series rubber brush pair", "number": "4636423", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-800-and-900-series/4636423.html", "source": {"title": "iRobot Original 800 / 900 Series rubber brush pair: manufacturer compatibility", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-800-and-900-series/4636423.html"}},
        {
            "name": "iRobot original 800 / 900 Series high-efficiency filter 3-pack",
            "number": "4636433",
            "url": "https://www.irobot.com/en_US/high-efficiency-filter,-3-pack-for-roomba-800-and-900-series/4636433.html"
        }
    ]
},
    irobot_roomba_s9: {
    "reviewed": "2026-10-15",
    "source": {
        "title": "iRobot s Series high-efficiency filter",
        "url": "https://www.irobot.com/en_US/high-efficiency-filter-for-roomba-s-series/4650995.html"
    },
    "scope": "US listing for s Series robots only. Confirm your exact model and current availability with iRobot.",
    "parts": [
            {"name": "s Series rubber brush pair", "number": "4646490", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-s-series/4646490.html", "source": {"title": "iRobot s Series rubber brush pair: manufacturer compatibility", "url": "https://www.irobot.com/en_US/dual-multi-surface-rubber-brushes-for-roomba-s-series/4646490.html"}},
        {
            "name": "iRobot s Series high-efficiency filter",
            "number": "4650995",
            "url": "https://www.irobot.com/en_US/high-efficiency-filter-for-roomba-s-series/4650995.html"
        }
    ]
},
    dirtdevil_spider: {
        "reviewed": "2026-10-15",
        "source": {
            "title": "Dirt Devil M607 manufacturer manual: printed French page 77 (archived copy)",
            "url": "https://www.aspirateur-robot.info/wp-content/uploads/2017/09/notice-dirt-devil-m607.pdf"
        },
        "scope": "Historical M607 manual references, not verified current stock or a direct purchase offer. Ask the Dirt Devil parts service or a qualified dealer to confirm the exact model suffix and current replacement before ordering. Electrical parts are excluded.",
        "parts": [
            {
                "name": "Side-brush pair",
                "number": "0606001",
                "url": "https://myhomeparts.de/Dirt-Devil-Allgemein/",
                "lookup": true,
                "linkLabel": "Ask the Dirt Devil parts service about availability"
            },
            {
                "name": "Filter",
                "number": "0606002",
                "url": "https://myhomeparts.de/Dirt-Devil-Allgemein/",
                "lookup": true,
                "linkLabel": "Ask the Dirt Devil parts service about availability"
            }
        ]
    },
    dirtdevil_tracker_m613: {
        "reviewed": "2026-10-15",
        "source": {
            "title": "Dirt Devil M613 manufacturer manual: printed French page 77 (archived copy)",
            "url": "https://fc.darty.com/notices/b/8/9/7/b8978baaf009152949e45e090e7d547198637130.pdf"
        },
        "scope": "Historical M613 manual references, not verified current stock or a direct purchase offer. Ask the Dirt Devil parts service or a qualified dealer to confirm the exact model suffix and current replacement before ordering. Electrical parts are excluded.",
        "parts": [
            {
                "name": "Side-brush pair",
                "number": "0610011",
                "url": "https://myhomeparts.de/Dirt-Devil-Allgemein/",
                "lookup": true,
                "linkLabel": "Ask the Dirt Devil parts service about availability"
            },
            {
                "name": "Filter",
                "number": "0610012",
                "url": "https://myhomeparts.de/Dirt-Devil-Allgemein/",
                "lookup": true,
                "linkLabel": "Ask the Dirt Devil parts service about availability"
            }
        ]
    },
    severin_chill: {
        reviewed: '2026-10-15',
        source: {title: 'SEVERIN 7025 official spare-parts catalog', url: 'https://shop.severin.com/shop/article/1544?q=7025'},
        scope: 'Exact 7025 catalog. Confirm RB7025 on your label, current stock and delivery region with SEVERIN. These listings do not establish a failed part or authorize electrical repairs.',
        parts: [
            {name: 'Dust container without filter', number: '4400048', url: 'https://shop.severin.com/shop/article/1544?q=7025', linkLabel: 'View official parts catalog'},
            {name: 'Round brushes, set of four', number: '6232048', url: 'https://shop.severin.com/shop/article/1544?q=7025', linkLabel: 'View official parts catalog'},
            {name: 'Cleaning set with filter and brush', number: '5248048', url: 'https://shop.severin.com/shop/article/1544?q=7025', linkLabel: 'View official parts catalog'}
        ]
    },
    dyson_v8_animal_sv10: {
        reviewed: '2026-10-14',
        source: {title: 'Dyson pre-filter 965661-01: compatible machines', url: 'https://www.dyson.co.uk/support/journey/spare-details.965661-01'},
        scope: 'UK listing explicitly includes V8 Animal. Confirm your serial number and filter shape with Dyson; batteries and motor assemblies are not covered here.',
        parts: [{name: 'Pre-filter', number: '965661-01', url: 'https://www.dyson.co.uk/support/journey/spare-details.965661-01'}]
    },
    eufy_robovac_11s: {
        reviewed: '2026-10-14',
        source: {title: 'eufy replacement kit: 11S and 30C compatibility', url: 'https://www.eufy.com/us/products/t29090n1'},
        scope: 'US manufacturer kit explicitly fits 11S and 30C, not Max variants. Includes side brushes, high-performance and foam filters, and a rolling brush. The reviewed page does not publish a separate part number.',
        parts: [{name: 'RoboVac 11S / 30C replacement kit', url: 'https://www.eufy.com/us/products/t29090n1'}]
    },
    medion_md_17225: {
        reviewed: '2026-10-14',
        source: {title: 'MEDION MD 17225 filter set: article 50057305', url: 'https://www.medion.com/de/shop/p/haushalt-zubehoer-medion-filter-set-fuer-den-saugroboter-mit-lasernavigation-md-17225-50057305A1'},
        scope: 'German manufacturer listing explicitly names MD 17225. Filter and filter frame included. Confirm stock and delivery region with MEDION.',
        parts: [{name: 'Filter set', number: '50057305', url: 'https://www.medion.com/de/shop/p/haushalt-zubehoer-medion-filter-set-fuer-den-saugroboter-mit-lasernavigation-md-17225-50057305A1'}]
    },
    vorwerk_kobold_vr100: {
        reviewed: '2026-10-14',
        source: {title: 'Vorwerk VR100 filter: exact compatibility', url: 'https://www.vorwerk.com/at/de/s/shop/kobold-filter-vr100'},
        scope: 'Official Austrian store lists the VR100 filter by name without a numeric part number. This store delivers within Austria; ask local Vorwerk support about other regions.',
        parts: [{name: 'Kobold VR100 filter', url: 'https://www.vorwerk.com/at/de/s/shop/kobold-filter-vr100'}]
    },
    xiaomi_s10: {
        reviewed: '2026-10-14',
        source: {title: 'Xiaomi Robot Vacuum S10: official accessories', url: 'https://www.mi.com/sg/product/xiaomi-robot-vacuum-s10-accessories/'},
        scope: 'Singapore manufacturer catalog names these S10 brushes. Exact ordering numbers and local stock still need Xiaomi confirmation. S10+ filter and cover headings on that page are not used as S10 compatibility evidence.',
        parts: [
            {name: 'Xiaomi Robot Vacuum S10 main brush', url: 'https://www.mi.com/sg/product/xiaomi-robot-vacuum-s10-accessories/', linkLabel: 'View official accessory catalog'},
            {name: 'Xiaomi Robot Vacuum S10 side brush', url: 'https://www.mi.com/sg/product/xiaomi-robot-vacuum-s10-accessories/', linkLabel: 'View official accessory catalog'}
        ]
    },
    ecovacs_deebot_dx9g: {
        reviewed: '2026-10-14',
        source: {title: 'ECOVACS DX5G-KTA: OZMO 950 (DX9G) compatibility', url: 'https://www.ecovacs.com/jp/shop/accessories/accesorry-buddy-kit'},
        scope: 'The Japanese manufacturer store explicitly includes OZMO 950 (DX9G). Kit contains a main brush, side brushes and filters. Confirm regional ordering with ECOVACS.',
        parts: [{name: 'OZMO 950 accessory kit', number: 'DX5G-KTA', url: 'https://www.ecovacs.com/jp/shop/accessories/accesorry-buddy-kit'}]
    },
    roborock_s502_00: {
        reviewed: '2026-10-14',
        source: {title: 'Roborock S5 washable filter: official compatibility', url: 'https://us.roborock.com/products/washable-filter-2x-for-s6-series-s5-series-s4-series-and-e-series'},
        scope: 'US listings include S5. S502-00 is within the S5 suffix scope in the linked manual. Numbers shown are manufacturer store SKUs, not a diagnosis or approval for internal repairs.',
        parts: [
            {name: 'Washable filters, 2 pack', number: 'RR-Wfilter-01', url: 'https://us.roborock.com/products/washable-filter-2x-for-s6-series-s5-series-s4-series-and-e-series'},
            {name: 'White side brushes, 2 pack', number: 'RR-BS0-Q80MaxPlus-M2', url: 'https://us.roborock.com/products/side-brush-2pcs-white-for-all-roborock-cleaners', source: {title: 'Roborock side brushes: S5 compatibility', url: 'https://us.roborock.com/products/side-brush-2pcs-white-for-all-roborock-cleaners'}}
        ]
    },
    bissell_2191: {
        reviewed: '2026-10-10',
        source: {title: 'BISSELL PowerForce Helix 2191: Parts & Accessories', url: 'https://www.bissell.com/s/bissell/product/powerforce-helix-bagless-upright-vacuum-2191.html'},
        scope: 'Listed by BISSELL for model 2191. Confirm your label and current compatibility before ordering.',
        parts: [
            {name: 'Pre-motor filter', number: '1608225', url: 'https://www.bissell.com/en-us/product/premotor-filter-for-select-upright-vacuums-1608225.html'},
            {name: 'Style 9 drive belt, 2 pack', number: '32074', url: 'https://www.bissell.com/en-us/product/style-9-drive-belt-2-pack-32074.html'},
            {name: 'Hose assembly', number: '2038074', url: 'https://www.bissell.com/en-us/product/hose-assembly-for-powerforce-helix-bagless-vacuums-2038074.html'},
            {name: 'Brush roll', number: '2038072', url: 'https://www.bissell.com/en-us/product/brush-roll-for-powerforce-upright-vacuums-2038072.html'}
        ]
    },
    bissell_2252: {
        reviewed: '2026-10-10',
        source: {title: 'BISSELL filter 12141: compatible products', url: 'https://www.bissell.com/s/bissell/product/febreze-pre-motor-filter-for-select-upright-vacuums-12141.html'},
        scope: 'BISSELL lists 2252 in the compatible CleanView Swivel Pet group. Other replacement parts are still being verified.',
        parts: [{name: 'Febreze pre-motor filter', number: '12141', url: 'https://www.bissell.com/s/bissell/product/febreze-pre-motor-filter-for-select-upright-vacuums-12141.html'}]
    },
    blackdecker_hhvi315jo42: {
        reviewed: '2026-10-10',
        source: {title: 'BLACK+DECKER HHVI315JO42: Specs & Parts', url: 'https://www.blackanddecker.com/products/hhvi315jo42'},
        scope: 'The product specification names VF110FC. Confirm your model/type and the current orderable part with BLACK+DECKER; a direct purchase listing has not been verified.',
        parts: [{name: 'Replacement filter', number: 'VF110FC', lookup: true, url: 'https://support.blackanddecker.com/hc/en-us/articles/360012617477-What-is-the-filter-number-for-my-Dustbuster-and-where-can-I-purchase-them'}]
    }
};

PARTS_CATALOG.eufy_robovac_30c = PARTS_CATALOG.eufy_robovac_11s;
