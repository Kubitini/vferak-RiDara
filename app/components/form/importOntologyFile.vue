<script setup lang='ts'>
import { OntologyFile } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    ontologyFile?: OntologyFile,
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, file: File): void
}>();

const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
            file: $z
                .any()
                .refine(
                    () => props.ontologyFile || fileData.value?.name.split('.').pop() === "ttl",
                    "Only .ttl file is supported."
                )
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const file = $veeValidate.useField<string>('file');

if (props.ontologyFile !== undefined) {
    name.setValue(props.ontologyFile.name);
}

const fileData = useState<File>();

const onChangeFile = (event: any) => {
    const eventFiles = event.target.files;
    if (eventFiles.length !== 0) {
        fileData.value = eventFiles[0];
    }
}

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, fileData.value);
    name.resetField();
    file.resetField();
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4' method="post" enctype="multipart/form-data">
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase v-if='!props.ontologyFile' @change='onChangeFile($event)' :name='"Ontology file"' :type='"file"' :field='file'/>
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4'/>
    </form>
</template>
