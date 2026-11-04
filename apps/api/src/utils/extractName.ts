

export default function breakdownName(name: string) {
    const nameObject = {
        firstName: "",
        lastName:  ""
    };

    const fullName = name.split(" ");

    if(fullName.length === 1) {
        nameObject['firstName'] = fullName.pop()!;
        return nameObject;
    }

    nameObject['lastName'] = fullName.pop()!;
    nameObject['firstName'] = fullName.join(' ');

    return nameObject;
}