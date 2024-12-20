import {
    Collection,
    Entity,
    EntityRepositoryType,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { OntologyFileRepository } from './ontologyFIle.repository';
import { CreateFileOntologyDto } from '../dto/create-file-ontology.dto';
import { OntologyNode } from '../ontologyNode/ontologyNode.entity';
import { Template } from '../../template/template.entity';
import { TurtleData } from '../../shared/turtle/turtle.data';
import { OntologyRelation } from '../ontologyRelation/ontologyRelation.entity';
import { Uuid } from '../../common/uuid/uuid';
import { UuidInterface } from '../../common/uuid/uuid.interface';
import { EditFileOntologyDto } from '../dto/edit-file-ontology.dto';

@Entity({ customRepository: () => OntologyFileRepository })
export class OntologyFile {
    [EntityRepositoryType]?: OntologyFileRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @Property()
    private createDate!: Date;

    @OneToMany('OntologyNode', 'ontologyFile')
    private ontologyNodes = new Collection<OntologyNode>(this);

    @OneToMany('Template', 'ontologyFile')
    private templates = new Collection<Template>(this);

    @Property()
    private deleted!: boolean;

    private constructor(uuid: UuidInterface, name: string, createDate: Date) {
        this.uuid = uuid.asString();
        this.name = name;
        this.createDate = createDate;
        this.deleted = false;
    }

    public static create(
        turtleData: TurtleData,
        createFileOntologyDto: CreateFileOntologyDto,
    ): OntologyFile {
        const uuid = Uuid.createV4();
        const date = new Date();
        const ontologyFile = new OntologyFile(
            uuid,
            createFileOntologyDto.name,
            date,
        );

        const ontologyNodes = new Map<string, OntologyNode>();
        for (const createNodeOntologyDto of turtleData.createNodeOntologyDtos) {
            const ontologyNode = OntologyNode.create(
                ontologyFile,
                createNodeOntologyDto,
            );

            ontologyNodes.set(ontologyNode.getName(), ontologyNode);
        }

        for (const createRelationOntologyDto of turtleData.createRelationOntologyDtos) {
            OntologyRelation.create(
                ontologyNodes.get(createRelationOntologyDto.sourceRef),
                ontologyNodes.get(createRelationOntologyDto.targetRef),
            );
        }

        return ontologyFile;
    }

    public edit(editFileOntologyDto: EditFileOntologyDto): OntologyFile {
        this.name = editFileOntologyDto.name;
        return this;
    }

    public delete(): void {
        this.deleted = true;
    }

    public async getNodes(): Promise<OntologyNode[]> {
        return this.ontologyNodes.loadItems();
    }

    public async getNodesSortedByName(): Promise<OntologyNode[]> {
        return (await this.getNodes())
            .sort((a: OntologyNode, b: OntologyNode): number => {
                const aName = a.getName();
                const bName = b.getName();

                return aName > bName ? 1 : bName > aName ? -1 : 0;
            });
    }

    public getName(): string {
        return this.name;
    }
}
