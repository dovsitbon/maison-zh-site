export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
