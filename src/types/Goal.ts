type Goal = {
    id: string
    name: string
    description: string
    categoryDescription: string
    statusDescription: string
    dueDate: string
    fullfilmentDate: string
    finishedDate: string
    employee: string
    assignedEmployees?: { id: string; name: string; surname: string }[];
}

export default Goal