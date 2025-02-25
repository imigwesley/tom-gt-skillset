/********************   Main data types         *******************/
export interface MemberInformation {
    userId: string,
    identifiers: {
        accountEmail: string,
        name: string,
        gtID: string,
        otherEmails: string[]
    },
    roles: {
        role: string,
        isAdmin: boolean
    },
    teams: {
        teamMembership: string[],
        teamsAdvising: string[]
    },
    progress: ActivityProgress[]
}

export interface TeamInformation {
    teamName: string,
    membership: string[],
    advisors: string[],
    progress: ActivityProgress[]
}

export interface ActivityInformation {
    isTeam: boolean,
    isIndividual: boolean,
    activityName: string,
    subsectionNames: string[],
    imagePath: string
}

export interface SubsectionInformation {
    subsectionName: string,
    subsectionHtml: string,
    hasDeliverable: boolean
}

/********************   Sub Data Types      *******************/
export interface ActivityProgress {
    activityName: string,
    subsectionsComplete: string[]
}

/********************   Sorted members on directory page   *******************/

export interface ByRole {
    members: MemberInformation[],
    officers: MemberInformation[]
}

export interface ByTeam {
    team: string,
    members: MemberInformation[],
    advisors: MemberInformation[]
}

export interface Alphabetically {
    letter: string,
    members: MemberInformation[]
}

/********************   API       *******************/

export interface APIResponse {
    code: number,
    message: string
}

export interface ApiSendInformation {
    user: MemberInformation | undefined,
    activity: ActivityInformation | undefined,
    subsection: SubsectionInformation | undefined,
    team: TeamInformation | undefined
}

/********************   Submission Review       *******************/
export interface SubmissionInformation {
    id: string,
    subsectionName: string,
    timeSubmitted: string,
    isApproved: boolean,
    submittedBy: string,
    submissionFiles: string[]
}

export interface SubsectionSubmissions {
    subsectionName: string,
    submissions: SubmissionInformation[]
}

export interface ActivitySubmissions {
    activityName: string,
    subsectionSubmissions: SubsectionSubmissions[]
}

/********************   Misc.       *******************/
export interface NameGTidMap {
    [key: string]: string
}
