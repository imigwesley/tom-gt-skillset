const membersSample = [
  {
    "identifiers": {
      "userID": "903655085",
      "accountEmail": "wesley.imiggatec",
      "name": "Wesley Imig",
      "gtID": "903655085",
      "contactEmails": ["wesley.imiggatec", "wimig@gmail.com", "imig.wa03@gmail.com"]
    },
    "roles": {
      "role": "President",
      "isAdmin": true
    },
    "teams": {
      "teamMembership": ["Design"],
      "teamsAdvising": ["Marketing"]
    },
    "moduleProgress": [
      {
        "moduleName": "Kangaroos",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["sharpen knife", "theory of grilling"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "903655086",
      "accountEmail": "sarah.lee@gatech.edu",
      "name": "Sarah Lee",
      "gtID": "903655086",
      "contactEmails": ["sarah.lee@gatech.edu", "slee12@gmail.com"]
    },
    "roles": {
      "role": "Vice President",
      "isAdmin": true
    },
    "teams": {
      "teamMembership": ["Development"],
      "teamsAdvising": ["Outreach"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "903655087",
      "accountEmail": "john.doe@gatech.edu",
      "name": "John Doe",
      "gtID": "903655087",
      "contactEmails": ["john.doe@gatech.edu", "johndoe123@gmail.com"]
    },
    "roles": {
      "role": "Treasurer",
      "isAdmin": true
    },
    "teams": {
      "teamMembership": ["Engineering"],
      "teamsAdvising": ["CAD"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "903655088",
      "accountEmail": "emily.clark@gatech.edu",
      "name": "Emily Clark",
      "gtID": "903655088",
      "contactEmails": ["emily.clark@gatech.edu", "emclark456@gmail.com"]
    },
    "roles": {
      "role": "Secretary",
      "isAdmin": true
    },
    "teams": {
      "teamMembership": ["Marketing"],
      "teamsAdvising": ["Operations"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "903655089",
      "accountEmail": "jake.miller@gatech.edu",
      "name": "Jake Miller",
      "gtID": "903655089",
      "contactEmails": ["jake.miller@gatech.edu", "jakemill678@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["CAD"],
      "teamsAdvising": []
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "903655090",
      "accountEmail": "jessica.green@gatech.edu",
      "name": "Jessica Green",
      "gtID": "903655090",
      "contactEmails": ["jessica.green@gatech.edu", "greenjessica@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["Operations"],
      "teamsAdvising": ["CAD"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "913655084",
      "accountEmail": "david.kim@gatech.edu",
      "name": "David Kim",
      "gtID": "913655084",
      "contactEmails": ["david.kim@gatech.edu", "davidk789@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["Engineering"],
      "teamsAdvising": ["Design"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "923655084",
      "accountEmail": "laura.adams@gatech.edu",
      "name": "Laura Adams",
      "gtID": "923655084",
      "contactEmails": ["laura.adams@gatech.edu", "ladams234@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["Design"],
      "teamsAdvising": ["Marketing"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "933655084",
      "accountEmail": "michael.scott@gatech.edu",
      "name": "Michael Scott",
      "gtID": "933655084",
      "contactEmails": ["michael.scott@gatech.edu", "mscott999@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["Marketing"],
      "teamsAdvising": []
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "943655084",
      "accountEmail": "olivia.white@gatech.edu",
      "name": "Olivia White",
      "gtID": "943655084",
      "contactEmails": ["olivia.white@gatech.edu", "owhite123@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["Operations"],
      "teamsAdvising": ["Engineering"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "953655084",
      "accountEmail": "ethan.brown@gatech.edu",
      "name": "Ethan Brown",
      "gtID": "953655084",
      "contactEmails": ["ethan.brown@gatech.edu", "ebrown444@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["Engineering"],
      "teamsAdvising": []
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
  {
    "identifiers": {
      "userID": "963655084",
      "accountEmail": "jacob.morris@gatech.edu",
      "name": "Jacob Morris",
      "gtID": "963655084",
      "contactEmails": ["jacob.morris@gatech.edu", "jmorris111@gmail.com"]
    },
    "roles": {
      "role": "Member",
      "isAdmin": false
    },
    "teams": {
      "teamMembership": ["CAD"],
      "teamsAdvising": ["Design"]
    },
    "moduleProgress": [
      {
        "moduleName": "3D Printing",
        "percentComplete": 59.6,
        "isAssigned": true,
        "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
      }
    ]
  },
    {
      "identifiers": {
        "userID": "973655084",
        "accountEmail": "sophie.davis@gatech.edu",
        "name": "Sophie Davis",
        "gtID": "973655084",
        "contactEmails": ["sophie.davis@gatech.edu", "sophie.d@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Marketing"],
        "teamsAdvising": []
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "983655084",
        "accountEmail": "chris.johnson@gatech.edu",
        "name": "Chris Johnson",
        "gtID": "983655084",
        "contactEmails": ["chris.johnson@gatech.edu", "chrisjohndoe@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Operations"],
        "teamsAdvising": ["Marketing"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "993655084",
        "accountEmail": "brianna.smith@gatech.edu",
        "name": "Brianna Smith",
        "gtID": "993655084",
        "contactEmails": ["brianna.smith@gatech.edu", "briannasmith93@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Development"],
        "teamsAdvising": []
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1003655084",
        "accountEmail": "kelly.williams@gatech.edu",
        "name": "Kelly Williams",
        "gtID": "1003655084",
        "contactEmails": ["kelly.williams@gatech.edu", "kellywilliams@yahoo.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Engineering"],
        "teamsAdvising": ["CAD"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1013655084",
        "accountEmail": "william.martinez@gatech.edu",
        "name": "William Martinez",
        "gtID": "1013655084",
        "contactEmails": ["william.martinez@gatech.edu", "wmartinez789@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Marketing"],
        "teamsAdvising": ["Design"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1023655084",
        "accountEmail": "natalie.jones@gatech.edu",
        "name": "Natalie Jones",
        "gtID": "1023655084",
        "contactEmails": ["natalie.jones@gatech.edu", "nataliejones333@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Outreach"],
        "teamsAdvising": []
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1033655084",
        "accountEmail": "samuel.wilson@gatech.edu",
        "name": "Samuel Wilson",
        "gtID": "1033655084",
        "contactEmails": ["samuel.wilson@gatech.edu", "samuelw@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Operations"],
        "teamsAdvising": ["Design"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1043655084",
        "accountEmail": "lauren.lee@gatech.edu",
        "name": "Lauren Lee",
        "gtID": "1043655084",
        "contactEmails": ["lauren.lee@gatech.edu", "laurenlee6789@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Design"],
        "teamsAdvising": ["Marketing"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1053655084",
        "accountEmail": "jackson.martinez@gatech.edu",
        "name": "Jackson Martinez",
        "gtID": "1053655084",
        "contactEmails": ["jackson.martinez@gatech.edu", "jacksonm10@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Development"],
        "teamsAdvising": ["Operations"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1063655084",
        "accountEmail": "hannah.martinez@gatech.edu",
        "name": "Hannah Martinez",
        "gtID": "1063655084",
        "contactEmails": ["hannah.martinez@gatech.edu", "hannahm@xyz.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Marketing"],
        "teamsAdvising": []
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1073655084",
        "accountEmail": "chloe.smith@gatech.edu",
        "name": "Chloe Smith",
        "gtID": "1073655084",
        "contactEmails": ["chloe.smith@gatech.edu", "chloesmith999@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Engineering"],
        "teamsAdvising": ["Development"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1083655084",
        "accountEmail": "james.brown@gatech.edu",
        "name": "James Brown",
        "gtID": "1083655084",
        "contactEmails": ["james.brown@gatech.edu", "jamesbrown12@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["CAD"],
        "teamsAdvising": []
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    },
    {
      "identifiers": {
        "userID": "1093655084",
        "accountEmail": "isabelle.white@gatech.edu",
        "name": "Isabelle White",
        "gtID": "1093655084",
        "contactEmails": ["isabelle.white@gatech.edu", "isabwhite@gmail.com"]
      },
      "roles": {
        "role": "Member",
        "isAdmin": false
      },
      "teams": {
        "teamMembership": ["Development"],
        "teamsAdvising": ["Design"]
      },
      "moduleProgress": [
        {
          "moduleName": "3D Printing",
          "percentComplete": 59.6,
          "isAssigned": true,
          "subsectionsComplete": ["Kookaburra watching", "Learn to catch a crikey", "Explore Queensland"]
        }
      ]
    }
  ];
  


export default membersSample;