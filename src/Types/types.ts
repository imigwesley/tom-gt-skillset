import { AuthUser } from "@aws-amplify/auth";
import { AuthEventData } from "@aws-amplify/ui";
import { ReactNode } from "react";

export enum ModalPages {
    NULL,
    EDIT_USER,
    SELECT_USER,
    EDIT_TEAM,
    SELECT_TEAM,
    EDIT_SUBSECTION,
    SELECT_SUBSECTION,
    EDIT_MODULE,
    SELECT_MODULE,
    CONFIRM_SAVE_USER,
    CONFIRM_SAVE_MODULE,
    CONFIRM_SAVE_SUBSECTION,
    CONFIRM_SAVE_TEAM,
    CONFIRM_DELETE_USER,
    CONFIRM_DELETE_MODULE,
    CONFIRM_DELETE_SUBSECTION,
    CONFIRM_DELETE_TEAM,
};

export enum Operations {
    NULL,
    ADD_USER,
    EDIT_USER,
    DELETE_USER,
    ADD_TEAM,
    EDIT_TEAM,
    DELETE_TEAM,
    ADD_SUBSECTION,
    EDIT_SUBSECTION,
    DELETE_SUBSECTION,
    ADD_MODULE,
    EDIT_MODULE,
    DELETE_MODULE
};

export const StepSets: Record<Operations, ModalPages[]> = {
    [Operations.NULL]: [ModalPages.NULL],
    [Operations.ADD_USER]: [ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    [Operations.EDIT_USER]: [ModalPages.SELECT_USER, ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    [Operations.DELETE_USER]: [ModalPages.SELECT_USER, ModalPages.CONFIRM_DELETE_USER],
  
    [Operations.ADD_TEAM]: [ModalPages.EDIT_TEAM, ModalPages.CONFIRM_SAVE_TEAM],
    [Operations.EDIT_TEAM]: [ModalPages.SELECT_TEAM, ModalPages.EDIT_TEAM, ModalPages.CONFIRM_SAVE_TEAM],
    [Operations.DELETE_TEAM]: [ModalPages.SELECT_TEAM, ModalPages.CONFIRM_DELETE_TEAM],
  
    [Operations.ADD_SUBSECTION]: [ModalPages.EDIT_SUBSECTION, ModalPages.CONFIRM_SAVE_SUBSECTION],
    [Operations.EDIT_SUBSECTION]: [ModalPages.SELECT_SUBSECTION, ModalPages.EDIT_SUBSECTION, ModalPages.CONFIRM_SAVE_SUBSECTION],
    [Operations.DELETE_SUBSECTION]: [ModalPages.SELECT_SUBSECTION, ModalPages.CONFIRM_DELETE_SUBSECTION],
  
    [Operations.ADD_MODULE]: [ModalPages.EDIT_MODULE, ModalPages.CONFIRM_SAVE_MODULE],
    [Operations.EDIT_MODULE]: [ModalPages.SELECT_MODULE, ModalPages.EDIT_MODULE, ModalPages.CONFIRM_SAVE_MODULE],
    [Operations.DELETE_MODULE]: [ModalPages.SELECT_MODULE, ModalPages.CONFIRM_DELETE_MODULE],
};

export interface ModuleProgress {
    moduleName: string,
    percentComplete: number,
    isAssigned: boolean,
    subsectionsComplete: string[]
}

export interface AdminModalContentProps {
    page: ModalPages,
    passedApiInformation: ApiReceiveInformation,
    onApiInformationUpdate: (info: MemberInformation | ModuleInformation | SubsectionInformation | TeamInformation) => void;
    onImageProvided:(file: File) => void;
}

export interface TeamInformation {
    teamName: string,
    membership: string[],
    advisors: string[]
}

export interface SubsectionInformation {
    subsectionName: string,
    subsectionHtml: string,
    htmlEdited: boolean
}

export interface MemberInformation {
    identifiers: {
        userID: string,
        accountEmail: string,
        name: string,
        gtID: string,
        contactEmails: string[]
    },
    roles: {
        role: string,
        isAdmin: boolean
    },
    teams: {
        teamMembership: string[],
        teamsAdvising: string[]
    },
    moduleProgress: ModuleProgress[]
}

export interface ModuleInformation {
  moduleName: string,
  subsections: string[],
  imageURL: string
}

export interface PersonalModuleProgress {
  name: string
  modules: MyModulesInterface[]
}

export interface MyModulesInterface {
  isAssigned: boolean | undefined,
  progress: number,
  moduleName: string,
  subsections: string[],
  imageURL: string,
}


export interface APIResponse {
    code: number,
    message: string
}

export interface ApiReceiveInformation {
    users: MemberInformation[] | undefined,
    modules: ModuleInformation[] | undefined,
    subsections: SubsectionInformation[] | undefined,
    teams: TeamInformation[] | undefined
}

export interface ApiSendInformation {
    user: MemberInformation | undefined,
    module: ModuleInformation | undefined,
    subsection: SubsectionInformation | undefined,
    team: TeamInformation | undefined
}

export interface NameGTidMap {
    [key: string]: string
}

export interface PageProps {
    loggedInUser: AuthUser | undefined
}

export interface NavbarProps {
    signOutFunction: ((data?: AuthEventData | undefined) => void) | undefined,
    loggedInUser: AuthUser
}

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

export interface MemberCardProps {
    member: MemberInformation,
    isEven: boolean,
    isFirst: boolean,
    isLast: boolean
}

export interface UserProviderProps {
    children: ReactNode,
    authUser: AuthUser | undefined
}