import { GenericEntity } from "src/core/generic.entity";
import { Column, Entity } from "typeorm";

export enum GitProviderType {
    GITHUB = "github",
    GITLAB = "gitlab"
}

@Entity()
export class GitProvider extends GenericEntity {

    @Column({ type: "varchar" })
    provider: GitProviderType;

    // TODO: for rest of the attributes look into docs
}