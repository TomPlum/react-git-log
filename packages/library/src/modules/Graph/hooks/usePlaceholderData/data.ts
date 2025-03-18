import { Commit } from 'modules/Visualiser'
import { GraphColumnState } from 'modules/Graph/components/GraphColumn'

export const commits: Commit[] = [
  {
    hash: 'aa2c148',
    refs: '',
    committerDate: '2025-02-24T22:06:22+00:00',
    authorDate: '2025-02-22 22:06:22 +0000',
    message: '',
    parents: [
      'afdb263'
    ],
    branch: 'refs/remotes/origin/gh-pages',
    children: [
      '30ee0ba'
    ],
    isBranchTip: false
  },
  {
    hash: '515eaa9',
    refs: '',
    committerDate: '2025-02-24T22:05:44+00:00',
    authorDate: '2025-02-22 22:05:44 +0000',
    message: '',
    parents: [
      '88a3ca2',
      '575887a'
    ],
    branch: 'refs/tags/v2.3.1',
    children: [
      '7355361'
    ],
    isBranchTip: false
  },
  {
    hash: '88a3ca2',
    refs: '',
    committerDate: '2025-02-24T22:05:23+00:00',
    authorDate: '2025-02-22 22:05:23 +0000',
    message: '',
    parents: [
      'fd93615',
      '932be3a'
    ],
    branch: 'refs/tags/v2.3.1',
    children: [
      '515eaa9'
    ],
    isBranchTip: false
  },
  {
    hash: 'fd93615',
    refs: '',
    committerDate: '2025-02-24T22:05:07+00:00',
    authorDate: '2025-02-22 22:05:07 +0000',
    message: '',
    parents: [
      '3d4d017',
      'f687c53'
    ],
    branch: 'refs/tags/v2.3.1',
    children: [
      '88a3ca2'
    ],
    isBranchTip: false
  },
  {
    hash: '5510915',
    refs: '',
    committerDate: '2025-02-24T21:52:51+00:00',
    authorDate: '2025-02-22 21:52:51 +0000',
    message: 'chore(data): No git log entries to show...',
    parents: [
      '202237c'
    ],
    branch: 'refs/heads/develop',
    children: [
      'f4ef8e9'
    ],
    isBranchTip: false
  },
  {
    hash: '202237c',
    refs: '',
    committerDate: '2025-02-24T21:51:17+00:00',
    authorDate: '2025-02-22 21:51:17 +0000',
    message: '',
    parents: [
      '4be118d'
    ],
    branch: 'refs/heads/develop',
    children: [
      '5510915'
    ],
    isBranchTip: false
  },
  {
    hash: 'f687c53',
    refs: '',
    committerDate: '2025-02-24T07:05:41+00:00',
    authorDate: '2025-02-22 07:05:41 +0000',
    message: '',
    parents: [
      '3d4d017'
    ],
    branch: 'refs/tags/v2.3.1',
    children: [
      'fd93615'
    ],
    isBranchTip: false
  },
  {
    hash: '575887a',
    refs: '',
    committerDate: '2025-02-24T02:47:35+00:00',
    authorDate: '2025-02-22 02:47:35 +0000',
    message: '',
    parents: [
      '3d4d017'
    ],
    branch: 'refs/tags/v2.3.1',
    children: [
      '515eaa9'
    ],
    isBranchTip: false
  },
  {
    hash: '932be3a',
    refs: '',
    committerDate: '2025-02-24T02:47:25+00:00',
    authorDate: '2025-02-22 02:47:25 +0000',
    message: '',
    parents: [
      '3d4d017'
    ],
    branch: 'refs/tags/v2.3.1',
    children: [
      '88a3ca2'
    ],
    isBranchTip: false
  },
  {
    hash: '4be118d',
    refs: '',
    committerDate: '2025-02-21T21:06:34+00:00',
    authorDate: '2025-02-19 21:06:34 +0000',
    message: '',
    parents: [
      'a338942'
    ],
    branch: 'refs/heads/develop',
    children: [
      '202237c'
    ],
    isBranchTip: false
  }
]

export const columns: Array<GraphColumnState[]> = [
  [
    {
      isVerticalLine: true
    },
    {},
    {
      isVerticalLine: true,
      isNode: true
    },
    {
      isVerticalLine: true
    },
    {},
    {},
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true
    },
    {},
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true,
      isNode: true
    },
    {},
    {},
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [4],
      isNode: true
    },
    {
      isHorizontalLine: true,
      mergeSourceColumns: [4]
    },
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [4]
    },
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [4]
    },
    {
      isLeftDownCurve: true
    },
    {},
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [5],
      isNode: true
    },
    {
      isHorizontalLine: true,
      mergeSourceColumns: [5]
    },
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [5]
    },
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [5]
    },
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [5]
    },
    {
      isLeftDownCurve: true
    },
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true,
      isHorizontalLine: true,
      mergeSourceColumns: [1],
      isNode: true
    },
    {
      isLeftDownCurve: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true,
      isNode: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true,
      isNode: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true,
      isNode: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true,
      isNode: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    }
  ],
  [
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true
    },
    {
      isVerticalLine: true,
      isNode: true
    },
    {
      isVerticalLine: true
    }
  ]
]