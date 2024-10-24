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

export interface ModulesPromise {
    moduleName: string,
    subsections: string[],
    imageURL: string
}

export interface ModuleProgress {
    moduleName: string,
    percentComplete: number,
    isAssigned: boolean,
    subsectionsComplete: string[]
}

export interface AdminModalContentProps {
    page: ModalPages,
    passedApiInformation: ApiInformation,
    onApiInformationUpdate: (info: MemberInformation | ModuleInformation | SubsectionInformation | TeamInformation) => void;
}

export interface TeamInformation {
    teamName: string,
    membership: string[],
    advisors: string[]
}

export interface SubsectionInformation {
    moduleName: string,
    subsectionName: string,
    subsectionHtml: string
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

export interface MyInterface {
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

export interface ApiInformation {
    user: MemberInformation | undefined,
    module: ModuleInformation | undefined,
    subsection: SubsectionInformation | undefined,
    team: TeamInformation | undefined
}

export interface NameGTidMap {
    [key: string]: string
}