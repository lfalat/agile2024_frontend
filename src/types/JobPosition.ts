type JobPosition = {
    levels: Array<[string, string]>;
    organizationsID: Array<[string, string]>;
    name: string;
    code: string;
    id: string;
    lastEdited: string; // DateTime in C# would be a string or Date object in TypeScript
    created: string; // DateTime in C# would be a string or Date object in TypeScript
    archived: boolean;
}

export default JobPosition