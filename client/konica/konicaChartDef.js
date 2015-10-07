chartDefs = [{
    title: 'Intensity (Nits]',
    tabs: [{
      t: 'iLGP 13 points',
      y: 'avg_13pt',
      x: 'build_date',
      r: [4000.0, 12000.0],
      q: { dtype:'iLGP' }
    }, {
      t: 'iBLU 13 points',
      y: 'avg_13pt',
      x: 'build_date',
      r: [4000.0, 12000.0],
      q: { dtype:'iBLU' }
    }, {
      t: 'iLGP 69 points',
      y: 'avg_69pt',
      x: 'build_date',
      r: [4000.0, 12000.0],
      q: { dtype:'iLGP' }
    }, {
      t: 'iBLU 69 points',
      y: 'avg_69pt',
      x: 'build_date',
      r: [4000.0, 12000.0],
      q: { dtype:'iBLU' }
    }, {
      t: 'iLGP 135 points',
      y: 'avg_135pt',
      x: 'build_date',
      r: [4000.0, 12000.0],
      q: { dtype:'iLGP' }
    }, {
      t: 'iBLU 135 points',
      y: 'avg_135pt',
      x: 'build_date',
      r: [4000.0, 12000.0],
      q: { dtype:'iBLU' }
    }]
  }, {
    title: 'Uniformity [%]',
    tabs: [{
      t: 'iLGP 13 points',
      y: 'unif_13pt',
      x: 'build_date',
      q: { dtype:'iLGP' }
    },{
      t: 'iBLU 13 points',
      y: 'unif_13pt',
      x: 'build_date',
      q: { dtype:'iBLU' }
    }, {
      t: 'iLGP 69 points',
      y: 'unif_69pt',
      x: 'build_date',
      q: { dtype:'iLGP' }
    }, {
      t: 'iBLU 69 points',
      y: 'unif_69pt',
      x: 'build_date',
      q: { dtype:'iBLU' }
    }, {
      t: 'iLGP 135 points',
      y: 'unif_135pt',
      x: 'build_date',
      q: { dtype:'iLGP' }
    }, {
      t: 'iBLU 135 points',
      y: 'unif_135pt',
      x: 'build_date',
      q: { dtype:'iBLU' }
    }]
  }, {
    title: 'Color shift',
    tabs: [{
      t: 'Arbitrary 135 points',
      y: 'csarb_135pt',
      x: 'build_date',
      r: [0.0001, 0.04]
    }, {
      t: 'Adjacent 135 points',
      y: 'csadj_135pt',
      x: 'build_date',
      r: [0.0001, 0.04]
    }]
  }, {
    title: 'Pull force',
    tabs: [{
      t: 'Pull force [kg]',
      y: 'pull_force_kg',
      x: 'build_date',
      r: [0.0, 5.0]
    }]
  }, {
    title: 'Bondline thickness',
    tabs: [{
      t: 'Epoxy Thickness Tail',
      y: 'epoxy_thickness_tail',
      x: 'build_date',
      r: [20.0, 200.0]
    }, {
      t: 'Epoxy Thickness Center',
      y: 'epoxy_thickness_center',
      x: 'build_date',
      r: [20.0, 200.0]
    }, {
      t: 'Epoxy Thickness Non Tail',
      y: 'epoxy_thickness_non_tail',
      x: 'build_date',
      r: [20.0, 200.0]
    }]
  }, {
    title: 'LGP and LP offsets',
    tabs: [{
      t: 'Offset Tail',
      y: 'offset_tail',
      x: 'build_date',
      r: [0.0, 150.0]
    }, {
      t: 'Offset Non Tail',
      y: 'offset_non_tail',
      x: 'build_date',
      r: [0.0, 150.0]
    }]
  }
  // , {
  //   title: '13 points',
  //   tabs: [{
  //     t: 'Mechanical Parameters',
  //     y: ['epoxy_thickness_tail', 'epoxy_thickness_center', 'epoxy_thickness_non_tail', 'offset_tail', 'offset_non_tail'],
  //     x: 'avg_13pt',
  //     r: [0.0, 200.0]
  //   }, {
  //     t: 'Mechanical Parameters pull force',
  //     y: ['pull_force_kg'],
  //     x: 'avg_13pt',
  //     r: [0.0, 5.0]
  //   }]
  // }

];
