export enum ModalPages {
    NULL,
    EDIT_USER_INFO,
    SELECT_USER,
    CONFIRM_USER,
    CONFIRM_MODULE,
    CONFIRM_SUBSECTION,
    CONFIRM_TEAM,
    CONFIRM_DELETE,
    EDIT_TEAM_INFO,
    SELECT_TEAM,
    EDIT_SUBSECTION,
    SELECT_SUBSECTION,
    EDIT_MODULE,
    SELECT_MODULE
};

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
    membership: number[],
    advisors: number[]
}

export interface SubsectionInformation {
    moduleName: string,
    subsectionName: string,
    subsectionHtml: string
}

export interface ModulesPromise {
    moduleName: string,
    subsections: string[],
    imageURL: string
}


export interface PersonalModuleProgress {
    moduleName: string, 
    percentComplete: number,
    isAssigned: boolean,
    subsectionsComplete: string[]
};

export interface MemberInformation {
    gtID: string,
    name: string,
    email: string[],
    teamMembership: string[],
    teamsAdvising: string[],
    role: string,
    isExec: boolean,
    moduleProgress: PersonalModuleProgress[]
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

