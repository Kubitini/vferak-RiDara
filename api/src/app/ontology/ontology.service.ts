import { Injectable } from '@nestjs/common';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyFileRepository } from './ontologyFile/ontologyFIle.repository';
import { OntologyNodeRepository } from './ontologyNode/ontologyNode.repository';
import { OntologyFile } from './ontologyFile/ontologyFile.entity';
import { OntologyNode } from './ontologyNode/ontologyNode.entity';
import { BpmnElementData } from '../bpmn/bpmnElement.data';
import { TurtleData } from '../shared/turtle/turtle.data';
import { EditFileOntologyDto } from './dto/edit-file-ontology.dto';
import { Project } from '../project/project.entity';

@Injectable()
export class OntologyService {
    public constructor(
        private readonly ontologyFileRepository: OntologyFileRepository,
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async getOneFileByUuid(uuid: string): Promise<OntologyFile> {
        return this.ontologyFileRepository.findOneOrFail({ uuid: uuid, deleted: false });
    }

    public async getOneNodeByUuid(uuid: string): Promise<OntologyNode> {
        return this.ontologyNodeRepository.findOneOrFail({ uuid: uuid });
    }

    public async findAllSorted(): Promise<OntologyFile[]> {
        return (await this.ontologyFileRepository.find({ deleted: false }))
            .sort(
                (a: OntologyFile, b: OntologyFile): number => {
                    const aName = a.getName();
                    const bName = b.getName();
                    return aName > bName ? 1 : bName > aName ? -1 : 0;
                }
            );
    }

    public async getAllNodesByFile(
        ontologyFile: OntologyFile,
    ): Promise<OntologyNode[]> {
        return this.ontologyNodeRepository.find({ ontologyFile: ontologyFile });
    }

    public async createOntologyFile(
        turtleData: TurtleData,
        createFileOntologyDto: CreateFileOntologyDto,
    ): Promise<void> {
        const ontologyFile = OntologyFile.create(
            turtleData,
            createFileOntologyDto,
        );

        await this.ontologyFileRepository.persistAndFlush(ontologyFile);
    }

    public async getNodesByBPMNData(
        bpmnElementData: BpmnElementData[],
    ): Promise<string[]> {
        const elements: string[] = [];
        for (const element of bpmnElementData) {
            if (element.getElementId() === undefined) {
                elements.push(element.getUpmmName());
            } else {
                elements.push(element.getElementId());
            }
        }
        return elements.sort();
    }

    public async editFile(
        ontologyFile: OntologyFile,
        editFileOntologyDto: EditFileOntologyDto
    ): Promise<OntologyFile> {
        ontologyFile.edit(editFileOntologyDto);
        await this.ontologyFileRepository.flush();

        return ontologyFile;
    }

    public async deleteFile(ontologyFile: OntologyFile): Promise<void> {
        ontologyFile.delete();
        await this.ontologyFileRepository.flush();
    }
}
