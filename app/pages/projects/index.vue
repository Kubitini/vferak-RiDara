<script setup lang='ts'>
useHead({
    title: useTitle().createTitle('Projects'),
});

import { Project } from '~/composables/types';

const { getWorkspace, getWorkspaces } = useWorkspace();
const { getCurrentWorkspace } = useCurrentWorkspace();
const { getTemplates } = useTemplate();
const { getProjects, createProject, importProject, updateProject, deleteProject } = useProject();

const { modalState: createState, openModal: createOpen, closeModal: createClose } = useModal('project-create');
const { modalState: importState , openModal: importOpen, closeModal: importClose } = useModal('project-import');
const { modalState: editState, openModal: editOpen, closeModal: editClose } = useModal('project-edit');

const currentWorkspace = await getCurrentWorkspace();

const { data: projects, refresh: refreshProject } = await getProjects(currentWorkspace!.value!.uuid);
const { data: templates } = await getTemplates();

const { data: workspace } = await getWorkspace(currentWorkspace!.value!.uuid);
const { data: workspaces } = await getWorkspaces();
const exist = computed(() => projects.value !== null && projects.value?.length === 0);

const projectToEdit = useState<Project>();

const create = async (name: string, templateUuid: string, blankFile: boolean): Promise<void> => {
    await createProject(name, workspace.value!, templateUuid, blankFile);
    await refreshProject();
    createClose();
};

const upload = async (name: string, file: File, templateUuid: string): Promise<void> => {
    await importProject(name, workspace.value!.uuid, file, templateUuid);
    await refreshProject();
    importClose();
};

const editProject = async (name: string, workspace: string, templateUuid: string): Promise<void> => {
    await updateProject(projectToEdit.value.uuid, name, workspace, templateUuid);
    await refreshProject();
    editClose();
};

const emitValueEdit = async (project: Project): Promise<void> => {
    editOpen();
    projectToEdit.value = project;
}

const emitValueDelete = async (project: Project): Promise<void> => {
    const confirmed = confirm('Are you sure you want to delete this project? Project will be permanently deleted.');
    if (confirmed) {
        await deleteProject(project.uuid);
        await refreshProject();
    }
}

</script>

<template>
    <div>
        <LayoutGridList title='Projects'>
            <template v-slot:headerButtons>
                <button @click='createOpen' class='btn btn-secondary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                    New project
                </button>

                <button @click='importOpen' class='btn btn-secondary ml-4 mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                    Import project
                </button>
            </template>

            <template v-slot:alerts>
                <AlertInform v-if='exist' class='mb-6 mt-4'>You do not have any projects. Please create new project!</AlertInform>
            </template>

            <template v-slot:grid>
                <CardsProjectCard v-for='project in projects' :key='project.uuid' :project='project' @delete-project='emitValueDelete' @edit-project='emitValueEdit'/>
            </template>
        </LayoutGridList>

        <Modal v-model='createState'>
            <h3 class='text-lg font-bold'>Create new project</h3>
            <FormProject @form-sent='create' :templates='templates' />
        </Modal>
        <Modal v-model='importState'>
            <h3 class='text-lg font-bold'>Import project</h3>
            <FormImportProjectFile @form-sent='upload' :templates='templates' />
        </Modal>
        <Modal v-model='editState' v-if='editState'>
            <h3 class='text-lg font-bold'>Edit project</h3>
            <FormEditProject @form-sent='editProject' :workspaces='workspaces' :workspace-uuid='projectToEdit.workspace.uuid' :templates='templates' :name='projectToEdit.name' :template-name='projectToEdit.templateVersion.template.name' :template-uuid='projectToEdit.templateVersion.template.uuid'/>
        </Modal>
    </div>
</template>
