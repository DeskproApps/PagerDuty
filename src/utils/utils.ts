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

export const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " yea";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " mon";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hou";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " min";
  }
  return Math.floor(seconds) + " sec";
};

export const makeFirstLetterUppercase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDateSince = (date: Date) => {
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
  const yearDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 365));
  const monthDiff = Math.floor(timeDiff / (1000 * 3600 * 24 * 30));
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (yearDiff > 0) return `${yearDiff}y`;

  if (monthDiff > 0) return `${monthDiff}mo`;

  return `${dayDiff}d`;
};
