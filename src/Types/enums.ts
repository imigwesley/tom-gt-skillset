export enum UserRoles {
    MEMBER,
    PRESIDENT,
    VICE_PRESIDENT,
    TREASURER,
    SOCIAL_CHAIR,
    WEBMASTER
}

export enum ModalPages {
    NULL,
    EDIT_USER,
    SELECT_USER,
    CONFIRM_SAVE_USER,
    CONFIRM_DELETE_USER,
    EDIT_TEAM,
    SELECT_TEAM,
    CONFIRM_SAVE_TEAM,
    CONFIRM_DELETE_TEAM,
    EDIT_SUBSECTION,
    SELECT_SUBSECTION,
    CONFIRM_SAVE_SUBSECTION,
    CONFIRM_DELETE_SUBSECTION,
    EDIT_ACTIVITY,
    SELECT_ACTIVITY,
    CONFIRM_SAVE_ACTIVITY,
    CONFIRM_DELETE_ACTIVITY,
};

export enum Operations {
    NULL,
    EDIT_SELF,
    ADD_USER,
    EDIT_USER,
    DELETE_USER,
    ADD_TEAM,
    EDIT_TEAM,
    DELETE_TEAM,
    ADD_SUBSECTION,
    EDIT_SUBSECTION,
    DELETE_SUBSECTION,
    ADD_ACTIVITY,
    EDIT_ACTIVITY,
    DELETE_ACTIVITY
};

export const StepSets: Record<Operations, ModalPages[]> = {
    [Operations.NULL]: [ModalPages.NULL],
    [Operations.ADD_USER]: [ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    [Operations.EDIT_USER]: [ModalPages.SELECT_USER, ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    // no need to select user when editing own profile
    [Operations.EDIT_SELF]: [ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    [Operations.DELETE_USER]: [ModalPages.SELECT_USER, ModalPages.CONFIRM_DELETE_USER],
  
    [Operations.ADD_TEAM]: [ModalPages.EDIT_TEAM, ModalPages.CONFIRM_SAVE_TEAM],
    [Operations.EDIT_TEAM]: [ModalPages.SELECT_TEAM, ModalPages.EDIT_TEAM, ModalPages.CONFIRM_SAVE_TEAM],
    [Operations.DELETE_TEAM]: [ModalPages.SELECT_TEAM, ModalPages.CONFIRM_DELETE_TEAM],
  
    [Operations.ADD_SUBSECTION]: [ModalPages.EDIT_SUBSECTION, ModalPages.CONFIRM_SAVE_SUBSECTION],
    [Operations.EDIT_SUBSECTION]: [ModalPages.SELECT_SUBSECTION, ModalPages.EDIT_SUBSECTION, ModalPages.CONFIRM_SAVE_SUBSECTION],
    [Operations.DELETE_SUBSECTION]: [ModalPages.SELECT_SUBSECTION, ModalPages.CONFIRM_DELETE_SUBSECTION],
  
    [Operations.ADD_ACTIVITY]: [ModalPages.EDIT_ACTIVITY, ModalPages.CONFIRM_SAVE_ACTIVITY],
    [Operations.EDIT_ACTIVITY]: [ModalPages.SELECT_ACTIVITY, ModalPages.EDIT_ACTIVITY, ModalPages.CONFIRM_SAVE_ACTIVITY],
    [Operations.DELETE_ACTIVITY]: [ModalPages.SELECT_ACTIVITY, ModalPages.CONFIRM_DELETE_ACTIVITY],
};

export enum SubmissionStatus {
    NOT_SUBMITTED,
    PENDING,
    APPROVED,
    REJECTED
}