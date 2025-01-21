import { Ref } from "react";

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
    gtID: string,
    name: string,
    email: string[],
    teamMembership: string[],
    teamsAdvising: string[],
    role: string,
    isExec: boolean,
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