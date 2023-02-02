import { AsyncData } from '#app';
import { Template } from '~/composables/types';

export const useTemplate = () => {
    const templateUrlPrefix = '/template';

    const createTemplate = async (
        name: string,
        ontologyFileUuid: string
    ): Promise<AsyncData<Template, any>> => {
        const body = { name: name, ontologyFileUuid:  ontologyFileUuid };

        return useApiFetch<Template>(
            templateUrlPrefix,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const getTemplates = async (): Promise<AsyncData<Template[], any>> => {
        return useApiFetch<Template[]>(templateUrlPrefix);
    }

    const getTemplateBpmnFile = async (templateUuid: string): Promise<AsyncData<string, any>> => {
        return useApiFetch<string>(`${templateUrlPrefix}/${templateUuid}/file`);
    }

    const saveTemplateBpmnFile = async (templateUuid: string, xml: string): Promise<AsyncData<void, any>> => {
        return useApiFetch<void>(`${templateUrlPrefix}/save-file`, {
            method: 'PATCH',
            body: {
                templateUuid: templateUuid,
                bpmnFileData: xml
            }
        });
    }

    return {
        createTemplate: createTemplate,
        getTemplates: getTemplates,
        getTemplateBpmnFile: getTemplateBpmnFile,
        saveTemplateBpmnFile: saveTemplateBpmnFile,
    };
}
