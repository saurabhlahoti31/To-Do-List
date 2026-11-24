const YMD_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

const pad = (value) => String(value).padStart(2, '0');

export const getTodayYmd = () => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const toDateInputValue = (value) => {
    if (!value) return '';
    const match = String(value).match(YMD_PATTERN);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const parseDueDateYmd = (value) => {
    if (value === undefined || value === null || String(value).trim() === '') {
        return { error: 'Due Date is required.' };
    }

    const raw = String(value).trim();
    const match = raw.match(YMD_PATTERN);
    if (!match) {
        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) {
            return { error: 'Due Date must be a valid date.' };
        }
        return {
            ymd: `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`
        };
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);

    if (
        Number.isNaN(date.getTime()) ||
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return { error: 'Due Date is not a valid calendar date.' };
    }

    return { ymd: `${match[1]}-${match[2]}-${match[3]}` };
};

export const formatDueDate = (value) => {
    const ymd = toDateInputValue(value);
    if (!ymd) return '';
    const [year, month, day] = ymd.split('-');
    return `${day}/${month}/${year}`;
};

export const compareYmd = (left, right) => {
    if (left === right) return 0;
    return left < right ? -1 : 1;
};

export const getDueDateStatus = (task) => {
    if (task?.completed) return 'completed';

    const ymd = toDateInputValue(task?.dueDate);
    if (!ymd) return 'none';

    const today = getTodayYmd();
    const comparison = compareYmd(ymd, today);
    if (comparison === 0) return 'today';
    if (comparison > 0) return 'upcoming';
    return 'overdue';
};

export const getDueDateStatusLabel = (task) => {
    const status = getDueDateStatus(task);
    switch (status) {
        case 'completed':
            return '✓ Completed';
        case 'today':
            return '⚠️ Due Today';
        case 'overdue':
            return '🔴 Overdue';
        case 'upcoming':
            return `📅 Due: ${formatDueDate(task.dueDate)}`;
        default:
            return '';
    }
};

export const validateDueDate = (value, { isCreate = false } = {}) => {
    const parsed = parseDueDateYmd(value);
    if (parsed.error) return parsed.error;

    if (isCreate && compareYmd(parsed.ymd, getTodayYmd()) < 0) {
        return 'Due Date cannot be earlier than today.';
    }

    return null;
};
