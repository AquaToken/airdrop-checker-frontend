export const truncateKey = (key, length = 8) => {
    if (!key) {
        return '';
    }
    const keyLength = key.length;
    if (keyLength <= length * 2) {
        return key;
    }
    return `${key.substring(0, length)}…${key.substring(keyLength - length)}`;
};
