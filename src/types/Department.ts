export type Department = {
    id: string;
    organizationName: string;
    parentDepartmentId?: string; 
    name: string; 
    code: string; 
    lastEdited: Date;
    created: Date; 
    archived: boolean; 
}