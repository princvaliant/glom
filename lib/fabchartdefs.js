FabChartDefs = {
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
        title: 'Resist thickness at MESA patterning (um)',
        ymax: 8,
        ymin: 5,
        yfields: ['ito_mesa_patterning.resist_thickness']
        // seriesFilter: [{
        //     'mesa_etch.equipment': 'GLO ICP-1'
        // }, {
        //     'mesa_etch.equipment': 'GLO ICP-2'
        // }]
    }, {
        id: 'chart2',
        title: 'ITO wet etch duration (secs)',
        ymax: 350,
        ymin: 50,
        yfields: ['ito_wet_etch.duration_ito']
    }, {
        id: 'chart3',
        title: 'MESA strip time (mins)',
        ymax: 180,
        ymin: 30,
        yfields: ['mesa_etch_pr_strip.total_strip_time']
    }, {
        id: 'chart4',
        title: 'MESA height (um)',
        ymax: 4,
        ymin: 0,
        yfields: ['mesa_etch_pr_strip.mesa_height_1', 'mesa_etch_pr_strip.mesa_height_3']
    }, {
        id: 'chart5',
        title: 'ITO pad size (um)',
        // ymax: 25,
        // ymin: 15,
        yfields: ['mesa_etch_pr_strip.ito_pad_size_min', 'mesa_etch_pr_strip.ito_pad_size_max']
    }, {
        id: 'chart6',
        title: 'ITO witness sheet resistance (Ohms sq)',
        // ymax: 25,
        // ymin: 15,
        yfields: ['post_anneal.witness_sheet_resistance']
    }, {
        id: 'chart7',
        title: 'ITO optical loss (%)',
        ymax: 10,
        ymin: 0,
        yfields: ['post_anneal.Apsorbtion Loss']
    }, {
        id: 'chart8',
        title: 'Metal pattern depth (um)',
        ymax: 8,
        ymin: 6,
        yfields: ['metal_patterning.pattern_depth1', 'metal_patterning.pattern_depth3']
    }, {
        id: 'chart9',
        title: 'Metal total strip time (min)',
        // ymax: 25,
        // ymin: 15,
        yfields: ['metal_liftoff.resist_total_strip_time_liftoff']
    }, {
        id: 'chart10',
        title: 'Post bond pad metal defects',
        ymin: -1,
        ymax: 110,
        yfields: [
            'post_bond_pad_inspection.pbpdefects001',
            'post_bond_pad_inspection.pbpdefects002',
            'post_bond_pad_inspection.pbpdefects003',
            'post_bond_pad_inspection.pbpdefects004',
            'post_bond_pad_inspection.pbpdefects005',
            'post_bond_pad_inspection.pbpdefects006']
    }, {
        id: 'chart11',
        title: 'Post bond pad other defects',
        ymin: -1,
        ymax: 110,
        yfields: [
            'post_bond_pad_inspection.pbdefectsother001',
            'post_bond_pad_inspection.pbdefectsother002',
            'post_bond_pad_inspection.pbdefectsother003',
            'post_bond_pad_inspection.pbdefectsother004',
            'post_bond_pad_inspection.pbdefectsother005',
            'post_bond_pad_inspection.pbdefectsother006']
    }, {
        id: 'chart12',
        title: 'Post bond pad good coupons count',
        yfields: ['post_bond_pad_inspection.pbpyield']
    }, {
        id: 'chart13',
        title: 'Isolation resist thickness (um)',
        ymin: 10,
        ymax: 22,
        yfields: ['isolation_patterning.resist_thickness_center', 'isolation_patterning.resist_thickness_OD']
    }, {
        id: 'chart14',
        title: 'Post isolation bond pad defects',
        ymin: -1,
        ymax: 110,
        yfields: [
            'post_isolation_bond_pad_inspection.pibpdefects001',
            'post_isolation_bond_pad_inspection.pibpdefects002',
            'post_isolation_bond_pad_inspection.pibpdefects003',
            'post_isolation_bond_pad_inspection.pibpdefects004',
            'post_isolation_bond_pad_inspection.pibpdefects005',
            'post_isolation_bond_pad_inspection.pibpdefects006'
        ]
    },  {
        id: 'chart15',
        title: 'Post isolation bond pad good coupons count',
        yfields: [
            'post_isolation_bond_pad_inspection.pibpyield']
    }],

    fabLedAvgPerExperiment: [
        {
            id: 'chart16',
            title: 'Post bond pad metal average defects',
            ytitle: 'Average defects',
            yname: 'post_bond_pad_inspection',
            ymin: 0,
            ymax: 110,
            yfields: ['pbdefects']
        }, {
            id: 'chart17',
            title: 'Post bond pad metal average good coupons',
            ytitle: 'Average Yield',
            yname: 'post_bond_pad_inspection',
            yfields: ['pbyield']
        }, {
            id: 'chart18',
            title: 'Post isolation bond pad metal average defects',
            ytitle: 'Average defects',
            ymin: 0,
            ymax: 110,
            yname: 'post_isolation_bond_pad_inspection',
            yfields: ['pibdefects']
        }, {
            id: 'chart19',
            title: 'Post isolation bond pad metal average good coupons',
            ytitle: 'Average yield',
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