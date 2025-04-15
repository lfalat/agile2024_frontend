import { Dayjs } from "dayjs";
import { EmployeeCard } from "../EmployeeCard";

export type CourseResponse = {
    Name: string
    DetailDescription: string
    CreatedUserId: string
    Employees: string[]
    Type: string
    Files: FilePath[]
    Version: number
    ExpirationDate: Dayjs
};
export type FilePath = {
    Description: string
    FilePath: string
};