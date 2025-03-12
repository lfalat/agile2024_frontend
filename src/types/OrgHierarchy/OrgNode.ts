type OrgNode  = {
    emplyeeCardId: string,
    userId: string,
    name: string,
    position: string,
    location: string,
    image: string,
    isSuperior: boolean,
    children: OrgNode[],
    expanded: true,
    className: string,
}


export default OrgNode;
