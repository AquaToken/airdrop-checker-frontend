const createRegExp = key => new RegExp(`{{\\s+${key}\\s+}}`, 'g');

export const addDataToTemplate = (data, template) => {
    return Object.entries(data).reduce((result, [key, value]) => {
        const PROP_REG = createRegExp(key);
        return result.replace(PROP_REG, value);
    }, template);
};
