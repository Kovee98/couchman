let format = {
    size: (size) => {
        let n = 0;
        while (size > 999) {
            size *= 0.1;
            n++;
        }

        return `${size.toFixed(1)} ${suffix(n)}B`;
    }
};

function suffix (n) {
    switch (n) {
    case 1: return 'K';
    case 2: return 'M';
    case 3: return 'G';
    case 4: return 'T';
    default: return '';
    };
}

export default format;
