const formatDate = date => {
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    return `${da} ${mo} ${ye}`;
};

export const getFormattedDate = (start, end) => {
    const dateStart = new Date(start);
    const dateEnd = new Date(end);
    return `${formatDate(dateStart)} - ${formatDate(dateEnd)}`;
};
