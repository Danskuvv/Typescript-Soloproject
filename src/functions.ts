const fetchData = async (url: string, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occured`);
  }
  const json = response.json();
  return json;
};


const fetchData2 = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Error ${response.status} occured`);
  }
  const json = response.json();
  return json;
};

export {fetchData};

export {fetchData2};
