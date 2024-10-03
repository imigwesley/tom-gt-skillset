const members = [
    {
      name: 'Matthew Hall',
      email: ['matthew.hall@gatech.edu', 'matthall@gmail.com'],
      teamMembership: 'Design',
      teamsAdvising: ['Marketing'],
      role: 'president',
      isExec: true,
      moduleProgress: [
        { moduleName: 'CAD', percentComplete: 90.5 }
      ]
    },
    {
      name: 'Sarah Lee',
      email: ['sarah.lee@gatech.edu', 'slee12@gmail.com'],
      teamMembership: 'Development',
      teamsAdvising: ['Outreach'],
      role: 'vice president',
      isExec: true,
      moduleProgress: [
        { moduleName: 'Programming', percentComplete: 85.3 }
      ]
    },
    {
      name: 'John Doe',
      email: ['john.doe@gatech.edu', 'johndoe123@gmail.com'],
      teamMembership: 'Engineering',
      teamsAdvising: ['CAD'],
      role: 'treasurer',
      isExec: true,
      moduleProgress: [
        { moduleName: 'Engineering Basics', percentComplete: 72.4 }
      ]
    },
    {
      name: 'Emily Clark',
      email: ['emily.clark@gatech.edu', 'emclark456@gmail.com'],
      teamMembership: 'Marketing',
      teamsAdvising: ['Operations'],
      role: 'secretary',
      isExec: true,
      moduleProgress: [
        { moduleName: 'Marketing Strategy', percentComplete: 88.1 }
      ]
    },
    {
      name: 'Jake Miller',
      email: ['jake.miller@gatech.edu', 'jakemill678@gmail.com'],
      teamMembership: 'CAD',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: '3D Modeling', percentComplete: 45.7 }
      ]
    },
    {
      name: 'Jessica Green',
      email: ['jessica.green@gatech.edu', 'greenjessica@gmail.com'],
      teamMembership: 'Operations',
      teamsAdvising: ['CAD'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Operations Management', percentComplete: 50.9 }
      ]
    },
    {
      name: 'David Kim',
      email: ['david.kim@gatech.edu', 'davidk789@gmail.com'],
      teamMembership: 'Engineering',
      teamsAdvising: ['Design'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Mechanical Engineering', percentComplete: 78.2 }
      ]
    },
    {
      name: 'Laura Adams',
      email: ['laura.adams@gatech.edu', 'ladams234@gmail.com'],
      teamMembership: 'Design',
      teamsAdvising: ['Marketing'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Graphic Design', percentComplete: 62.3 }
      ]
    },
    {
      name: 'Michael Scott',
      email: ['michael.scott@gatech.edu', 'mscott999@gmail.com'],
      teamMembership: 'Marketing',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'SEO Fundamentals', percentComplete: 35.5 }
      ]
    },
    {
      name: 'Olivia White',
      email: ['olivia.white@gatech.edu', 'owhite123@gmail.com'],
      teamMembership: 'Operations',
      teamsAdvising: ['Engineering'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Project Management', percentComplete: 92.4 }
      ]
    },
    {
      name: 'Ethan Brown',
      email: ['ethan.brown@gatech.edu', 'ebrown444@gmail.com'],
      teamMembership: 'Engineering',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Thermodynamics', percentComplete: 68.9 }
      ]
    },
    {
      name: 'Isabella Turner',
      email: ['isabella.turner@gatech.edu', 'iturner789@gmail.com'],
      teamMembership: 'CAD',
      teamsAdvising: ['Operations'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Advanced CAD', percentComplete: 81.7 }
      ]
    },
    {
      name: 'Daniel Martin',
      email: ['daniel.martin@gatech.edu', 'dmartin765@gmail.com'],
      teamMembership: 'Design',
      teamsAdvising: ['CAD'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'UI/UX Design', percentComplete: 53.2 }
      ]
    },
    {
      name: 'Sophia Walker',
      email: ['sophia.walker@gatech.edu', 'swalker123@gmail.com'],
      teamMembership: 'Marketing',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Digital Marketing', percentComplete: 40.1 }
      ]
    },
    {
      name: 'James Evans',
      email: ['james.evans@gatech.edu', 'jevans000@gmail.com'],
      teamMembership: 'Operations',
      teamsAdvising: ['Design'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Operations Strategy', percentComplete: 77.9 }
      ]
    },
    {
      name: 'Ava Harris',
      email: ['ava.harris@gatech.edu', 'aharris222@gmail.com'],
      teamMembership: 'Engineering',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Electrical Engineering', percentComplete: 65.3 }
      ]
    },
    {
      name: 'Logan Young',
      email: ['logan.young@gatech.edu', 'lyoung789@gmail.com'],
      teamMembership: 'CAD',
      teamsAdvising: ['Engineering'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: '3D Printing', percentComplete: 59.6 }
      ]
    },
    {
      name: 'Amy Brooks',
      email: ['amy.brooks@gatech.edu', 'abrooks999@gmail.com'],
      teamMembership: 'Design',
      teamsAdvising: ['Marketing'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Product Design', percentComplete: 85.4 }
      ]
    },
    {
      name: 'Henry Foster',
      email: ['henry.foster@gatech.edu', 'hfoster333@gmail.com'],
      teamMembership: 'Marketing',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Content Creation', percentComplete: 70.8 }
      ]
    },
    {
      name: 'Lily Richardson',
      email: ['lily.richardson@gatech.edu', 'lrichardson555@gmail.com'],
      teamMembership: 'Operations',
      teamsAdvising: ['Engineering'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Risk Management', percentComplete: 88.6 }
      ]
    },
    {
      name: 'Jack Murphy',
      email: ['jack.murphy@gatech.edu', 'jmurphy111@gmail.com'],
      teamMembership: 'Engineering',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Structural Engineering', percentComplete: 56.7 }
      ]
    },
    {
      name: 'Grace Hill',
      email: ['grace.hill@gatech.edu', 'ghill666@gmail.com'],
      teamMembership: 'CAD',
      teamsAdvising: ['Operations'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'SolidWorks', percentComplete: 63.4 }
      ]
    },
    {
      name: 'Noah King',
      email: ['noah.king@gatech.edu', 'nking777@gmail.com'],
      teamMembership: 'Design',
      teamsAdvising: ['Marketing'],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Brand Design', percentComplete: 54.9 }
      ]
    },
    {
      name: 'Harper Lewis',
      email: ['harper.lewis@gatech.edu', 'hlewis888@gmail.com'],
      teamMembership: 'Marketing',
      teamsAdvising: [],
      role: 'member',
      isExec: false,
      moduleProgress: [
        { moduleName: 'Email Marketing', percentComplete: 65.3}
      ]
    }
];

export default members;
  