import ShortUniqueId from 'short-unique-id';

const generate = () => {
    const uuid = new ShortUniqueId({ length: 15 });
    return uuid.randomUUID();
};

export const uuidService = {
    generate
}