export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getObjectValue = (obj: any, keyString: string) => {
  const keys = keyString.split(".");

  let value = obj;

  for (const key of keys) {
    value = value[key];

    if (value === undefined) {
      return undefined;
    }
  }

  return value;
};

export const makeFirstLetterUppercase = (str: string) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDateSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};
