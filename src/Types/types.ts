import { SubmissionStatus } from "./enums"

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
    progress: ActivityProgress[],
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

/********************   For tracking user progress (used in MemberInformation)      *******************/
export interface ActivityProgress {
    activityName: string,
    subsectionProgress: SubmissionRecord[]
}

export interface SubmissionRecord {
    subsection: string,
    submissionIds: string[]
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
export interface ActivitySubmissions {
    activityName: string,
    subsectionSubmissions: SubsectionSubmissions[]
}
export interface SubsectionSubmissions {
    subsectionName: string,
    submissions: SubmissionInformation[]
}

export interface SubmissionInformation {
    submissionId: string,
    subsectionName: string,
    timeSubmitted: string,
    status: SubmissionStatus,
    submittedBy: string,
    submissionFiles: string[],
    submissionFeedback: string
}

/********************   Misc.       *******************/
export interface NameGTidMap {
    [key: string]: string
}

export interface ResponseInfo {
    waiting: boolean,
    response: {
        isSuccess: boolean | null,
        message: string
    }
}
