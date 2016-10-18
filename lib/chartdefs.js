ChartDefs = {
    colors: [
        '#4661EE',
        '#EC5657',
        '#1BCDD1',
        '#8FAABB',
        '#B08BEB',
        '#3EA0DD',
        '#F5A52A',
        '#23BFAA',
        '#FAA586',
        '#EB8CC6'
    ],
    fabLed: [{
        id: 'chart1',
        title: 'LED ITO Mesa Patterning',
        ytitle: 'Resist thickness',
        yname: 'ito_mesa_patterning',
        // ymax: 8,
        // ymin: 5,
        yfields: ['resist_thickness']
    }, {
        id: 'chart2',
        title: 'ITO Wet Etch',
        ytitle: 'Duration',
        yname: 'ito_wet_etch',
        // ymax: 8,
        // ymin: 2,
        yfields: ['duration_ito']
    }, {
        id: 'chart3',
        title: 'Mesa etch PR strip 1',
        ytitle: 'Total strip time',
        yname: 'mesa_etch_pr_strip',
        // ymax: 25,
        // ymin: 15,
        yfields: ['total_strip_time']
    }, {
        id: 'chart4',
        title: 'Mesa etch PR strip 2',
        ytitle: 'Mesa height',
        yname: 'mesa_etch_pr_strip',
        // ymax: 25,
        // ymin: 15,
        yfields: ['mesa_height_1', 'mesa_height_3']
    }, {
        id: 'chart5',
        title: 'Mesa etch PR strip 3',
        ytitle: 'ITO pad size',
        yname: 'mesa_etch_pr_strip',
        // ymax: 25,
        // ymin: 15,
        yfields: ['ito_pad_size_min', 'ito_pad_size_max']
    }, {
        id: 'chart6',
        title: 'Post anneal 1',
        ytitle: 'Witness sheet resistance',
        yname: 'post_anneal',
        // ymax: 25,
        // ymin: 15,
        yfields: ['witness_sheet_resistance']
    }, {
        id: 'chart7',
        title: 'Post anneal 2',
        ytitle: 'Optical loss',
        yname: 'post_anneal',
        // ymax: 25,
        // ymin: 15,
        yfields: ['Apsorbtion Loss']
    }, {
        id: 'chart8',
        title: 'LTO ALD deposition',
        ytitle: 'LTO Witness Thickness',
        yname: 'lto_ald_deposition',
        // ymax: 25,
        // ymin: 15,
        yfields: ['lto_witness_thickness']
    }, {
        id: 'chart9',
        title: 'LTO ALD Wet Etch',
        ytitle: 'Duration',
        yname: 'lto_ald_wet_etch',
        // ymax: 25,
        // ymin: 15,
        yfields: ['duration_ald']
    }, {
        id: 'chart10',
        title: 'LTO ALD PR Strip 1',
        ytitle: 'Total strip time',
        yname: 'lto_ald_pr_strip',
        // ymax: 25,
        // ymin: 15,
        yfields: ['total_pr_strip_time']
    }, {
        id: 'chart11',
        title: 'LTO ALD PR Strip 2',
        ytitle: 'LTO size opening',
        yname: 'lto_ald_pr_strip',
        // ymax: 25,
        // ymin: 15,
        yfields: ['lto_size_opening']
    }, {
        id: 'chart12',
        title: 'LTO ALD PR Strip 3',
        ytitle: 'LTO Opening missalignment',
        yname: 'lto_ald_pr_strip',
        // ymax: 25,
        // ymin: 15,
        yfields: ['lto_opening_missalignment']
    }, {
        id: 'chart13',
        title: 'Metal patterning',
        ytitle: 'Pattern depth',
        yname: 'metal_patterning',
        // ymax: 25,
        // ymin: 15,
        yfields: ['pattern_depth1', 'pattern_depth3']
    }, {
        id: 'chart14',
        title: 'Metal liftoff',
        ytitle: 'Resist total strip time',
        yname: 'metal_liftoff',
        // ymax: 25,
        // ymin: 15,
        yfields: ['resist_total_strip_time_liftoff']
    }, {
        id: 'chart15',
        title: 'Post Bond Pad inspection 1',
        ytitle: 'Number of defects',
        yname: 'post_bond_pad_inspection',
        ymin: 0,
        ymax: 700,
        yfields: ['pbdefects']
    }, {
        id: 'chart16',
        title: 'Post Bond Pad inspection 2',
        ytitle: 'Yield',
        yname: 'post_bond_pad_inspection',
        yfields: ['pbyield']
    }, {
        id: 'chart17',
        title: 'Isolation patterning',
        ytitle: 'Resist thickness',
        yname: 'isolation_patterning',
        yfields: ['resist_thickness_center', 'resist_thickness_OD']
    }, {
        id: 'chart18',
        title: 'Post Isolation Bond Pad inspection 1',
        ytitle: 'Number of defects',
        ymin: 0,
        ymax: 700,
        yname: 'post_isolation_bond_pad_inspection',
        yfields: ['pibdefects']
    }, {
        id: 'chart19',
        title: 'Post Isolation Bond Pad inspection 2',
        ytitle: 'Yield',
        yname: 'post_isolation_bond_pad_inspection',
        yfields: ['pibyield']
    }],

    fabLedPerWafer: [
        {
            id: 'chart20',
            title: 'Post Bond Pad inspection 1 per Wafer',
            ytitle: 'Number of defects',
            yname: 'post_bond_pad_inspection',
            ymin: 0,
            ymax: 700,
            yfields: ['pbdefects']
        }, {
            id: 'chart21',
            title: 'Post Bond Pad inspection 2  per Wafer',
            ytitle: 'Yield',
            yname: 'post_bond_pad_inspection',
            yfields: ['pbyield']
        }, {
            id: 'chart22',
            title: 'Post Isolation Bond Pad inspection 1 per Wafer',
            ytitle: 'Number of defects',
            ymin: 0,
            ymax: 700,
            yname: 'post_isolation_bond_pad_inspection',
            yfields: ['pibdefects']
        }, {
            id: 'chart23',
            title: 'Post Isolation Bond Pad inspection 2 per Wafer',
            ytitle: 'Yield',
            yname: 'post_isolation_bond_pad_inspection',
            yfields: ['pibyield']
    }],

    fabJasper: [{
        id: 'chart1',
        title: 'Jasper metal patterning 1',
        ytitle: 'pattern depth',
        yname: 'metal_patterning_1',
        // ymax: 8,
        // ymin: 5,
        yfields: ['pattern_depth_1']
    }, {
        id: 'chart2',
        title: 'Jasper metal liftoff 1',
        ytitle: 'Resist strip total duration',
        yname: 'metal_liftoff_1',
        // ymax: 8,
        // ymin: 5,
        yfields: ['liftoff1_resist_strip_total_duration']
    }, {
        id: 'chart3',
        title: 'Jasper metal patterning 2',
        ytitle: 'pattern depth',
        yname: 'metal_patterning_2',
        // ymax: 8,
        // ymin: 5,
        yfields: ['pattern_depth_2']
    }, {
        id: 'chart4',
        title: 'Jasper metal liftoff 2',
        ytitle: 'Resist strip total duration',
        yname: 'metal_liftoff_2',
        // ymax: 8,
        // ymin: 5,
        yfields: ['liftoff2_resist_strip_total_duration']
    }]
};