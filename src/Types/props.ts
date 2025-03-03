import { AuthUser } from "@aws-amplify/auth";
import { AuthEventData } from "@aws-amplify/ui";
import { ModalPages, Operations } from "./enums";
import { ActivityInformation, MemberInformation, SubmissionInformation, SubsectionInformation, TeamInformation } from "./types";

export interface AdminModalProps {
    currentOperation: Operations,
    closeModal: () => void,
    passResponseProgress: (waiting: boolean, response: { isSuccess: boolean | null; message: string; }) => void,
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

// order, add subsections to activity props
export interface OrderedSubsectionsProps {
    allSubsections: SubsectionInformation[],
    initialChosenOptions: string[],
    onChange: (arg: string[]) => void
}