import { AuthUser } from "@aws-amplify/auth";
import { AuthEventData } from "@aws-amplify/ui";
import { ModalPages, Operations, SubmissionStatus } from "./enums";
import { ActivityInformation, ActivitySubmissions, MemberInformation, ResponseInfo, SubmissionInformation, SubsectionInformation, TeamInformation } from "./types";

export interface AdminModalProps {
    currentOperation: Operations,
    closeModal: () => void,
    passResponseProgress?: (arg: ResponseInfo) => void,
    currentUser?: MemberInformation,
}

export interface AdminModalContentProps {
    userInput?: MemberInformation | ActivityInformation | SubsectionInformation | TeamInformation,
    editOrCreate?: string,
    saveOrDelete?: string,
    tempImage?: string,
    activityChosen?: string,
    onApiInformationUpdate?: (info: MemberInformation | ActivityInformation | SubsectionInformation | TeamInformation) => void,
    onImageProvided?:(file: File) => void,
    onLocalUrlCreated?:(tempUrl: string) => void,
    onActivityChosenForSubsection?:(activity: string) => void,
    onNameFirstChanged?:(name: string) => void,
}

export interface PageProps {
    loggedInUser: AuthUser | undefined,
    onUserCreation?: () => void | undefined
}

// navbar component
export interface NavbarProps {
    signOutFunction: ((data?: AuthEventData | undefined) => void) | undefined,
    loggedInUser: AuthUser | undefined
}

// member card component
export interface MemberCardProps {
    member: MemberInformation,
    isEven: boolean,
    isFirst: boolean,
    isLast: boolean
}

// submission row component
export interface TableRowProps {
    rowInformation: SubmissionInformation,
    loggedInUser: AuthUser | undefined,
    personal: boolean
}

// add/order subsections for activity component
export interface OrderedSubsectionsProps {
    allSubsections: SubsectionInformation[],
    initialChosenOptions: string[],
    onChange: (arg: string[]) => void
}

export interface SubmissionUploadProps {
    loggedInUser: AuthUser | undefined,
    subsection: string,
    currActivity: string | undefined,
    passResponseProgress: (arg: ResponseInfo) => void,
}

// review progress page component
export interface ReviewProgressProps {
    isPersonal: boolean,
    activitySubmissions: ActivitySubmissions[],
    allUsers: MemberInformation[],
    passResponseProgress?: (arg: ResponseInfo) => void,
    onUpdateSubmission: () => void
}

// subsection link
export interface SubsectionLinkProps {
    status: SubmissionStatus,
    name: string,
    hasDeliverable: boolean | undefined,
    isCurrent: boolean,
    index: number
}