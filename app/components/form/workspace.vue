<script setup lang='ts'>
const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    name?: string
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string): void
}>();

const { handleSubmit, resetForm } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
        })
    ),
});

const name = $veeValidate.useField<string>('name');
if(props.name !== undefined) {
    name.setValue(props.name);
}

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value);
    name.setValue(name.value.value);
    name.meta.touched = false;
    resetForm();
});

</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4'/>
    </form>
</template>
