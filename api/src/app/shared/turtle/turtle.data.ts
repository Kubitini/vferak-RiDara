import { CreateNodeOntologyDto } from '../../ontology/dto/create-node-ontology.dto';
import { CreateRelationOntologyDto } from '../../ontology/dto/create-relation-ontology.dto';

// REVIEW: Je nějaká výhoda zde používát třídy namísto interfaců?
export class TurtleData {
    public constructor(
        public readonly createNodeOntologyDtos: CreateNodeOntologyDto[],
        public readonly createRelationOntologyDtos: CreateRelationOntologyDto[],
    ) {}
}
