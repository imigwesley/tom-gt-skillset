const membersSample = [
  // future state
  // {
  //   name: 'Wesley Imig',
  //   email: ['wesley.imig@gatech.edu', 'wimig@gmail.com'],
  //   gtID: 903655085,
  //   teamMembership: ['Design'],
  //   teamsAdvising: ['Marketing'],
  //   role: 'president',
  //   isExec: true,
  //   moduleProgress: [
  //     { 
  //         moduleName: 'Kangaroos', 
  //         percentComplete: 59.6,
  //         isAssigned: true,
  //         subsectionsComplete: [
  //             'sharpen knife',
  //             'theory of grilling',
  //         ]
  //     }
  //   ]
  // },
    {
      gtID: '903655085',
      name: 'Wesley Imig',
      email: ['wesley.imiggatec', 'wimig@gmail.com', 'imig.wa03@gmail.com'],
      teamMembership: ['Design'],
      teamsAdvising: ['Marketing'],
      role: 'president',
      isExec: true,
      moduleProgress: [
        { 
            moduleName: 'Kangaroos', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'sharpen knife',
                'theory of grilling',
            ]
        }
      ]
    },
    // people can be on multiple teams
    // TODO
    {
      gtID: '903655086',
      name: 'Sarah Lee',
      email: ['sarah.lee@gatech.edu', 'slee12@gmail.com'],
      teamMembership: ['Development'],
      teamsAdvising: ['Outreach'],
      role: 'vice president',
      isExec: true,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903655087',
      name: 'John Doe',
      email: ['john.doe@gatech.edu', 'johndoe123@gmail.com'],
      teamMembership: ['Engineering'],
      teamsAdvising: ['CAD'],
      role: 'treasurer',
      isExec: true,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903655088',
      name: 'Emily Clark',
      email: ['emily.clark@gatech.edu', 'emclark456@gmail.com'],
      teamMembership: ['Marketing'],
      teamsAdvising: ['Operations'],
      role: 'secretary',
      isExec: true,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903655089',
      name: 'Jake Miller',
      email: ['jake.miller@gatech.edu', 'jakemill678@gmail.com'],
      teamMembership: ['CAD'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903655090',
      name: 'Jessica Green',
      email: ['jessica.green@gatech.edu', 'greenjessica@gmail.com'],
      teamMembership: ['Operations'],
      teamsAdvising: ['CAD'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '913655084',
      name: 'David Kim',
      email: ['david.kim@gatech.edu', 'davidk789@gmail.com'],
      teamMembership: ['Engineering'],
      teamsAdvising: ['Design'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '923655084',
      name: 'Laura Adams',
      email: ['laura.adams@gatech.edu', 'ladams234@gmail.com'],
      teamMembership: ['Design'],
      teamsAdvising: ['Marketing'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '933655084',
      name: 'Michael Scott',
      email: ['michael.scott@gatech.edu', 'mscott999@gmail.com'],
      teamMembership: ['Marketing'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '943655084',
      name: 'Olivia White',
      email: ['olivia.white@gatech.edu', 'owhite123@gmail.com'],
      teamMembership: ['Operations'],
      teamsAdvising: ['Engineering'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '953655084',
      name: 'Ethan Brown',
      email: ['ethan.brown@gatech.edu', 'ebrown444@gmail.com'],
      teamMembership: ['Engineering'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '963655084',
      name: 'Isabella Turner',
      email: ['isabella.turner@gatech.edu', 'iturner789@gmail.com'],
      teamMembership: ['CAD'],
      teamsAdvising: ['Operations'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '973655084',
      name: 'Daniel Martin',
      email: ['daniel.martin@gatech.edu', 'dmartin765@gmail.com'],
      teamMembership: ['Design'],
      teamsAdvising: ['CAD'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '983655084',
      name: 'Sophia Walker',
      email: ['sophia.walker@gatech.edu', 'swalker123@gmail.com'],
      teamMembership: ['Marketing'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '993655084',
      name: 'James Evans',
      email: ['james.evans@gatech.edu', 'jevans000@gmail.com'],
      teamMembership: ['Operations'],
      teamsAdvising: ['Design'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '904655084',
      name: 'Ava Harris',
      email: ['ava.harris@gatech.edu', 'aharris222@gmail.com'],
      teamMembership: ['Engineering'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '905655084',
      name: 'Logan Young',
      email: ['logan.young@gatech.edu', 'lyoung789@gmail.com'],
      teamMembership: ['CAD'],
      teamsAdvising: ['Engineering'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
        gtID: '906655084',
      name: 'Amy Brooks',
      email: ['amy.brooks@gatech.edu', 'abrooks999@gmail.com'],
      teamMembership: ['Design'],
      teamsAdvising: ['Marketing'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '907655084',
      name: 'Henry Foster',
      email: ['henry.foster@gatech.edu', 'hfoster333@gmail.com'],
      teamMembership: ['Marketing'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '908655084',
      name: 'Lily Richardson',
      email: ['lily.richardson@gatech.edu', 'lrichardson555@gmail.com'],
      teamMembership: ['Operations'],
      teamsAdvising: ['Engineering'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '909655084',
      name: 'Jack Murphy',
      email: ['jack.murphy@gatech.edu', 'jmurphy111@gmail.com'],
      teamMembership: ['Engineering'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903755084',
      name: 'Grace Hill',
      email: ['grace.hill@gatech.edu', 'ghill666@gmail.com'],
      teamMembership: ['CAD'],
      teamsAdvising: ['Operations'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903855084',
      name: 'Noah King',
      email: ['noah.king@gatech.edu', 'nking777@gmail.com'],
      teamMembership: ['Design'],
      teamsAdvising: ['Marketing'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    },
    {
      gtID: '903955084',
      name: 'Harper Lewis',
      email: ['harper.lewis@gatech.edu', 'hlewis888@gmail.com'],
      teamMembership: ['Marketing'],
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { 
            moduleName: '3D Printing', 
            percentComplete: 59.6,
            isAssigned: true,
            subsectionsComplete: [
                'Kookaburra watching',
                'Learn to catch a crikey',
                'Explore Queensland'
            ]
        }
      ]
    }
];

export default membersSample;
  