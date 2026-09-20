/**
 * New Max Aqua — Filtration Vessels Shared Pricing & Layout Script
 * 
 * Single shared data source for both Desktop Comparison Table and
 * Mobile Product Cards to ensure prices and specifications never drift.
 */

(function () {
    'use strict';

    // 1. SHARED VESSEL PRODUCTS
    // Temporary Image Mapping: Sediment uses Activated Carbon existing image
    var VESSEL_PRODUCTS = [
        {
            key: 'sediment',
            name: 'Sediment',
            description: 'Traps sand, silt & particles',
            image: 'assets/img/Aqua/Assets/bluefilters/CARBON%20VESSEL.png', // Temporary: reuses Activated Carbon image
            alt: 'Sediment Water Filtration Vessel'
        },
        {
            key: 'carbon',
            name: 'Carbon',
            description: 'Removes chlorine & odour',
            image: 'assets/img/Aqua/Assets/bluefilters/CARBON%20VESSEL.png',
            alt: 'Activated Carbon Water Filtration Vessel for Chlorine and Odour Removal'
        },
        {
            key: 'ironRemoval',
            name: 'Iron Removal',
            description: 'Stops stains & corrosion',
            image: 'assets/img/Aqua/Assets/bluefilters/IRON%20REMOVEL%20VESSEL.png',
            alt: 'Iron Removal Vessel'
        },
        {
            key: 'multimedia',
            name: 'Multimedia',
            description: 'Clear, sediment-free water',
            image: 'assets/img/Aqua/Assets/bluefilters/MULTI-MEDIA%20VESSEL.png',
            alt: 'Multi-Media Vessel'
        },
        {
            key: 'softener',
            name: 'Softener',
            description: 'Soft water, no scaling',
            image: 'assets/img/Aqua/Assets/bluefilters/SOFTENER%20VESSEL.png',
            alt: 'Softener Vessel'
        }
    ];

    // 2. SHARED PRICING DATA (Single Source of Truth)
    var VESSEL_PRICING = [
        {
            size: '8×44',
            capacity: '250–300 Ltr',
            prices: {
                sediment: 12000,
                carbon: 13000,
                ironRemoval: 15000,
                multimedia: 15000,
                softener: 15000
            }
        },
        {
            size: '10×54',
            capacity: '300–500 Ltr',
            prices: {
                sediment: 14000,
                carbon: 16000,
                ironRemoval: 16000,
                multimedia: 18000,
                softener: 18000
            }
        },
        {
            size: '12×48',
            capacity: '500–750 Ltr',
            prices: {
                sediment: 16000,
                carbon: 18000,
                ironRemoval: 18000,
                multimedia: 19000,
                softener: 19000
            }
        },
        {
            size: '13×54',
            capacity: '750–1000 Ltr',
            prices: {
                sediment: 18000,
                carbon: 22000,
                ironRemoval: 22000,
                multimedia: 24000,
                softener: 24000
            }
        },
        {
            size: '14×65',
            capacity: '1000–1500 Ltr',
            prices: {
                sediment: 20000,
                carbon: 25000,
                ironRemoval: 25000,
                multimedia: 28000,
                softener: 28000
            }
        }
    ];

    // Expose globally for verification and console inspection
    window.VESSEL_PRODUCTS = VESSEL_PRODUCTS;
    window.VESSEL_PRICING = VESSEL_PRICING;

    // Helper: format price with Indian Rupee symbol and commas
    function formatPrice(amount) {
        return '₹' + Number(amount).toLocaleString('en-IN');
    }

    // Render Desktop Comparison Table
    function renderDesktopTable(container) {
        if (!container) return;

        var html = '<div class="vessel-table-card">' +
            '<div class="table-responsive">' +
            '<table class="vessel-pricing-table">' +
            '<thead>' +
            '<tr>' +
            '<th scope="col" class="vessel-col-specs-th">' +
            '<div class="vessel-product-col-card vessel-specs-col-card">' +
            '<div class="vessel-product-thumb vessel-specs-thumb">' +
            '<div class="vessel-specs-thumb-inner">' +
            '<span class="vessel-specs-icon-circle"><i class="fas fa-layer-group"></i></span>' +
            '<span class="vessel-specs-tag">All 5 Models</span>' +
            '</div>' +
            '</div>' +
            '<div class="vessel-product-pill vessel-specs-pill">' +
            'Size / Capacity' +
            '</div>' +
            '<span class="vessel-product-desc">5 standard capacities</span>' +
            '</div>' +
            '</th>';

        VESSEL_PRODUCTS.forEach(function (product) {
            html += '<th scope="col" class="vessel-col-product-th">' +
                '<div class="vessel-product-col-card">' +
                '<div class="vessel-product-thumb">' +
                '<img src="' + product.image + '" alt="' + product.alt + '">' +
                '</div>' +
                '<div class="vessel-product-pill">' +
                product.name +
                '</div>' +
                '<span class="vessel-product-desc">' + product.description + '</span>' +
                '</div>' +
                '</th>';
        });

        html += '</tr>' +
            '</thead>' +
            '<tbody>';

        VESSEL_PRICING.forEach(function (row) {
            html += '<tr>' +
                '<th scope="row" class="vessel-row-size-th">' +
                '<div class="vessel-size-cell-inner">' +
                '<span class="vessel-size-dims">' + row.size + '</span>' +
                '<span class="vessel-cap-tag">' + row.capacity + '</span>' +
                '</div>' +
                '</th>';

            VESSEL_PRODUCTS.forEach(function (product) {
                var price = row.prices[product.key];
                html += '<td class="vessel-price-td">' +
                    '<span class="vessel-price-val">' + formatPrice(price) + '</span>' +
                    '</td>';
            });

            html += '</tr>';
        });

        html += '</tbody>' +
            '<tfoot>' +
            '<tr class="vessel-table-tfoot-row">' +
            '<td class="vessel-tfoot-feature">' +
            '<div class="vessel-tfoot-feature-inner">' +
            '<i class="fas fa-shield-alt text-success me-1"></i>' +
            '<span>Includes Multi-port valve &amp; media</span>' +
            '</div>' +
            '</td>';

        VESSEL_PRODUCTS.forEach(function (product) {
            html += '<td class="vessel-tfoot-action-td">' +
                '<a href="https://wa.me/919747177283?text=Hi%2C%20I%20want%20to%20enquire%20about%20' + encodeURIComponent(product.name) + '%20Filtration%20Vessels" target="_blank" class="vessel-table-btn" rel="noopener noreferrer">' +
                '<i class="fab fa-whatsapp"></i> Enquire' +
                '</a>' +
                '</td>';
        });

        html += '</tr>' +
            '</tfoot>' +
            '</table>' +
            '</div>' +
            '<div class="vessel-table-footer-note">' +
            '<i class="fas fa-info-circle me-1"></i> Easy EMI options available through Bajaj Finserv. Custom sizing &amp; multi-vessel configurations configured based on your water test.' +
            '</div>' +
            '</div>';

        container.innerHTML = html;
    }

    // Render Mobile Cards Layout
    function renderMobileCards(container) {
        if (!container) return;

        var html = '<div class="row justify-content-center">';

        VESSEL_PRODUCTS.forEach(function (product) {
            html += '<div class="col-12 col-sm-10 col-md-6 mb-35">' +
                '<div class="team-item vessel-card">' +
                '<div class="team-thumb">' +
                '<img src="' + product.image + '" alt="' + product.alt + '">' +
                '</div>' +
                '<div class="team-content">' +
                '<h3 class="title">' + product.name + '</h3>' +
                '<span>' + product.description + '</span>' +
                '</div>' +
                '<div class="vessel-mobile-pricing-box">' +
                '<div class="vessel-mobile-pricing-head">' +
                '<span class="vessel-m-head-col"><i class="fas fa-ruler-combined me-1"></i> Vessel Size / Capacity</span>' +
                '<span class="vessel-m-head-col text-end">Price</span>' +
                '</div>' +
                '<div class="vessel-mobile-pricing-list">';

            VESSEL_PRICING.forEach(function (row) {
                var price = row.prices[product.key];
                html += '<div class="vessel-mobile-price-row">' +
                    '<div class="vessel-mobile-size-wrap">' +
                    '<span class="vessel-mobile-size-dim">' + row.size + '</span>' +
                    '<span class="vessel-mobile-size-cap">(' + row.capacity + ')</span>' +
                    '</div>' +
                    '<div class="vessel-mobile-price-wrap">' +
                    '<span class="vessel-mobile-price-val">' + formatPrice(price) + '</span>' +
                    '</div>' +
                    '</div>';
            });

            html += '</div>' +
                '<div class="vessel-mobile-card-action">' +
                '<a href="https://wa.me/919747177283?text=Hi%2C%20I%20want%20to%20enquire%20about%20' + encodeURIComponent(product.name) + '%20Vessel" class="btn vessel-mobile-enquiry-btn" target="_blank" rel="noopener noreferrer">' +
                '<i class="fab fa-whatsapp"></i> Enquiry / Buy' +
                '</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Initialize Vessels Component
    function initVessels() {
        var desktopContainer = document.getElementById('vessels-desktop-wrap');
        var mobileContainer = document.getElementById('vessels-mobile-wrap');

        if (desktopContainer) {
            renderDesktopTable(desktopContainer);
        }
        if (mobileContainer) {
            renderMobileCards(mobileContainer);
        }
    }

    if (document.getElementById('vessels-desktop-wrap')) {
        initVessels();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVessels);
    } else {
        initVessels();
    }
})();
