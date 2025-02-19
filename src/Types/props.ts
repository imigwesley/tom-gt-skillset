import { AuthUser } from "@aws-amplify/auth";
import { AuthEventData } from "@aws-amplify/ui";
import { ModalPages } from "./enums";
import { ActivityInformation, ApiReceiveInformation, MemberInformation, SubsectionInformation, TeamInformation } from "./types";

// AdminModalContent component
export interface AdminModalContentProps {
    page: ModalPages,
    passedApiInformation: ApiReceiveInformation,
    isCreatingUser?: boolean,
    onApiInformationUpdate: (info: MemberInformation | ActivityInformation | SubsectionInformation | TeamInformation) => void,
    onImageProvided?:(file: File) => void;
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