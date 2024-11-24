
export type EmployeeCard = {
    employeeId: string;
    id: string;
    email: string;
    birthdate: string | null; 
    position: string;
    startWorkDate: string | null;
    name: string;
    middleName: string;
    titleBefore: string;
    titleAfter: string;
    department: string;
    organization: string;
    contractType: string;
    workPercentage: number | null;
    surname: string;
    location: string;
    archived: boolean;
    employmentDuration:string;
};