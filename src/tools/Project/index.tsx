import { LogicalError } from "../Error";


export class Project {
    private static mapWebsites: Map<number, Website>

    public static createWebsite(): void {
        Project.mapWebsites.set(Website.getNextId(), new Website());
    }
    public static getWebsiteById(intWebsiteId: number): Website {
        let website = Project.mapWebsites.get(intWebsiteId);
        if (website === undefined) throw new LogicalError("Project- can't find the website (id: " + intWebsiteId + ")");
        return website;
    }
    public static removeWebsite(intWebsiteId: number): void {
        Project.mapWebsites.delete(intWebsiteId);
    }
}

class Website {
    private static intIdCounter = 0;

    private intId: number;


    constructor(){
        this.intId = Website.getNextId();
    }

    public static getNextId(): number {
        return Website.intIdCounter++;
    }
}